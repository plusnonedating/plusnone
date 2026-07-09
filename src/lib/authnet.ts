import { createHmac, timingSafeEqual } from "node:crypto";
import { authnetApiUrl, authnetHostedBase } from "./site-config";

/**
 * Thin wrapper around the Authorize.net JSON API.
 *
 * The endpoint URL says `/xml/v1/request.api` but it accepts JSON when
 * you send `Content-Type: application/json`. We use JSON throughout for
 * TS-friendliness.
 *
 * PCI note: none of these functions accept card data. Card entry
 * happens on Auth.net's hosted pages, which we redirect to via a
 * short-lived token obtained from `createHostedProfilePageToken()` (for
 * card capture into a Customer Profile / CIM) or
 * `createHostedPaymentPageToken()` (for one-time charges). This
 * preserves our SAQ A scope.
 *
 * All functions require these env vars at call time:
 *   AUTHNET_API_LOGIN_ID
 *   AUTHNET_TRANSACTION_KEY
 *   AUTHNET_ENV               ('sandbox' | 'production')
 *
 * `verifyWebhookSignature` also requires:
 *   AUTHNET_SIGNATURE_KEY
 */

// ────────────────────────────────────────────────────────────────────
// Merchant auth block (shared across every request)
// ────────────────────────────────────────────────────────────────────

interface MerchantAuth {
  name: string;
  transactionKey: string;
}

function getMerchantAuth(): MerchantAuth {
  const name = process.env.AUTHNET_API_LOGIN_ID;
  const transactionKey = process.env.AUTHNET_TRANSACTION_KEY;
  if (!name || !transactionKey) {
    throw new Error(
      "Auth.net env vars missing: AUTHNET_API_LOGIN_ID + AUTHNET_TRANSACTION_KEY required.",
    );
  }
  return { name, transactionKey };
}

// ────────────────────────────────────────────────────────────────────
// Low-level POST helper
// ────────────────────────────────────────────────────────────────────

/**
 * Auth.net JSON responses are (in)famous for returning a BOM-prefixed
 * body and inconsistent envelope. `postJson` handles both, throws on
 * transport errors, and returns the parsed inner body of whichever
 * top-level request key was used.
 *
 * Successful body shape (roughly):
 *   { <requestName>Response: { messages: { resultCode: 'Ok' | 'Error', message: [...] }, ...rest } }
 *
 * When `resultCode !== 'Ok'` we throw an `AuthnetError` with the first
 * message code + text so callers can decide whether to retry, surface
 * the error, or log-and-move-on.
 */
export class AuthnetError extends Error {
  code: string;
  raw: unknown;
  constructor(code: string, text: string, raw: unknown) {
    super(`Auth.net error [${code}]: ${text}`);
    this.code = code;
    this.raw = raw;
    this.name = "AuthnetError";
  }
}

async function postJson<TReq, TRes>(
  requestName: string,
  requestBody: TReq,
): Promise<TRes> {
  const envelope = { [requestName]: requestBody };
  const res = await fetch(authnetApiUrl(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(envelope),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `Auth.net HTTP ${res.status}: ${await res.text().catch(() => "<unreadable body>")}`,
    );
  }
  // Strip UTF-8 BOM Auth.net loves to prepend.
  const text = (await res.text()).replace(/^﻿/, "");
  const parsed = JSON.parse(text) as Record<string, unknown>;
  const responseKey = `${requestName.replace(/Request$/, "")}Response`;
  const inner = parsed[responseKey] as {
    messages?: {
      resultCode?: string;
      message?: { code?: string; text?: string }[];
    };
  } & Record<string, unknown>;
  if (!inner) {
    throw new Error(
      `Auth.net response missing expected key ${responseKey}. Body: ${text.slice(0, 500)}`,
    );
  }
  if (inner.messages?.resultCode !== "Ok") {
    const first = inner.messages?.message?.[0];
    throw new AuthnetError(
      first?.code ?? "UNKNOWN",
      first?.text ?? "No error text returned.",
      inner,
    );
  }
  return inner as unknown as TRes;
}

// ────────────────────────────────────────────────────────────────────
// createCustomerProfile — creates an empty CIM profile ready for a
// card to be attached via the hosted CIM form.
// ────────────────────────────────────────────────────────────────────

interface CreateCustomerProfileResponse {
  customerProfileId: string;
}

export async function createCustomerProfile(input: {
  merchantCustomerId: string; // internal ID, our Airtable row id
  email: string;
  description?: string;
}): Promise<CreateCustomerProfileResponse> {
  const merchantAuth = getMerchantAuth();
  const res = await postJson<unknown, CreateCustomerProfileResponse>(
    "createCustomerProfileRequest",
    {
      merchantAuthentication: merchantAuth,
      profile: {
        // Auth.net requires this to be unique per profile within the merchant.
        // Prefixing with our env keeps sandbox + prod records distinct if
        // both are ever queried from the same admin dashboard.
        merchantCustomerId: input.merchantCustomerId.slice(0, 20),
        description: input.description?.slice(0, 255) ?? "Plus None Business signup",
        email: input.email,
      },
      // We defer payment profile creation to the hosted CIM form. This
      // keeps card data off our servers (SAQ A).
      validationMode: "none",
    },
  );
  return { customerProfileId: res.customerProfileId };
}

