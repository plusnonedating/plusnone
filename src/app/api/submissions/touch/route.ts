import { NextResponse } from "next/server";
import { touchLastSeen } from "@/lib/submissions";
import { feedVenueBySlug } from "@/lib/venues";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * POST /api/submissions/touch
 * Body: { device_id: string, slug: string }
 *
 * Called from VenueShell on every mount of /[slug]. Updates the "Last Seen"
 * timestamp on Airtable records whose Device ID matches the caller AND whose
 * Venue matches the slug they're viewing. Powers the "active" indicator on
 * profile cards.
 *
 * Returns 200 with { updated: N } on success, including N=0 when the device
 * has no submission at this venue (which is the common case for visitors).
 * Failures (bad JSON, Airtable error, missing column) return { updated: 0 }
 * and never 5xx — the indicator is a nice-to-have, never a blocker.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as
      | { device_id?: unknown; slug?: unknown }
      | null;
    const deviceId =
      typeof body?.device_id === "string" ? body.device_id : "";
    const slug = typeof body?.slug === "string" ? body.slug : "";

    if (!deviceId || !slug) {
      return NextResponse.json({ updated: 0 });
    }

    const venue = feedVenueBySlug(slug);
    if (!venue) {
      return NextResponse.json({ updated: 0 });
    }

    const updated = await touchLastSeen(deviceId, venue.label);
    return NextResponse.json({ updated });
  } catch (error) {
    console.error("touch failed:", error);
    return NextResponse.json({ updated: 0 });
  }
}
