import { NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/authnet";
import { getSalesBase } from "@/lib/sales-base";

const BUSINESS_TABLE = "Business";

/**
 * POST /api/webhooks/authnet
 *
 * Receives asynchronous events from Auth.net so our Airtable
 * Business rows stay in sync with subscription lifecycle (past_due,
 * canceled, renewed, refunded). Auth.net signs each event with
 * HMAC-SHA512 of the raw request body using the AUTHNET_SIGNATURE_KEY.
 * We verify before doing anything else, then dispatch by eventType.
 *
 * Always returns 2xx (unless truly unrecoverable) to prevent Auth.net
 * from retrying — errors are logged and reconciled offline via the
 * Auth.net dashboard. If we return non-2xx, Auth.net retries with
 * exponential backoff for hours, which can amplify Airtable writes.
 *
 * Events handled:
 *   net.authorize.customer.subscription.terminated  → Cancelled
 *   net.authorize.customer.subscription.cancelled   → Cancelled  (legacy name)
 *   net.authorize.customer.subscription.expired     → Cancelled
 *   net.authorize.customer.subscription.suspended   → Payment Failed
 *   net.authorize.payment.authcapture.created       → Active (first real charge)
 *   net.authorize.payment.refund.created            → Notes append
 *   net.authorize.payment.void.created              → Notes append
 *
 * Anything else is logged and ignored.
 */

interface AuthnetWebhookPayload {
  notificationId?: string;
  eventType?: string;
  eventDate?: string;
  webhookId?: string;
  payload?: {
    id?: string; // for subscription events, this is subscriptionId
    subscriptionId?: string;
    entityName?: string;
    // For payment events:
    invoiceNumber?: string;
    amount?: number;
    responseCode?: number | string;
  };
}

async function findRowBySubscriptionId(subscriptionId: string) {
  const base = getSalesBase();
  const escaped = subscriptionId.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const rows = await base(BUSINESS_TABLE)
    .select({
      filterByFormula: `{Auth.net ARB Subscription ID} = "${escaped}"`,
      maxRecords: 1,
    })
    .all();
  return rows[0] ?? null;
}

async function appendNote(rowId: string, line: string): Promise<void> {
  const base = getSalesBase();
  const row = await base(BUSINESS_TABLE).find(rowId);
  const existing = (row.get("Notes") as string | undefined) ?? "";
  const combined = existing ? `${existing}\n${line}` : line;
  await base(BUSINESS_TABLE).update(rowId, { Notes: combined });
}

export async function POST(req: Request) {
  const rawBody = await req.text();
  const signatureHeader = req.headers.get("x-anet-signature");

  if (!verifyWebhookSignature(rawBody, signatureHeader)) {
    // Log but return 401 so Auth.net doesn't retry a spoofed payload
    // forever — legit retries after a config change need the real key.
    console.error("[/api/webhooks/authnet] signature verification failed");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  let evt: AuthnetWebhookPayload;
  try {
    evt = JSON.parse(rawBody) as AuthnetWebhookPayload;
  } catch {
    console.error("[/api/webhooks/authnet] non-JSON body");
    return NextResponse.json({ error: "bad body" }, { status: 400 });
  }

  const eventType = evt.eventType;
  const subscriptionId = evt.payload?.subscriptionId ?? evt.payload?.id;

  try {
    switch (eventType) {
      case "net.authorize.customer.subscription.terminated":
      case "net.authorize.customer.subscription.cancelled":
      case "net.authorize.customer.subscription.expired": {
        if (!subscriptionId) break;
        const row = await findRowBySubscriptionId(subscriptionId);
        if (!row) {
          console.error(
            `[authnet webhook] ${eventType} — no Airtable row for subscription ${subscriptionId}`,
          );
          break;
        }
        const base = getSalesBase();
        await base(BUSINESS_TABLE).update(row.id, {
          Status: "Cancelled",
          "Cancellation Date": new Date().toISOString().slice(0, 10),
        });
        console.log(
          `[authnet webhook] ${eventType} — row ${row.id} → Cancelled`,
        );
        break;
      }

      case "net.authorize.customer.subscription.suspended": {
        if (!subscriptionId) break;
        const row = await findRowBySubscriptionId(subscriptionId);
        if (!row) break;
        const base = getSalesBase();
        await base(BUSINESS_TABLE).update(row.id, {
          Status: "Payment Failed",
        });
        console.log(
          `[authnet webhook] suspended — row ${row.id} → Payment Failed`,
        );
        break;
      }

      case "net.authorize.payment.authcapture.created": {
        // Subscription child-transaction: promotes "Active — Trial" to
        // "Active" on the first successful renewal charge, and always
        // updates Last Payment fields.
        //
        // For non-subscription (event bookings), the payment is
        // captured directly in the callback; this webhook path is a
        // no-op for those.
        if (!subscriptionId) break;
        const row = await findRowBySubscriptionId(subscriptionId);
        if (!row) break;
        const base = getSalesBase();
        const currentStatus = row.get("Status") as string | undefined;
        const nextStatus =
          currentStatus === "Active — Trial" ? "Active" : currentStatus;
        await base(BUSINESS_TABLE).update(row.id, {
          Status: nextStatus,
          "Last Payment Date": new Date().toISOString().slice(0, 10),
          "Last Payment Status": "Success",
        });
        console.log(
          `[authnet webhook] payment captured — row ${row.id} → ${nextStatus}`,
        );
        break;
      }

      case "net.authorize.payment.refund.created":
      case "net.authorize.payment.void.created": {
        if (!subscriptionId) break;
        const row = await findRowBySubscriptionId(subscriptionId);
        if (!row) break;
        await appendNote(
          row.id,
          `${eventType} at ${new Date().toISOString()}` +
            (evt.payload?.amount ? ` amount=$${evt.payload.amount}` : ""),
        );
        break;
      }

      default:
        console.log(
          `[authnet webhook] unhandled event ${eventType ?? "<no type>"}`,
        );
    }
  } catch (err) {
    // Swallow to prevent Auth.net retry storm; log for triage.
    const message = err instanceof Error ? err.message : String(err);
    console.error(
      `[authnet webhook] ${eventType} handling failed: ${message}`,
    );
  }

  return NextResponse.json({ ok: true });
}
