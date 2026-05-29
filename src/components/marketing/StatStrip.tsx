interface StatStripItem {
  value: string;
  label: string;
}

interface Props {
  items: StatStripItem[];
}

/**
 * StatStrip — 3-up grid of headline stats. Sits flush under the hero on
 * /business and /events. Hairline dividers between cells achieved with
 * `gap-px` over a stone-400 background; cell bg fills the rest with
 * brand cream.
 *
 * Spec: section 5e of plus-none-brand-pass.md (revised lean rewrite).
 */
export function StatStrip({ items }: Props) {
  return (
    <div className="grid grid-cols-3 gap-px bg-stone-400 px-0">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-[#f4ede4] px-3 py-4 text-center md:py-6"
        >
          <p className="font-serif text-xl font-medium leading-none text-[#2647e8] md:text-2xl">
            {item.value}
          </p>
          <p className="mt-1.5 text-[10px] uppercase tracking-[0.08em] text-stone-600 md:text-xs">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}
