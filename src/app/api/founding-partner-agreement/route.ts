import { NextResponse } from "next/server";
import Airtable from "airtable";

const FOUNDER_WAITLIST_TABLE = "Founder Waitlist";

interface AgreementBody {
  venueName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  venueAddress?: string;
  agreedToTerms?: boolean;
}

/**
 * POST /api/founding-partner-agreement
 *
 * Records a founding partner's acceptance of the Plus None Partner
 * Terms + Founding Partner offer.
 *
 * Writes to the "Founder Waitlist" table in the Plus None Sales base
 * — the same table Kate hand-maintains with her active founder
 * pipeline. If a row with this email already exists (she pre-loaded
 * her 5 pitched founders), we UPDATE that row in place with the
 * agreement data so the row stays canonical. Otherwise we CREATE a
 * new row with Source = "Landing Page".
 *
 * Either way, the "Agreed At" timestamp becoming non-empty is Kate's
 * signal that this row has signed the Partner Terms.
 *
 * The IP + User Agent fields are forensic — they're our record that
 * THIS person on THIS device at THIS time clicked agree. If a partner
 * ever disputes the agreement, that's the proof.
 *
 * Expected request body (JSON):
 *   {
 *     venueName: string,           // becomes Name in Airtable
 *     contactName: string,
 *     email: string,
 *     phone: string,
 *     venueAddress: string,        // becomes Business Address
 *     agreedToTerms: true
 *   }
 *
 * 200 → { ok: true, mode: "created" | "updated" }
 * 400 → { error: <human-readable> }   (validation failure)
 * 500 → { error: <human-readable> }   (server/Airtable failure)
 */
export async function POST(req: Request) {
  let body: AgreementBody;
  try {
    body = (await req.json()) as AgreementBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const venueName = body.venueName?.trim();
  const contactName = body.contactName?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim() ?? "";
  const venueAddress = body.venueAddress?.trim();

  if (!venueName || !contactName || !email || !venueAddress) {
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

  // Founder Waitlist lives in the Plus None Sales base. PAT has
  // read+write scope on all tables there since the recent rotation.
  const apiKey =
    process.env.AIRTABLE_BUSINESS_API_KEY ??
    process.env.AIRTABLE_API_KEY;
  const baseId =
    process.env.AIRTABLE_BUSINESS_BASE_ID ?? "appNewsi5A4VKSs4g";
  if (!apiKey) {
    console.error(
      "[founding-partner-agreement] AIRTABLE_BUSINESS_API_KEY (or fallback AIRTABLE_API_KEY) not set",
    );
    return NextResponse.json(
      {
        error:
          "Server configuration error. Email plusnone@fetewell.com so we can record your agreement manually.",
      },
      { status: 500 },
    );
  }

  // Forensic capture.
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const agreementFields = {
    Phone: phone,
    "Business Address": venueAddress,
    "Agreed At": new Date().toISOString(),
    "IP Address": ip,
    "User Agent": userAgent,
  };

  try {
    const base = new Airtable({ apiKey }).base(baseId);

    // Find an existing row by email (Kate's manual entries should
    // already have the founder's email set). Use the Airtable
    // filterByFormula because the npm SDK doesn't expose the
    // structured filter API.
    //
    // Escape both backslash and double-quote so that pathological
    // user input (e.g. an email ending in `\`) can't break out of the
    // string literal in the formula. Order matters: backslash first,
    // then quotes, so the doubled backslashes from step 1 aren't
    // re-escaped in step 2.
    const escapedEmail = email
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"');
    const existing = await base(FOUNDER_WAITLIST_TABLE)
      .select({
        filterByFormula: `LOWER({Email}) = LOWER("${escapedEmail}")`,
        maxRecords: 1,
      })
      .all();

    if (existing.length > 0) {
      // Update in place — only the new (agreement) fields. Leave
      // Name, Contact Name, Status, Source, Notes, Business Type,
      // Location alone so Kate's pre-existing context survives.
      await base(FOUNDER_WAITLIST_TABLE).update(
        existing[0].id,
        agreementFields,
      );
      return NextResponse.json({ ok: true, mode: "updated" });
    }

    // No existing row — create one with everything we have.
    await base(FOUNDER_WAITLIST_TABLE).create({
      Name: venueName,
      "Contact Name": contactName,
      Email: email,
      Source: "Landing Page",
      "Date Received": new Date().toISOString().slice(0, 10),
      ...agreementFields,
    });
    return NextResponse.json({ ok: true, mode: "created" });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      "[founding-partner-agreement] Airtable write failed:",
      message,
    );
    return NextResponse.json(
      {
        error:
          "Couldn't save your agreement right now. Try again, or email plusnone@fetewell.com.",
      },
      { status: 500 },
    );
  }
}
