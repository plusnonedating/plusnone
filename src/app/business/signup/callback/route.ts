import {
  createArbSubscription,
  getCustomerProfile,
  newestPaymentProfile,
} from "@/lib/authnet";
import { getSalesBase } from "@/lib/sales-base";
import { topRedirect } from "@/lib/iframe-breakout";

const BUSINESS_TABLE = "Business";
const TRIAL_DAYS = 30;

/**
 * GET /business/signup/callback?rowId=…
 *
 * Auth.net's hosted CIM form redirects here after the user finishes
 * entering their card. This handler:
 *   1. Looks up the pending Airtable Business row by rowId.
 *   2. Retrieves the customer profile from Auth.net to find the
 *      payment profile the user just created.
 *   3. Creates the ARB subscription with startDate = today+30 days.
 *   4. Updates the Airtable row to Status = "Active — Trial".
 *   5. Redirects the visitor to /business/signup/thanks.
 *
 * Trust model: rowId in the URL is opaque but tamperable. We do NOT
 * trust it as authorization; we look up the row, cross-check that its
 * Status is exactly "Pending Payment", and only mutate on that
 * precondition. Idempotent — a returning user (double redirect,
 * back-button) sees the same thanks page and no duplicate ARB.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const rowId = url.searchParams.get("rowId");
  if (!rowId) {
    return topRedirect("/business/signup?error=missing-row");
  }

  const base = getSalesBase();

  let row;
  try {
    row = await base(BUSINESS_TABLE).find(rowId);
  } catch {
    return topRedirect("/business/signup?error=row-not-found");
  }

  const currentStatus = row.get("Status") as string | undefined;
  const customerProfileId = row.get("Auth.net Customer Profile ID") as
    | string
    | undefined;

  // Idempotency: if we've already flipped this row to Active — Trial,
  // don't re-issue the subscription. Just show the thanks page.
  if (currentStatus === "Active — Trial") {
    return topRedirect("/business/signup/thanks");
  }

  if (currentStatus !== "Pending Payment") {
    console.error(
      `[/business/signup/callback] row ${rowId} in unexpected state "${currentStatus}"`,
    );
    return topRedirect("/business/signup?error=bad-state");
  }

  if (!customerProfileId) {
    console.error(
      `[/business/signup/callback] row ${rowId} missing Auth.net Customer Profile ID`,
    );
    return topRedirect("/business/signup?error=no-profile");
  }

  try {
    // Fetch the profile to grab the payment profile the user just
    // attached via the hosted CIM form.
    const profile = await getCustomerProfile(customerProfileId);
    const paymentProfile = newestPaymentProfile(profile);
    const paymentProfileId = paymentProfile.customerPaymentProfileId;

    // 30-day trial mechanic: first real charge lands day 31.
    const start = new Date();
    start.setUTCDate(start.getUTCDate() + TRIAL_DAYS);
    const startDate = start.toISOString().slice(0, 10);

    const { subscriptionId } = await createArbSubscription({
      customerProfileId,
      paymentProfileId,
      // Monthly Amount was written at signup with destination-based
      // tax already applied (MD address → $104.94, elsewhere → $99).
      amountUsd: Number(row.get("Monthly Amount")) || 99,
      startDate,
      billingCycleName: "Plus None Business",
    });

    await base(BUSINESS_TABLE).update(rowId, {
      "Auth.net Payment Profile ID": paymentProfileId,
      "Auth.net ARB Subscription ID": subscriptionId,
      "Trial Ends": startDate,
      Status: "Active — Trial",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[/business/signup/callback] Auth.net or Airtable failure for row ${rowId}:`,
      message,
    );
    return topRedirect("/business/signup?error=arb-failed");
  }

  return topRedirect("/business/signup/thanks");
}