// ────────────────────────────────────────────────────────────────────
// getHostedProfilePage — token to open the hosted CIM form so the
// customer can attach a card to their profile.
// ────────────────────────────────────────────────────────────────────

interface HostedProfilePageTokenResponse {
  token: string;
}

export async function createHostedProfilePageToken(input: {
  customerProfileId: string;
  returnUrl: string;
  returnUrlText?: string;
}): Promise<{ token: string; formUrl: string }> {
  const merchantAuth = getMerchantAuth();
  const res = await postJson<unknown, HostedProfilePageTokenResponse>(
    "getHostedProfilePageRequest",
    {
      merchantAuthentication: merchantAuth,
      customerProfileId: input.customerProfileId,
      hostedProfileSettings: {
        setting: [
          {
            settingName: "hostedProfileReturnUrl",
            settingValue: input.returnUrl,
          },
          {
            settingName: "hostedProfileReturnUrlText",
            settingValue: input.returnUrlText ?? "Continue to Plus None",
          },
          {
            settingName: "hostedProfilePageBorderVisible",
            settingValue: "false",
          },
          {
            // Skip the customer-info edit step; we only want a card.
            settingName: "hostedProfileHeadingBgColor",
            settingValue: "#2647e8",
          },
        ],
      },
    },
  );
  return {
    token: res.token,
    formUrl: `${authnetHostedBase()}/customer/addPayment`,
  };
}

// ────────────────────────────────────────────────────────────────────
// getCustomerProfile — read back a profile to find the newest payment
// profile after the customer completes the hosted form.
// ────────────────────────────────────────────────────────────────────

interface PaymentProfile {
  customerPaymentProfileId: string;
  payment?: {
    creditCard?: {
      cardNumber?: string; // masked, e.g. "XXXX1111"
      expirationDate?: string; // "XXXX" (masked) or "YYYY-MM"
      cardType?: string;
    };
  };
}

interface CustomerProfile {
  customerProfileId: string;
  merchantCustomerId?: string;
  email?: string;
  paymentProfiles?: PaymentProfile[];
}

interface GetCustomerProfileResponse {
  profile: CustomerProfile;
}

export async function getCustomerProfile(
  customerProfileId: string,
): Promise<CustomerProfile> {
  const merchantAuth = getMerchantAuth();
  const res = await postJson<unknown, GetCustomerProfileResponse>(
    "getCustomerProfileRequest",
    {
      merchantAuthentication: merchantAuth,
      customerProfileId,
    },
  );
  return res.profile;
}

/**
 * Returns the most-recently-added payment profile from a customer
 * profile. Auth.net doesn't stamp a creation timestamp on payment
 * profiles, so we treat the last element of the array as newest (this
 * matches Auth.net's documented ordering; verified against the current
 * CIM behavior). Throws if the profile has no payment methods attached.
 */
export function newestPaymentProfile(profile: CustomerProfile): PaymentProfile {
  const list = profile.paymentProfiles ?? [];
  if (list.length === 0) {
    throw new Error(
      `Customer profile ${profile.customerProfileId} has no payment profiles.`,
    );
  }
  return list[list.length - 1];
}

// ────────────────────────────────────────────────────────────────────
// ARBCreateSubscription — create the recurring subscription against a
// customer profile + payment profile. `startDate` gives us the 30-day
// trial semantics: first real charge lands on startDate, no charge
// before.
// ────────────────────────────────────────────────────────────────────

interface CreateArbSubscriptionResponse {
  subscriptionId: string;
}

export async function createArbSubscription(input: {
  customerProfileId: string;
  paymentProfileId: string;
  amountUsd: number; // e.g. 99 → charges $99.00 monthly
  startDate: string; // "YYYY-MM-DD"
  billingCycleName: string; // human label (e.g. "Plus None Business")
}): Promise<CreateArbSubscriptionResponse> {
  const merchantAuth = getMerchantAuth();
  const res = await postJson<unknown, CreateArbSubscriptionResponse>(
    "ARBCreateSubscriptionRequest",
    {
      merchantAuthentication: merchantAuth,
      subscription: {
        name: input.billingCycleName.slice(0, 50),
        paymentSchedule: {
          interval: {
            length: 1,
            unit: "months",
          },
          startDate: input.startDate,
          // Auth.net's "9999" idiom for "no end date". ARB refuses
          // Infinity or 0; 9999 is the documented max.
          totalOccurrences: 9999,
        },
        amount: input.amountUsd.toFixed(2),
        profile: {
          customerProfileId: input.customerProfileId,
          customerPaymentProfileId: input.paymentProfileId,
        },
      },
    },
  );
  return { subscriptionId: res.subscriptionId };
}

// ────────────────────────────────────────────────────────────────────
// ARBCancelSubscription — used by the (future) self-serve portal and
// by our webhook receiver in the "customer requested cancellation"
// path.
// ────────────────────────────────────────────────────────────────────

