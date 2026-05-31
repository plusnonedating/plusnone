import { unstable_cache } from "next/cache";
import { getBase } from "./airtable";

// The "Business" table in Airtable holds the partner-venue rows that
// /api/locate matches visitors against. We pass the table ID rather
// than the display name — IDs survive renames and are case-stable,
// where display-name lookups can fail silently if the table is
// renamed or cased differently than the code expects.
//
// Table ID supplied by Kate; display name is "Business".
export const BUSINESS_TABLE = "tblCjS56kFGGr1XYo";

/**
 * Active partner venue with everything /api/locate needs to match a
 * visitor to a venue and render the feed.
 */
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

async function fetchActivePartnersImpl(): Promise<PartnerVenue[]> {
  const base = getBase();
  const records = await base(BUSINESS_TABLE)
    .select({
      filterByFormula: `{Status} = 'Active'`,
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
export const fetchActivePartners = unstable_cache(
  fetchActivePartnersImpl,
  ["active-partners-v1"],
  { revalidate: 60, tags: ["partners"] },
);
