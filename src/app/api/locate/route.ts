import { NextResponse } from "next/server";
import { fetchActivePartners, type PartnerVenue } from "@/lib/partners";
import { findNearestInList, haversineMeters } from "@/lib/geo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Response shape — keeping it narrow so the /scan client only needs to
 * read the bits it actually renders. If no venue matched (visitor is
 * outside every geofence, or Airtable failed), `slug` is null and the
 * client should `router.push('/ig')`.
 *
 * When the request is made with `?debug=1`, the response also includes
 * a `_debug` object with the received coords and a per-venue distance
 * breakdown — used by `/scan?debug=1` to render an on-screen panel for
 * field-testing whether a geofence is the issue or GPS is the issue.
 */
interface LocateResponse {
  slug: string | null;
  venue?: {
    slug: string;
    name: string;
    label: string;
    wordpressVenueParam: string;
  };
  _debug?: {
    received: { lat: number; lng: number };
    activeVenueCount: number;
    error?: "airtable-fetch-failed";
    venues: Array<{
      slug: string;
      label: string;
      lat: number;
      lng: number;
      radiusMeters: number;
      distanceMeters: number;
      withinRadius: boolean;
    }>;
  };
}

interface LocateRequestBody {
  lat?: unknown;
  lng?: unknown;
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  return null;
}

function buildDistanceRows(
  lat: number,
  lng: number,
  partners: PartnerVenue[],
): NonNullable<LocateResponse["_debug"]>["venues"] {
  return partners
    .map((v) => {
      const d = haversineMeters(lat, lng, v.lat, v.lng);
      return {
        slug: v.slug,
        label: v.label,
        lat: v.lat,
        lng: v.lng,
        radiusMeters: v.radiusMeters,
        distanceMeters: Math.round(d),
        withinRadius: d <= v.radiusMeters,
      };
    })
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}

/**
 * POST /api/locate — body: { lat: number, lng: number }
 *
 * Returns the active Business venue whose geofence covers the visitor.
 * Returns `{ slug: null }` if no venue matches OR if Airtable fails —
 * /scan treats both the same way (redirect to /ig). The graceful
 * fallback is intentional: a flaky Airtable call shouldn't break the
 * page, and visitors with bad location should fall through to IG anyway.
 *
 * Always logs a structured diagnostic line to the server console so
 * issues can be triaged from Vercel logs without needing the URL trick.
 * Append `?debug=1` to also receive the diagnostic in the response (for
 * the `/scan?debug=1` on-screen panel).
 */
export async function POST(request: Request) {
  const url = new URL(request.url);
  const debug = url.searchParams.get("debug") === "1";

  let body: LocateRequestBody;
  try {
    body = (await request.json()) as LocateRequestBody;
  } catch {
    return NextResponse.json(
      { error: "invalid json body" },
      { status: 400 },
    );
  }

  const lat = asNumber(body.lat);
  const lng = asNumber(body.lng);
  if (lat === null || lng === null) {
    return NextResponse.json(
      { error: "lat and lng are required numbers" },
      { status: 400 },
    );
  }

  let partners: PartnerVenue[];
  try {
    partners = await fetchActivePartners();
  } catch (error) {
    console.error("[/api/locate] Airtable Business fetch failed:", error);
    console.log(
      JSON.stringify({
        at: "api/locate",
        received: { lat, lng },
        error: "airtable-fetch-failed",
      }),
    );
    const fallback: LocateResponse = { slug: null };
    if (debug) {
      fallback._debug = {
        received: { lat, lng },
        activeVenueCount: 0,
        error: "airtable-fetch-failed",
        venues: [],
      };
    }
    return NextResponse.json(fallback, { status: 200 });
  }

  const distanceRows = buildDistanceRows(lat, lng, partners);
  const match = findNearestInList(lat, lng, partners);

  // Always log a structured line so the diagnostic is visible in
  // Vercel runtime logs even if the client didn't request debug mode.
  console.log(
    JSON.stringify({
      at: "api/locate",
      received: { lat, lng },
      activeVenueCount: partners.length,
      nearest: distanceRows[0]
        ? {
            slug: distanceRows[0].slug,
            distanceMeters: distanceRows[0].distanceMeters,
            radiusMeters: distanceRows[0].radiusMeters,
          }
        : null,
      matched: match?.slug ?? null,
    }),
  );

  const responseBody: LocateResponse = match
    ? {
        slug: match.slug,
        venue: {
          slug: match.slug,
          name: match.name,
          label: match.label,
          wordpressVenueParam: match.wordpressVenueParam,
        },
      }
    : { slug: null };

  if (debug) {
    responseBody._debug = {
      received: { lat, lng },
      activeVenueCount: partners.length,
      venues: distanceRows,
    };
  }

  return NextResponse.json(responseBody, { status: 200 });
}