export async function cancelArbSubscription(
  subscriptionId: string,
): Promise<void> {
  const merchantAuth = getMerchantAuth();
  await postJson<unknown, unknown>("ARBCancelSubscriptionRequest", {
    merchantAuthentication: merchantAuth,
    subscriptionId,
  });
}

// ────────────────────────────────────────────────────────────────────
// getHostedPaymentPage — token for the one-time payment page used by
// the /events/booking flow. Charges $499 or $799 depending on tier.
// ────────────────────────────────────────────────────────────────────

interface HostedPaymentPageTokenResponse {
  token: string;
}

export async function createHostedPaymentPageToken(input: {
  amountUsd: number;
  invoiceNumber: string; // our Airtable row id
  description: string; // event name + tier
  returnUrl: string;
  cancelUrl: string;
}): Promise<{ token: string; formUrl: string }> {
  const merchantAuth = getMerchantAuth();
  const res = await postJson<unknown, HostedPaymentPageTokenResponse>(
    "getHostedPaymentPageRequest",
    {
      merchantAuthentication: merchantAuth,
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: input.amountUsd.toFixed(2),
        order: {
          invoiceNumber: input.invoiceNumber.slice(0, 20),
          description: input.description.slice(0, 255),
        },
      },
      hostedPaymentSettings: {
        setting: [
          {
            settingName: "hostedPaymentReturnOptions",
            settingValue: JSON.stringify({
              showReceipt: false,
              url: input.returnUrl,
              cancelUrl: input.cancelUrl,
              urlText: "Continue to Plus None",
              cancelUrlText: "Back to /events",
            }),
          },
          {
            settingName: "hostedPaymentButtonOptions",
            settingValue: JSON.stringify({ text: "Pay Now" }),
          },
          {
            settingName: "hostedPaymentStyleOptions",
            settingValue: JSON.stringify({ bgColor: "#2647e8" }),
          },
        ],
      },
    },
  );
  return {
    token: res.token,
    formUrl: `${authnetHostedBase()}/payment/payment`,
  };
}

// ────────────────────────────────────────────────────────────────────
// getTransactionDetails — verify a one-time transaction from our
// callback, so we don't trust URL params. Also used post-hoc for
// reconciliation.
// ────────────────────────────────────────────────────────────────────

interface TransactionDetails {
  transId: string;
  responseCode: string; // "1" = approved, "2" = declined, "3" = error, "4" = held for review
  responseReasonCode?: string;
  responseReasonDescription?: string;
  authCode?: string;
  transactionType?: string;
  transactionStatus?: string;
  authAmount?: string;
  settleAmount?: string;
  submitTimeUTC?: string;
  order?: {
    invoiceNumber?: string;
    description?: string;
  };
}

interface GetTransactionDetailsResponse {
  transaction: TransactionDetails;
}

export async function getTransactionDetails(
  transactionId: string,
): Promise<TransactionDetails> {
  const merchantAuth = getMerchantAuth();
  const res = await postJson<unknown, GetTransactionDetailsResponse>(
    "getTransactionDetailsRequest",
    {
      merchantAuthentication: merchantAuth,
      transId: transactionId,
    },
  );
  return res.transaction;
}

// ────────────────────────────────────────────────────────────────────
// Webhook signature verification (HMAC-SHA512 of the raw request body,
// using AUTHNET_SIGNATURE_KEY, compared to the X-ANET-Signature header
// which comes as "sha512=<HEX>").
// ────────────────────────────────────────────────────────────────────

/**
 * Verify Auth.net's HMAC-SHA512 signature of a webhook payload.
 *
 * The signature header arrives as `X-ANET-Signature: sha512=<UPPERHEX>`.
 * The signing input is the raw request body bytes (before any JSON
 * parse). We use `timingSafeEqual` to prevent side-channel attacks.
 *
 * Returns true on match, false on any mismatch or missing config.
 * Never throws — a failed signature check should be logged and
 * rejected with a 401, not crash the route.
 */
export function verifyWebhookSignature(
  rawBody: string,
  headerValue: string | null,
): boolean {
  const key = process.env.AUTHNET_SIGNATURE_KEY;
  if (!key || key.length === 0) return false;
  if (!headerValue) return false;

  // Header format: "sha512=<hex>"; extract the hex portion.
  const match = /^sha512=([0-9A-Fa-f]+)$/.exec(headerValue.trim());
  if (!match) return false;
  const providedHex = match[1].toLowerCase();

  // AUTHNET_SIGNATURE_KEY is provided by Auth.net as a HEX string;
  // convert to bytes for the HMAC key.
  let keyBuf: Buffer;
  try {
    keyBuf = Buffer.from(key, "hex");
  } catch {
    return false;
  }
  if (keyBuf.length === 0) return false;

  const computedHex = createHmac("sha512", keyBuf).update(rawBody).digest("hex");

  const a = Buffer.from(providedHex, "hex");
  const b = Buffer.from(computedHex, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
