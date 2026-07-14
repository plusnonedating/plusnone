import { getTransactionDetails } from "@/lib/authnet";
import { getSalesBase } from "@/lib/sales-base";
import { topRedirect } from "@/lib/iframe-breakout";

const EVENTS_TABLE = "Events";

/**
 * /events/booking/callback?rowId=…
 *
 * Auth.net returns the user here after the hosted payment page. With
 * `showReceipt: false` in our hosted-page settings, Auth.net POSTs
 * form-encoded transaction data to this URL; some flows also send a
 * GET. Handle both.
 *
 * The transaction ID Auth.net supplies is a soft hint, not a trust
 * anchor. We ignore any client-supplied amount and re-fetch the
 * transaction from Auth.net server-side to confirm status + amount
 * before mutating Airtable. Idempotent: repeat visits are no-ops.
 */

async function handle(req: Request) {
  const url = new URL(req.url);
  const rowId = url.searchParams.get("rowId");
  if (!rowId) {
    return topRedirect("/events?error=missing-row");
  }

  // Auth.net can POST body form-encoded on the return; parse both.
  const params = new URLSearchParams(url.search);
  let bodyTransId: string | null = null;
  if (req.method === "POST") {
    try {
      const raw = await req.text();
      const parsed = new URLSearchParams(raw);
      bodyTransId =
        parsed.get("x_trans_id") ?? parsed.get("transId") ?? null;
    } catch {
      // ignore — we'll fall back to Airtable lookup below
    }
  }
  const transIdHint =
    bodyTransId ?? params.get("x_trans_id") ?? params.get("transId");

  const base = getSalesBase();

  let row;
  try {
    row = await base(EVENTS_TABLE).find(rowId);
  } catch {
    return topRedirect("/events?error=row-not-found");
  }

  const currentStatus = row.get("Status") as string | undefined;

  // Idempotency guard.
  if (currentStatus === "Booked") {
    return topRedirect("/events/booking/thanks");
  }
  if (currentStatus !== "Pending Payment") {
    console.error(
      `[/events/booking/callback] row ${rowId} in unexpected state "${currentStatus}"`,
    );
    return topRedirect("/events?error=bad-state");
  }

  if (!transIdHint) {
    console.error(
      `[/events/booking/callback] row ${rowId} callback missing transactionId hint`,
    );
    return topRedirect("/events?error=missing-transaction");
  }

  try {
    const transaction = await getTransactionDetails(transIdHint);
    // responseCode "1" = approved; anything else is decline / hold / err.
    if (transaction.responseCode !== "1") {
      console.error(
        `[/events/booking/callback] tx ${transIdHint} not approved. responseCode=${transaction.responseCode} reason=${transaction.responseReasonDescription}`,
      );
      await base(EVENTS_TABLE).update(rowId, {
        Status: "Refunded", // best available reject state; Kate reviews manually
        Notes: `${row.get("Notes") ?? ""}\nDeclined at ${new Date().toISOString()} — ${transaction.responseReasonDescription ?? "unknown"}`.trim(),
      });
      return topRedirect("/events?error=declined");
    }

    const amount = Number(transaction.settleAmount ?? transaction.authAmount ?? "0");
    await base(EVENTS_TABLE).update(rowId, {
      "Auth.net Transaction ID": transaction.transId,
      "Amount Paid": amount,
      "Booking Date": new Date().toISOString().slice(0, 10),
      Status: "Booked",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[/events/booking/callback] verification failed for row ${rowId}:`,
      message,
    );
    return topRedirect("/events?error=verify-failed");
  }

  return topRedirect("/events/booking/thanks");
}

export const GET = handle;
export const POST = handle;
