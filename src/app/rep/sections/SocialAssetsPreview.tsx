import Link from "next/link";

/**
 * Dashboard entry point for the /rep/social-assets tab. Kept as a
 * link card (not an inline gallery) so the main dashboard's load
 * time doesn't have to wait on a Content-base Airtable read.
 */
export default function SocialAssetsPreview() {
  return (
    <section className="mb-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Content
      </p>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        Dater photos, cleared to post.
      </h2>
      <Link
        href="/rep/social-assets"
        className="block rounded-lg border border-stone-300 bg-white p-5 transition-colors hover:border-stone-500"
      >
        <div className="font-medium text-stone-900">Open social assets →</div>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-stone-600">
          Everyone who checked <em>OK to Post</em> on their submission
          — their photo, ice breaker, and posted-yet status. Cleared
          for @plusnonedating and @TheVenueCEO only.
        </p>
      </Link>
    </section>
  );
}
