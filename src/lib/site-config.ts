/**
 * Global site configuration read from env vars. Server-side only.
 *
 * Each function reads its env var at call time (not module init) so
 * Kate can flip a value in the Vercel dashboard and the next request
 * picks it up after a redeploy. Vercel serverless functions get fresh
 * `process.env` on each cold start.
 */

/**
 * Feature flag: when `true`, the `/business` + `/events` CTAs route to
 * the paid signup flows (Authorize.net). When `false` (default), they
 * route to the existing `/business/waitlist` + `/events/waitlist`
 * forms and no payment code runs.
 *
 * Kate flips `LIVE_CHECKOUT=true` in the Vercel env var UI once she's
 * verified everything in sandbox. The waitlist forms + Web Waitlist
 * Airtable table remain intact as a fallback — if we ever need to
 * turn checkout off (Auth.net outage, PCI incident, etc.) she flips
 * the var back to `false` and CTAs revert to the waitlist immediately
 * on the next request.
 */
export function isLiveCheckout(): boolean {
  return process.env.LIVE_CHECKOUT === "true";
}

/**
 * Which Authorize.net environment to target.
 *
 * - "sandbox" (default) → apitest.authorize.net + test.authorize.net
 *   hosted pages. Uses test merchant credentials; no real money moves.
 * - "production" → api.authorize.net + accept.authorize.net. Real
 *   money, real cards.
 *
 * Anything other than the exact string "production" is treated as
 * sandbox so a mis-typed env var errs on the safe side (no charges).
 */
export type AuthnetEnv = "sandbox" | "production";

export function authnetEnv(): AuthnetEnv {
  return process.env.AUTHNET_ENV === "production" ? "production" : "sandbox";
}

/**
 * Base URLs for the two environments. Auth.net's JSON API endpoint is
 * confusingly named `/xml/v1/request.api` — the URL predates their JSON
 * support but the endpoint accepts either format based on Content-Type.
 */
export function authnetApiUrl(): string {
  return authnetEnv() === "production"
    ? "https://api.authorize.net/xml/v1/request.api"
    : "https://apitest.authorize.net/xml/v1/request.api";
}

/**
 * Base URL for Auth.net's hosted payment/customer pages. The full URL
 * for a hosted CIM form is `${hostedBase()}/customer/manage` with the
 * one-time token appended via the `token` form parameter. For the
 * one-time payment page it's `${hostedBase()}/payment/payment`.
 */
export function authnetHostedBase(): string {
  return authnetEnv() === "production"
    ? "https://accept.authorize.net"
    : "https://test.authorize.net";
}

/**
 * Public origin of this app, used to build return/callback URLs for
 * hosted pages so Auth.net knows where to redirect after card entry.
 *
 * Vercel populates `VERCEL_URL` in production automatically; in local
 * dev we fall back to the standard localhost port.
 */
export function siteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_ORIGIN;
  if (explicit && explicit.length > 0) return explicit;
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.length > 0) return `https://${vercelUrl}`;
  return "http://localhost:3000";
}
