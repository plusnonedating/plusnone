import {
  BarChart3,
  Clock,
  Heart,
  Repeat,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * "The data" section on the partner signup pages. Replaces the previous
 * two-column bullet wall with:
 *
 *   1. A sample monthly report card (dark surface, headline metrics + a
 *      tiny "scans by night" bar chart)
 *   2. A 2-column icon tile grid for "Every month you get"
 *   3. Pull-quote outcomes with a cobalt left-border for "So you can"
 *
 * Uses Tailwind utilities + lucide-react icons. Brand cobalt is sourced
 * from the existing @theme token (`text-cobalt`, `bg-cobalt`), brand
 * cream from `bg-cream`. The tile background (#ede4d5) is one shade
 * deeper than cream to give the tiles a soft surface against the cream
 * page background.
 */
export default function DataSection() {
  return (
    <section className="bg-cream px-5 py-12 md:px-8 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
          The data
        </p>
        <h2 className="font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
          Real intelligence on who walks through your door.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-stone-700 md:text-lg">
          No bar has visibility into who its single patrons are, how often
          they come back, or what nights actually drive new traffic. Plus None
          gives you that.
        </p>

        {/* Founding-partner callout — bar owner rejected an enterprise data
            pitch, chose Plus None instead. High-contrast cobalt block so it
            catches the eye before the sample report. */}
        <figure className="mt-8 rounded-xl bg-cobalt p-6 md:mt-10 md:p-8">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-cream/70">
            From a founding partner
          </p>
          <blockquote className="font-serif text-2xl leading-[1.15] text-cream md:text-3xl">
            &ldquo;They tried to sell me a data service for thousands a
            month. I passed. Plus None gives me the numbers that actually
            matter&mdash;who&rsquo;s single, who&rsquo;s coming
            back&mdash;for $99.&rdquo;
          </blockquote>
        </figure>

        {/* Sample monthly report */}
        <div className="mt-8 rounded-xl bg-stone-900 p-5 md:mt-10 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.14em] text-stone-400">
              Your venue · Apr 2026
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-emerald-400"
              />
              Sample report
            </span>
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2.5">
            <div className="rounded-md bg-stone-800 px-3 py-2.5">
              <div className="mb-1 text-[11px] uppercase tracking-wider text-stone-500">
                Scans
              </div>
              <div className="font-serif text-3xl leading-none text-cream">
                847
              </div>
            </div>
            <div className="rounded-md bg-stone-800 px-3 py-2.5">
              <div className="mb-1 text-[11px] uppercase tracking-wider text-stone-500">
                Return 30d
              </div>
              <div className="font-serif text-3xl leading-none text-cream">
                31%
              </div>
            </div>
          </div>

          <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-stone-500">
            Scans by night
          </div>
          <div className="mb-2 flex h-14 items-end gap-1.5">
            {[30, 45, 25, 60, 42, 85, 95].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-cobalt"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-stone-500">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>

        {/* Tile grid */}
        <p className="mb-3 mt-10 text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
          Every month you get
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Tile icon={Users} label="Demographic mix" />
          <Tile icon={Clock} label="Peak hours & nights" />
          <Tile icon={Repeat} label="Repeat visit rate" />
          <Tile icon={Heart} label="Social pull" />
          <Tile
            icon={BarChart3}
            label="Benchmark vs similar Plus None bars"
            wide
          />
        </div>

        {/* Pull-quote outcomes */}
        <p className="mb-3 mt-10 text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
          So you can
        </p>
        <div className="space-y-3">
          <Quote
            headline="Staff the right nights."
            sub="Stop over-staffing slow ones. Stop drowning on busy ones."
          />
          <Quote
            headline="Run promotions where they'll land."
            sub="Tuesday slow? Now you know which singles are missing. Target them."
          />
          <Quote
            headline="Prove your story to brands."
            sub="Sell sponsorship deals with real demographic data, not guesses."
          />
          <Quote
            headline="Justify rent. Justify expansion."
            sub="When the landlord or investor asks if this place is working, show them."
          />
          <Quote
            headline="Become the singles bar of your city."
            sub="Repeat-visit data is the proof. Use it in your own marketing."
          />
        </div>
      </div>
    </section>
  );
}

function Tile({
  icon: Icon,
  label,
  wide = false,
}: {
  icon: LucideIcon;
  label: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`rounded-lg bg-[#ede4d5] p-3.5 ${wide ? "col-span-2" : ""}`}
    >
      <Icon className="mb-2 h-5 w-5 text-cobalt" />
      <div className="text-sm font-medium leading-snug text-stone-900">
        {label}
      </div>
    </div>
  );
}

function Quote({ headline, sub }: { headline: string; sub: string }) {
  return (
    <div className="border-l-2 border-cobalt pl-3.5">
      <p className="font-serif text-lg font-medium leading-snug text-stone-900 md:text-xl">
        {headline}
      </p>
      <p className="mt-0.5 text-sm leading-relaxed text-stone-700">{sub}</p>
    </div>
  );
}
