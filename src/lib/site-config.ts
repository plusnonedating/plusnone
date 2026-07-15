/**
 * Sales tax collected on every checkout.
 *
 * Plus None LLC is registered in Maryland, so we collect MD's 6% sales
 * and use tax rate on all sales. We fold it into the subscription
 * amount (ARB has no separate tax field) and pass a tax line to
 * Auth.net for one-time transactions (so receipts show subtotal + tax
 * breakdown).
 *
 * If Kate ever changes state or moves to destination-based sourcing,
 * this constant is the one place to update.
 */
export const SALES_TAX_RATE = 0.06;
export const SALES_TAX_LABEL = "MD Sales Tax";

/**
 * Rounds a base amount to cents with tax applied. `applyTax(99)` →
 * 104.94. Uses cents rounding to avoid floating-point cruft in the
 * amount sent to Auth.net.
 */
export function applyTax(baseUsd: number): number {
  return Math.round(baseUsd * (1 + SALES_TAX_RATE) * 100) / 100;
}

/**
 * The tax-only portion for a base amount. `taxOn(99)` → 5.94.
 */
export function taxOn(baseUsd: number): number {
  return Math.round(baseUsd * SALES_TAX_RATE * 100) / 100;
}

/**
 * Does this address look like a Maryland one? We use destination-based
 * sourcing — MD sales tax only applies when the buyer's venue is in
 * Maryland. Anywhere else, no tax (we have no nexus in other states).
 *
 * Matches "MD" or "Maryland" as a whole word anywhere in the address
 * string. Doesn't try to disambiguate weird cases like "Maryland Ave,
 * DC" — real customer addresses almost always end in "…, STATE ZIP"
 * so the state token is unambiguous in practice. Case-insensitive.
 */
export function isMdAddress(address: string | null | undefined): boolean {
  if (!address) return false;
  return /\b(MD|Maryland)\b/i.test(address);
}

/**
 * Resolves the tax + total for a purchase given the destination
 * address. In-MD: 6% tax. Anywhere else: $0 tax.
 *
 * `taxUsd` is what shows on the receipt as the tax line; `totalUsd`
 * is what the card is actually charged.
 */
export function computeSalesTax(
  baseUsd: number,
  address: string | null | undefined,
): { taxUsd: number; totalUsd: number; taxable: boolean } {
  if (isMdAddress(address)) {
    return {
      taxable: true,
      taxUsd: taxOn(baseUsd),
      totalUsd: applyTax(baseUsd),
    };
  }
  return { taxable: false, taxUsd: 0, totalUsd: baseUsd };
}

/**
 * Global site configuration read from env vars. Server-side only.
 *
 * Each function reads its env var at call time (not module init) so
 * Kate can flip a value in the Vercel dashboard and the next request
 * picks it up after a redeploy. Vercel serverless functions get fresh
 * `process.env` on each cold start.
 */

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
