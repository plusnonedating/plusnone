interface Props {
  venueName: string;
}

/**
 * LiveFeedPreview — phone-style mockup of the live who's-single feed.
 * Renders below the hero CTA on /business and /events. Shows three
 * sample profiles with icebreakers and a LIVE badge.
 *
 * Spec: section 5e of plus-none-brand-pass.md (revised lean rewrite).
 */
export function LiveFeedPreview({ venueName }: Props) {
  const profiles = [
    { name: "Sam, 28", icebreaker: "Ask me about my dog" },
    { name: "Jay, 31", icebreaker: "Ask me about Berlin" },
    { name: "Rae, 26", icebreaker: "Ask me about hot sauce" },
  ];
  return (
    <div className="w-[220px] rounded-t-[22px] border-[6px] border-b-0 border-stone-900 bg-white px-3.5 pb-3.5 pt-3 md:w-[260px]">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-serif text-sm font-medium text-stone-900 md:text-base">
          who&apos;s single here?
        </span>
        <span className="text-[9px] font-medium text-[#2647e8]">● LIVE</span>
      </div>
      <p className="mb-2 text-[9px] uppercase tracking-[0.1em] text-stone-600">
        {venueName}
      </p>
      <div className="divide-y divide-[#ede4d5]">
        {profiles.map((p) => (
          <div key={p.name} className="flex items-center gap-2 py-1.5">
            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-[#ede4d5]" />
            <div className="flex-1">
              <p className="text-[11px] font-medium text-stone-900">{p.name}</p>
              <p className="text-[9px] text-stone-600">{p.icebreaker}</p>
            </div>
            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#2647e8] text-[10px] text-white">
              ↗
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
