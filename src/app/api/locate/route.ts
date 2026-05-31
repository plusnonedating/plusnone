import { NextResponse } from "next/server";
import { fetchActivePartners, type PartnerVenue } from "@/lib/partners";
import { findNearestInList } from "@/lib/geo";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Response shape — keeping it narrow so the /scan client only needs to
 * read the bits it actually renders. If no venue matched (visitor is
 * outside every geofence, or Airtable failed), `slug` is null and the
 * client should `router.push('/ig')`.
 */
interface LocateResponse {
  slug: string | null;
  venue?: {
    slug: string;
    name: string;
    label: string;
    wordpressVenueParam: string;
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

/**
 * POST /api/locate — body: { lat: number, lng: number }
 *
 * Returns the active Partner venue whose geofence covers the visitor.
 * Returns `{ slug: null }` if no venue matches OR if Airtable fails —
 * /scan treats both the same way (redirect to /ig). The graceful
 * fallback is intentional: a flaky Airtable call shouldn't break the
 * page, and visitors with bad location should fall through to IG anyway.
 */
export async function POST(request: Request) {
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
    console.error("[/api/locate] Airtable Partners fetch failed:", error);
    return NextResponse.json<LocateResponse>(
      { slug: null },
      { status: 200 },
    );
  }

  const match = findNearestInList(lat, lng, partners);
  if (!match) {
    return NextResponse.json<LocateResponse>({ slug: null }, { status: 200 });
  }

  return NextResponse.json<LocateResponse>(
    {
      slug: match.slug,
      venue: {
        slug: match.slug,
        name: match.name,
        label: match.label,
        wordpressVenueParam: match.wordpressVenueParam,
      },
    },
    { status: 200 },
  );
}
