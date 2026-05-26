import { NextResponse } from "next/server";
import { fetchRecentSubmissions } from "@/lib/submissions";
import { feedVenueBySlug } from "@/lib/venues";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 });
  }
  const venue = feedVenueBySlug(slug);
  if (!venue) {
    return NextResponse.json({ error: "unknown venue" }, { status: 404 });
  }
  try {
    const submissions = await fetchRecentSubmissions(venue.label);
    return NextResponse.json({ submissions });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json({ submissions: [] });
  }
}
