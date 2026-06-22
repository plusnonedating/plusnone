import Airtable, { type Base } from "airtable";
import { unstable_cache } from "next/cache";

/**
 * Plus None Partners base — the Airtable base that holds the "Business"
 * table /api/locate reads from.
 *
 * Kate's setup keeps the Partners data in its own base, separate from the
 * Submissions/Podcast base used by lib/airtable.ts. Airtable Personal
 * Access Tokens are scoped per-base, so the PAT used by /api/submissions
 * almost certainly does NOT have read access here.
 *
 * Required Vercel env vars for /api/locate to work:
 *
 *   AIRTABLE_BUSINESS_API_KEY  — PAT with `data.records:read` scope on
 *                                base appNewsi5A4VKSs4g. If unset, falls
 *                                back to AIRTABLE_API_KEY (which works
 *                                only if that PAT covers BOTH bases).
 *
 *   AIRTABLE_BUSINESS_BASE_ID  — Optional. Defaults to "appNewsi5A4VKSs4g".
 *                                Override only if the base ID changes.
 */
export const DEFAULT_BUSINESS_BASE_ID = "appNewsi5A4VKSs4g";

// Identified by ID rather than display name — Airtable JS sometimes
// fails silently on name lookups when the table is renamed or cased
// differently than the code expects.
export const BUSINESS_TABLE_ID = "tblCjS56kFGGr1XYo";

export interface PartnerVenue {
  /** Short internal identifier — e.g., "cb", "msb". Used as the slug
   * in the existing /api/submissions endpoint and venue analytics. */
  slug: string;
  /** Full venue label exactly as stored on Submissions rows — used as the
   * filter key when querying recent submissions for the feed. */
  label: string;
  /** Display name. */
  name: string;
  /** Geofence center latitude. */
  lat: number;
  /** Geofence center longitude. */
  lng: number;
  /** Geofence radius in meters. Visitor must be within this distance of
   * (lat, lng) to be matched to this venue. */
  radiusMeters: number;
  /** Pre-encoded value to drop straight into the WordPress form URL's
   * `?venue=…` query param. */
  wordpressVenueParam: string;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asTrimmed(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

let cachedBase: Base | null = null;

/**
 * Returns the Plus None Partners base, lazily constructed.
 *
 * Resolves credentials from (in order):
 *   1. AIRTABLE_BUSINESS_API_KEY  (preferred — scoped per-base)
 *   2. AIRTABLE_API_KEY            (fallback — only works if it has
 *                                   access to BOTH the Podcast base AND
 *                                   the Partners base)
 *
 * Resolves base ID from:
 *   1. AIRTABLE_BUSINESS_BASE_ID  (override)
 *   2. DEFAULT_BUSINESS_BASE_ID    (hardcoded "appNewsi5A4VKSs4g")
 */
function getBusinessBase(): Base {
  if (cachedBase) return cachedBase;

  const apiKey =
    process.env.AIRTABLE_BUSINESS_API_KEY ?? process.env.AIRTABLE_API_KEY;
  if (!apiKey) {
    throw new Error(
      "Neither AIRTABLE_BUSINESS_API_KEY nor AIRTABLE_API_KEY is set",
    );
  }

  const baseId =
    process.env.AIRTABLE_BUSINESS_BASE_ID ?? DEFAULT_BUSINESS_BASE_ID;

  cachedBase = new Airtable({ apiKey }).base(baseId);
  return cachedBase;
}

/**
 * Returns the actual base ID being used — exposed so the /api/locate
 * debug response can surface it. Pure helper, doesn't touch the cache.
 */
export function currentBusinessBaseId(): string {
  return process.env.AIRTABLE_BUSINESS_BASE_ID ?? DEFAULT_BUSINESS_BASE_ID;
}

async function fetchActivePartnersImpl(): Promise<PartnerVenue[]> {
  const base = getBusinessBase();
  // Two statuses count as "scannable":
  //   - Geo-Tag Configured: geo coords are set; venue is in the network
  //     but physical signage hasn't shipped yet. Still scannable so
  //     founders can demo + soft-launch.
  //   - Active: signage delivered + placed, fully launched.
  // Anything else (New Signup, Signage Ordered/Shipped, Payment
  // Failed, Cancelled, Live) is excluded.
  const records = await base(BUSINESS_TABLE_ID)
    .select({
      filterByFormula: `OR({Status} = 'Active', {Status} = 'Geo-Tag Configured')`,
      pageSize: 100,
    })
    .all();

  const partners: PartnerVenue[] = [];
  for (const r of records) {
    const slug = asTrimmed(r.get("Slug"));
    const label = asTrimmed(r.get("Venue Label")) ?? asTrimmed(r.get("Name"));
    const name = asTrimmed(r.get("Name")) ?? label;
    const lat = asNumber(r.get("Geofence Lat"));
    const lng = asNumber(r.get("Geofence Lng"));
    const radius = asNumber(r.get("Geofence Radius (meters)")) ?? 50;
    const wpParam = asTrimmed(r.get("WordPress Venue Param"));

    // Skip rows missing required geofence/identity data — they can't be
    // matched and would silently break /scan.
    if (!slug || !label || !name || lat === null || lng === null) continue;

    partners.push({
      slug,
      label,
      name,
      lat,
      lng,
      radiusMeters: radius,
      wordpressVenueParam: wpParam ?? encodeURIComponent(label),
    });
  }
  return partners;
}

/**
 * Cached fetch of all active partner venues. Cached for 60s with the
 * "partners" tag so manual revalidation is possible if you push a hot
 * Airtable change.
 */
// 24 hours. Venues are added / edited maybe once a week in practice,
// and the Airtable read for the Business table is what dominates our
// monthly API call budget (~980/mo on the free 1k limit at 60s TTL).
// If you need an immediate refresh after editing a venue in Airtable,
// hit POST /api/admin/revalidate with the admin token — that
// calls revalidateTag("partners") and the next /api/locate or
// /[slug] render pulls fresh data.
export const fetchActivePartners = unstable_cache(
  fetchActivePartnersImpl,
  ["active-partners-v2"],
  { revalidate: 60 * 60 * 24, tags: ["partners"] },
);
