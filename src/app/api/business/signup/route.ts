import { NextResponse } from "next/server";
import { createCustomerProfile, createHostedProfilePageToken } from "@/lib/authnet";
import { getSalesBase } from "@/lib/sales-base";
import { applyTax, siteOrigin } from "@/lib/site-config";

const BUSINESS_TABLE = "Business";
const BUSINESS_BASE_USD = 99;

interface SignupBody {
  businessName?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  geotagAddress?: string;
  shippingAddress?: string; // may equal geotagAddress if "same as" checkbox
  agreedToTerms?: boolean;
}

/**
 * POST /api/business/signup
 *
 * Step 1 of the Plus None Business subscription flow. Writes a
 * "Pending Payment" row to the Business table and returns a URL +
 * token that the client uses to POST the user to Auth.net's hosted
 * CIM form for card capture.
 *
 * PCI: this endpoint NEVER receives card data. Card entry happens on
 * Auth.net's hosted page after this returns.
 *
 * Returns:
 *   200 { formUrl, token, rowId } on success
 *   400 { error }                 on validation failure
 *   500 { error }                 on Airtable or Auth.net failure
 */
export async function POST(req: Request) {
  let body: SignupBody;
  try {
    body = (await req.json()) as SignupBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const businessName = body.businessName?.trim();
  const contactName = body.contactName?.trim();
  const email = body.email?.trim();
  const phone = body.phone?.trim();
  const geotagAddress = body.geotagAddress?.trim();
  const shippingAddress = body.shippingAddress?.trim() ?? geotagAddress;

  if (
    !businessName ||
    !contactName ||
    !email ||
    !phone ||
    !geotagAddress ||
    !shippingAddress
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

  // Basic email sanity check — Auth.net will reject genuinely
  // malformed emails downstream but we surface it earlier here.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That email doesn't look right — mind checking?" },
      { status: 400 },
    );
  }

  // Forensic capture (same pattern as
  // /api/founding-partner-agreement).
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";

  const notesLines = [
    `Signup IP: ${ip}`,
    `Signup UA: ${userAgent}`,
    `Signup timestamp: ${new Date().toISOString()}`,
  ];
  if (shippingAddress === geotagAddress) {
    notesLines.push("Shipping same as geotag address.");
  }

  try {
    // Step 1: create the Airtable row so we have a stable rowId to
    // thread through the Auth.net return URL.
    const base = getSalesBase();
    const [row] = await base(BUSINESS_TABLE).create([
      {
        fields: {
          "Business Name": businessName,
          "Contact Name": contactName,
          Email: email,
          Phone: phone,
          Status: "Pending Payment",
          "Billing Address": shippingAddress,
          "Shipping Address": shippingAddress,
          "Geotag Address": geotagAddress,
          "Signup Date": new Date().toISOString().slice(0, 10),
          "Monthly Amount": applyTax(BUSINESS_BASE_USD),
          "Payment Provider": "authnet",
          Notes: notesLines.join("\n"),
        },
      },
    ]);
    const rowId = row.id;

    // Step 2: create an empty Auth.net Customer Profile. The card
    // itself is added via the hosted CIM form in the next step.
    const { customerProfileId } = await createCustomerProfile({
      merchantCustomerId: rowId,
      email,
      description: `Plus None Business — ${businessName}`,
    });

    // Persist the customer profile ID so the callback can look it up
    // even if the return URL is tampered with.
    await base(BUSINESS_TABLE).update(rowId, {
      "Auth.net Customer Profile ID": customerProfileId,
    });

    // Step 3: mint the hosted CIM form token. The return URL brings
    // the user back to our callback route, carrying the rowId so we
    // can re-hydrate the pending signup.
    const returnUrl = `${siteOrigin()}/business/signup/callback?rowId=${encodeURIComponent(rowId)}`;
    const { token, formUrl } = await createHostedProfilePageToken({
      customerProfileId,
      returnUrl,
      returnUrlText: "Continue to Plus None",
    });

    return NextResponse.json({ formUrl, token, rowId });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[/api/business/signup] failed:", message);
    return NextResponse.json(
      {
        error:
          "Sorry — we couldn't kick off checkout. Try again in a moment, or email plusnone@fetewell.com.",
      },
      { status: 500 },
    );
  }
}
