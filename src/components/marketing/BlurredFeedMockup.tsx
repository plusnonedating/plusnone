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
 * frame dimensions. Faithfully mirrors the real `BlurredFeedView` a
 * visitor sees on /scan: Plus None logo, big "N people are here."
 * headline, venue subtitle, cobalt "Add yourself to see them" CTA,
 * helper text, and a 9:16 portrait blurred card peeking up from the
 * bottom of the phone frame — same as the top of the real page on a
 * phone viewport (the rest scrolls).
 *
 * The count is a marketing prop (hardcoded 27 on the sales pages) — it
 * has nothing to do with the live Airtable submission count. The whole
 * point is to show prospective business/event customers the kind of
 * social-proof number that the live system surfaces to their patrons.
 */
export function BlurredFeedMockup({ venueName, count }: Props) {
  return (
    <div className="w-[240px] overflow-hidden rounded-t-[22px] border-[6px] border-b-0 border-stone-900 bg-[#f4ede4] md:w-[300px]">
      {/* Logo — matches the 330px logo on real /scan, scaled to phone width. */}
      <div className="flex justify-center pt-3 pb-1">
        <Image
          src="/plus-none-logo.png"
          alt="Plus None"
          width={660}
          height={660}
          className="h-auto w-[140px] md:w-[180px]"
        />
      </div>

      {/* Count headline — display serif, mirrors `${count} people are here.` */}
      <p className="px-2 text-center font-display text-[22px] leading-[1] tracking-[0.01em] text-ink md:text-[28px]">
        {count} people are here.
      </p>

      {/* Venue subtitle — uppercase, muted. */}
      <p className="mt-1.5 px-2 text-center text-[7px] uppercase tracking-[0.08em] text-muted md:text-[8px]">
        {venueName}
      </p>

      {/* CTA — full-width cobalt pill, matches real /scan button shape. */}
      <div className="px-3 pt-3">
        <div className="w-full rounded-full bg-cobalt px-3 py-2 text-center font-display text-[11px] uppercase tracking-[0.06em] text-white md:py-2.5 md:text-[13px]">
          Add yourself to see them
        </div>
      </div>

      {/* Helper text under CTA — same copy as the real page, scaled. */}
      <p className="px-3 pt-2 pb-3 text-center text-[8px] leading-[1.4] text-muted md:text-[9px]">
        Plus None&apos;s private. Drop a quick selfie video to see
        everyone&nbsp;here.
      </p>

      {/* Peek of a 9:16 blurred portrait card — visually clipped by the
          phone frame's overflow-hidden + border-b-0, suggesting "more
          profiles scroll below." Matches the cards on the real
          BlurredFeedView (same gradient + blur recipe). */}
      <div className="px-3">
        <div
          aria-hidden
          className="h-[150px] w-full rounded-t-2xl bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 blur-sm md:h-[190px]"
          style={{ opacity: 0.85 }}
        />
      </div>
    </div>
  );
}
