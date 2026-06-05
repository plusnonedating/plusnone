import { notFound } from "next/navigation";
import { fetchActivePartners } from "@/lib/partners";
import { fetchRecentSubmissions } from "@/lib/submissions";
import VenuePageClient from "./VenuePageClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Direct venue route — /cb, /msb, /csq, /sbw, /tsd, /fno, /sr.
 *
 * This route is the resurrected per-venue entry point that the
 * /scan consolidation (PR #36) replaced with 308 redirects. We're
 * bringing it back because:
 *   1. Founder QR codes can deep-link to a specific venue without
 *      requiring a geo prompt + /api/locate roundtrip.
 *   2. The blurred-view-until-submitted gate (already used by /scan
 *      for the matched venue) is enough privacy enforcement — anyone
 *      who navigates here without scanning the QR sees the blurred
 *      preview and the same "Add yourself" CTA. They can submit from
 *      anywhere; that's an acceptable trade-off for the founder
 *      direct-link UX.
 *
 * Routing notes:
 *   - Specific static routes (/business, /events, /founding-partner,
 *     /scan, /ig, /partner-terms, /privacy-policy, /preview) win over
 *     this dynamic [slug] in Next.js's matching order, so they're
 *     not at risk of being captured.
 *   - Unknown slugs (e.g. /xyz, /typos) call notFound() → 404.
 *
 * Caching:
 *   - fetchActivePartners is unstable_cache 60s — venue lookup is
 *     near-instant after the first hit.
 *   - fetchRecentSubmissions is unstable_cache 30s — initial feed
 *     hydrates server-side, client takes over via polling.
 *
 * Geo check: intentionally skipped. The user clicked a slug-specific
 * URL; treating them as "at the venue" is more useful than gating on
 * geo permission and confusing the QR-scan flow.
 */
export default async function VenuePage({ params }: PageProps) {
  const { slug } = await params;

  const venues = await fetchActivePartners();
  const venue = venues.find((v) => v.slug === slug);
  if (!venue) {
    notFound();
  }

  const initialSubmissions = await fetchRecentSubmissions(venue.label);

  return (
    <VenuePageClient
      venue={{
        slug: venue.slug,
        name: venue.name,
        label: venue.label,
        wordpressVenueParam: venue.wordpressVenueParam,
      }}
      initialSubmissions={initialSubmissions}
    />
  );
}
