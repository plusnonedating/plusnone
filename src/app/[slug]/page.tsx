import { notFound } from "next/navigation";
import { fetchRecentSubmissions } from "@/lib/submissions";
import { feedVenueBySlug, FEED_VENUES } from "@/lib/venues";
import type { Submission } from "@/lib/types";
import VenueShell from "@/components/VenueShell";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return FEED_VENUES.map((v) => ({ slug: v.slug }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function VenuePage({ params }: PageProps) {
  const { slug } = await params;
  const venue = feedVenueBySlug(slug);
  if (!venue) notFound();

  let initialSubmissions: Submission[] = [];
  try {
    initialSubmissions = await fetchRecentSubmissions(venue.label);
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
  }

  return (
    <VenueShell venue={venue} initialSubmissions={initialSubmissions} />
  );
}
