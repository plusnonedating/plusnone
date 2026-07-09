import Airtable, { type Base } from "airtable";

/**
 * Shared helper for constructing the Airtable "Plus None Sales" base.
 *
 * Previously each API route (waitlist, founding-partner-agreement,
 * business signup, events booking) duplicated the env-var fallback
 * chain and `new Airtable({apiKey}).base(baseId)` construction. This
 * module centralizes that so a rotation of the token or base ID only
 * needs one update.
 *
 * Env vars (same as before):
 *   AIRTABLE_BUSINESS_API_KEY  — preferred PAT scoped to Sales base
 *   AIRTABLE_API_KEY           — fallback (only works if the token is
 *                                scoped broadly enough)
 *   AIRTABLE_BUSINESS_BASE_ID  — override
 *   Hardcoded fallback         — DEFAULT_SALES_BASE_ID
 */

export const DEFAULT_SALES_BASE_ID = "appNewsi5A4VKSs4g";

let cachedBase: Base | null = null;
let cachedFor: { apiKey: string; baseId: string } | null = null;

/**
 * Returns the Airtable Sales base. Caches the constructed Base object
 * across requests within a Vercel function instance for the lifetime of
 * that instance, keyed by (apiKey, baseId) so a mid-flight env-var
 * change (e.g. deploy while requests are in flight) rebuilds the Base
 * rather than reusing a stale one.
 *
 * Throws if `AIRTABLE_BUSINESS_API_KEY` and `AIRTABLE_API_KEY` are both
 * unset — every caller needs a working base to do anything useful, so
 * fail loud rather than return a broken object.
 */
export function getSalesBase(): Base {
  const apiKey =
    process.env.AIRTABLE_BUSINESS_API_KEY ?? process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Neither AIRTABLE_BUSINESS_API_KEY nor AIRTABLE_API_KEY is set — cannot construct Sales base.",
    );
  }
  const baseId =
    process.env.AIRTABLE_BUSINESS_BASE_ID ?? DEFAULT_SALES_BASE_ID;

  if (cachedBase && cachedFor?.apiKey === apiKey && cachedFor?.baseId === baseId) {
    return cachedBase;
  }
  cachedBase = new Airtable({ apiKey }).base(baseId);
  cachedFor = { apiKey, baseId };
  return cachedBase;
}
