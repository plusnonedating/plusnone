import BlurredFeedView from "@/components/BlurredFeedView";

/**
 * Dev-only mockup of the /scan blurred-feed gate at count > 0.
 *
 * The real /scan flow only renders this view if the visitor is at a
 * matched venue AND hasn't submitted yet AND the venue has at least
 * one submission. Until Citizens Ballroom has submissions in the wild,
 * this route is the easiest way to see the multi-card state for QA /
 * client review without seeding test data into Airtable.
 *
 * Accepts ?count=N to dial the count (defaults to 5).
 *
 * Not linked from anywhere — discoverable only via direct URL.
 */
interface PageProps {
  searchParams: Promise<{ count?: string }>;
}

export default async function BlurPreviewPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const parsed = Number(params.count);
  const count = Number.isFinite(parsed) && parsed >= 0 ? parsed : 5;

  return (
    <BlurredFeedView
      venue={{
        slug: "cb",
        name: "Citizens Ballroom",
        label: "Citizens Ballroom (Frederick, MD)",
        wordpressVenueParam: "Citizens%20Ballroom%20(Frederick%2C%20MD)",
      }}
      overrideCount={count}
    />
  );
}
