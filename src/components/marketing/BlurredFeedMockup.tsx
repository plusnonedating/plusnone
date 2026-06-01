import Image from "next/image";

interface Props {
  venueName: string;
  /** Headline count, e.g. 27 → "27 people are here." */
  count: number;
}

/**
 * BlurredFeedMockup — phone-style mockup of the locked /scan view used
 * on the /business and /events sales pages.
 *
 * Drop-in replacement for LiveFeedPreview at the same 240/300px phone
 * frame width. Faithfully mirrors the real `BlurredFeedView` a visitor
 * sees on /scan: Plus None logo, "N people are here." headline, venue
 * subtitle, cobalt "Add yourself to see them" CTA, and a 2x2 grid of
 * blurred profile squares.
 *
 * White phone background so the silhouette pops against the cream page.
 * Typography intentionally compact + helper text dropped so the
 * overall phone height roughly matches the "How it works" Statement
 * list it sits beside in the hero grid.
 *
 * The count is a marketing prop (hardcoded on the sales pages) — it
 * has nothing to do with the live Airtable submission count. The whole
 * point is to show prospective business/event customers the kind of
 * social-proof number that the live system surfaces to their patrons.
 */
export function BlurredFeedMockup({ venueName, count }: Props) {
  return (
    <div className="w-[240px] overflow-hidden rounded-t-[22px] border-[6px] border-b-0 border-stone-900 bg-white md:w-[300px]">
      {/* Logo — compact wordmark, scaled smaller than the real /scan
          page so the whole mockup stays in the 'phone hero' height
          ballpark. */}
      <div className="flex justify-center pt-2 pb-0.5">
        <Image
          src="/plus-none-logo.png"
          alt="Plus None"
          width={660}
          height={660}
          className="h-auto w-[80px] md:w-[100px]"
        />
      </div>

      {/* Count headline — two-line layout so 27 and 1,234 both look
          balanced. Comma-formatted via toLocaleString. */}
      <p className="px-2 text-center font-display text-[19px] leading-[0.95] tracking-[0.01em] text-ink md:text-[24px]">
        {count.toLocaleString("en-US")} people
        <br />
        are here.
      </p>

      {/* Venue subtitle — uppercase, muted. */}
      <p className="mt-1 px-2 text-center text-[6.5px] uppercase tracking-[0.08em] text-muted md:text-[7.5px]">
        {venueName}
      </p>

      {/* CTA — full-width cobalt pill, compact. */}
      <div className="px-2.5 pt-2">
        <div className="w-full rounded-full bg-cobalt px-2 py-1.5 text-center font-display text-[9px] uppercase tracking-[0.06em] text-white md:py-2 md:text-[11px]">
          Add yourself to see them
        </div>
      </div>

      {/* 2x2 grid of blurred profile squares — saturated muted colors
          (stone, amber, rose, sky in the 400-600 range) so they
          obviously read as 4 blurred profile photos rather than empty
          loading cards. Gap-2.5 keeps blur halos from bleeding into
          each other. Short fixed height so the whole phone matches
          the how-it-works list to its left. */}
      <div className="grid grid-cols-2 gap-2.5 px-2.5 pb-2.5 pt-2">
        <div
          aria-hidden
          className="h-10 w-full rounded-md bg-gradient-to-br from-stone-500 via-stone-400 to-stone-600 blur-[3px] md:h-14"
        />
        <div
          aria-hidden
          className="h-10 w-full rounded-md bg-gradient-to-br from-amber-400 via-amber-300 to-amber-500 blur-[3px] md:h-14"
        />
        <div
          aria-hidden
          className="h-10 w-full rounded-md bg-gradient-to-br from-rose-400 via-rose-300 to-rose-500 blur-[3px] md:h-14"
        />
        <div
          aria-hidden
          className="h-10 w-full rounded-md bg-gradient-to-br from-sky-500 via-sky-400 to-sky-600 blur-[3px] md:h-14"
        />
      </div>
    </div>
  );
}
