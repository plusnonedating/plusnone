import { NextResponse } from "next/server";
import { createHostedPaymentPageToken } from "@/lib/authnet";
import { getSalesBase } from "@/lib/sales-base";
import { isLiveCheckout, siteOrigin } from "@/lib/site-config";

const EVENTS_TABLE = "Events";

type Tier = "single" | "multi";

interface BookingBody {
  eventName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  venueAddress?: string; // geotag
  eventStartDate?: string; // "YYYY-MM-DD"
  eventEndDate?: string; // "YYYY-MM-DD"
  shippingAddress?: string;
  logoUrl?: string;
  agreedToTerms?: boolean;
  tier?: Tier;
}

const TIER_CONFIG: Record<
  Tier,
  { amountUsd: number; tierLabel: string; description: string }
> = {
  single: {
    amountUsd: 499,
    tierLabel: "Single Night ($499)",
    description: "Plus None Event Activation — Single Day (24 hours)",
  },
  multi: {
    amountUsd: 799,
    tierLabel: "Weekend ($799)",
    description: "Plus None Event Activation — Multi-Day (72 hours)",
  },
};

// ────────────────────────────────────────────────────────────────────
// Business-day math for the 14-business-day lead time.
//
// "Business day" = Monday–Friday, excluding federal holidays. We
// deliberately keep this simple (no holiday calendar) because a 14
// business day lead is already generous and edge cases can be
// finalized manually by Kate before signage ships.
// ────────────────────────────────────────────────────────────────────

function businessDaysBetween(from: Date, to: Date): number {
  if (to.getTime() < from.getTime()) return -businessDaysBetween(to, from);
  let count = 0;
  const cursor = new Date(from.getTime());
  cursor.setUTCHours(0, 0, 0, 0);
  const end = new Date(to.getTime());
  end.setUTCHours(0, 0, 0, 0);
  while (cursor.getTime() < end.getTime()) {
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    const dow = cursor.getUTCDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

/**
 * POST /api/events/booking
 *
 * Step 1 of the events one-time booking flow. Validates form,
 * writes a "Pending Payment" row to the Events table, and returns a
 * hosted-payment-page token so the client can bounce the user to
 * Auth.net for card entry + charge.
 *
 * PCI: this endpoint never receives card data. Amount is authoritative
 * server-side — never trust a client-supplied amount.
 *
 * Returns:
 *   200 { formUrl, token, rowId }
 *   400 { error }        validation failure (missing fields, bad tier,
 *                        or event date within 14 business days)
 *   403 { error }        LIVE_CHECKOUT=false
 *   500 { error }        Airtable / Auth.net failure
 */
export async function POST(req: Request) {
  if (!isLiveCheckout()) {
    return NextResponse.json(
      {
        error:
          "Bookings aren't live yet. Please join the waitlist at /events/waitlist.",
      },
      { status: 403 },
    );
  }

  let body: BookingBody;
  try {
    body = (await req.json()) as BookingBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const eventName = body.eventName?.trim();
  const contactName = body.contactName?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const venueAddress = body.venueAddress?.trim();
  const shippingAddress = body.shippingAddress?.trim();
  const logoUrl = body.logoUrl?.trim() ?? "";
  const eventStartDate = body.eventStartDate?.trim();
  const eventEndDate = body.eventEndDate?.trim() || eventStartDate;
  const tier = body.tier;

  if (
    !eventName ||
    !contactName ||
    !email ||
    !phone ||
    !venueAddress ||
    !shippingAddress ||
    !eventStartDate
  ) {
    return NextResponse.json(
      { error: "Please fill in all required fields." },
      { status: 400 },
    );
  }

  if (!body.agreedToTerms) {
    return NextResponse.json(
      { error: "You must accept the Partner Terms to continue." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right — mind checking?" },
      { status: 400 },
    );
  }

  if (tier !== "single" && tier !== "multi") {
    return NextResponse.json(
      { error: "Please pick an activation tier." },
      { status: 400 },
    );
  }
  const tierConfig = TIER_CONFIG[tier];

  // Server-side re-validation of the 14-business-day rule. Client
  // rejects the same case earlier for UX; this is the trust boundary.
  const startTs = Date.parse(eventStartDate);
  if (!Number.isFinite(startTs)) {
    return NextResponse.json(
      { error: "Event start date isn't a valid date." },
      { status: 400 },
    );
  }
  const businessDaysOut = businessDaysBetween(new Date(), new Date(startTs));
  if (businessDaysOut < 14) {
    return NextResponse.json(
      {
        error:
          "Event must be at least 14 business days out to allow signage design + shipping. Pick a later date.",
      },
      { status: 400 },
    );
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const notesLines = [
    `Booking IP: ${ip}`,
    `Booking UA: ${userAgent}`,
    `Booking timestamp: ${new Date().toISOString()}`,
  ];
  if (logoUrl) notesLines.push(`Logo URL: ${logoUrl}`);

  try {
    const base = getSalesBase();
    const [row] = await base(EVENTS_TABLE).create([
      {
        fields: {
          "Event Name": eventName,
          "Business Name": eventName, // Airtable schema has both; keep synced.
          "Contact Name": contactName,
          Email: email,
          Phone: phone,
          Tier: tierConfig.tierLabel,
          Status: "Pending Payment",
          "Event Start Date": eventStartDate,
          "Event End Date": eventEndDate,
          "Venue Address (Geotag)": venueAddress,
          "Shipping Address": shippingAddress,
          "Payment Provider": "authnet",
          Notes: notesLines.join("\n"),
        },
      },
    ]);
    const rowId = row.id;

    const returnUrl = `${siteOrigin()}/events/booking/callback?rowId=${encodeURIComponent(rowId)}`;
    const cancelUrl = `${siteOrigin()}/events?canceled=1`;
    const { token, formUrl } = await createHostedPaymentPageToken({
      amountUsd: tierConfig.amountUsd,
      invoiceNumber: rowId,
      description: `${tierConfig.description} — ${eventName}`,
      returnUrl,
      cancelUrl,
    });

    return NextResponse.json({ formUrl, token, rowId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/events/booking] failed:", message);
    return NextResponse.json(
      {
        error:
          "Sorry — we couldn't kick off checkout. Try again in a moment, or email plusnone@fetewell.com.",
      },
      { status: 500 },
    );
  }
}
