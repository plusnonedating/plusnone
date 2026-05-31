interface Props {
  venueName: string;
  /** Headline count, e.g. 27 → "27 people are here." */
  count: number;
}

/**
 * BlurredFeedMockup — phone-style mockup of the locked /scan view used
 * on the /business and /events sales pages.
 *
 * Drop-in replacement for LiveFeedPreview: same phone-frame dimensions
 * (240/300px) so the existing hero grid layout doesn't shift. Content
 * mirrors the real BlurredFeedView a visitor sees on /scan before they
 * submit — count headline + venue + CTA + blurred placeholder bars.
 *
 * The count is a marketing prop (hardcoded 27 on the sales pages) — it
 * has nothing to do with the live Airtable submission count. The whole
 * point is to show prospective business/event customers the kind of
 * social-proof number that the live system surfaces to their patrons.
 */
export function BlurredFeedMockup({ venueName, count }: Props) {
  return (
    <div className="w-[240px] rounded-t-[22px] border-[6px] border-b-0 border-stone-900 bg-[#f4ede4] px-3.5 pb-3.5 pt-4 md:w-[300px]">
      {/* Big count headline — the social-proof beat. */}
      <p className="text-center font-display text-[34px] leading-[0.95] tracking-[0.01em] text-stone-900 md:text-[42px]">
        {count} people
        <br />
        are here.
      </p>
      <p className="mt-2.5 text-center text-[8px] uppercase tracking-[0.08em] text-stone-600 md:text-[9px]">
        {venueName}
      </p>

      {/* CTA — mirrors the real cobalt button on /scan. */}
      <div className="mt-3.5 flex justify-center">
        <span className="block w-full text-center rounded-full bg-[#2647e8] px-3 py-2 font-display text-[11px] uppercase tracking-[0.05em] text-white md:py-2.5 md:text-[12px]">
          Add yourself to see them
        </span>
      </div>

      {/* Blurred placeholder bars — pure visual stand-ins suggesting
          "more profiles below the fold." Kept as short horizontal bars
          rather than 9:16 portrait cards so the mockup stays compact
          inside the phone-frame width on desktop. */}
      <div className="mt-3 space-y-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            aria-hidden
            className="w-full h-10 rounded-md bg-gradient-to-br from-stone-300 via-stone-200 to-stone-300 blur-sm md:h-12"
            style={{ opacity: 0.75 - i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
