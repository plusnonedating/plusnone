import { NextResponse } from "next/server";
import { fetchRecentSubmissions } from "@/lib/submissions";
import { feedVenueBySlug } from "@/lib/venues";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/submissions
 *
 * Returns recent submissions for a single venue. Accepts either of:
 *   - `?label=Citizens%20Ballroom%20(Frederick%2C%20MD)` — preferred,
 *     used by the new /scan flow (any active Partner venue from Airtable).
 *   - `?slug=cb` — legacy, kept working for hardcoded venues so any
 *     bookmarked URLs / external callers continue to function during the
 *     transition. New code should pass `label`.
 *
 * Empty array (rather than an error) on Airtable failure — the client
 * polls every 30s, so we'd rather degrade gracefully than show an
 * error UI.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const labelParam = url.searchParams.get("label");
  const slug = url.searchParams.get("slug");

  let venueLabel: string | null = null;

  if (labelParam) {
    venueLabel = labelParam;
  } else if (slug) {
    const venue = feedVenueBySlug(slug);
    if (!venue) {
      return NextResponse.json({ error: "unknown venue" }, { status: 404 });
    }
    venueLabel = venue.label;
  }

  if (!venueLabel) {
    return NextResponse.json(
      { error: "label or slug required" },
      { status: 400 },
    );
  }

  try {
    const submissions = await fetchRecentSubmissions(venueLabel);
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json({ submissions: [] });
  }
}
