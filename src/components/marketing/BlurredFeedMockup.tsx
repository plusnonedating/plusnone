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
    <div className="w-[240px] overflow-hidden rounded-t-[22px] border-[6px] border-b-0 border-stone-900 bg-white md:w-[300px]">
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

      {/* Count headline — display serif, mirrors `${count} people are here.`
          Two-line layout so the number breathes at every scale (works
          for 27 and 1,234 alike). Comma-formatted via toLocaleString. */}
      <p className="px-2 text-center font-display text-[22px] leading-[0.95] tracking-[0.01em] text-ink md:text-[28px]">
        {count.toLocaleString("en-US")} people
        <br />
        are here.
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

      {/* Grid of 4 blurred square profile cards — visually conveys "this
          is a real feed of people you can browse." Squares (not 9:16
          portraits) so we can fit 2x2 inside the phone frame at
          readable size. Slight opacity stagger gives depth without
          looking like loading skeletons. */}
      <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
        {[0.9, 0.8, 0.75, 0.65].map((opacity, i) => (
          <div
            key={i}
            aria-hidden
            className="aspect-square w-full rounded-lg bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 blur-sm"
            style={{ opacity }}
          />
        ))}
      </div>
    </div>
  );
}
