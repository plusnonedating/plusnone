import {
  Award,
  BarChart3,
  Clock,
  Megaphone,
  Users,
  type LucideIcon,
} from "lucide-react";

/**
 * Popup-flavored variant of DataSection used on /popup. Same three-block
 * structure (sample report card → tile grid → cobalt-border outcomes) but
 * adapted for one-off events: post-event report (vs monthly), event
 * deliverables (vs monthly tiles), and event-ROI outcomes (vs ongoing
 * bar-operator outcomes).
 *
 * The sample card here shows a DIFFERENT angle from /popup's hero card —
 * hero shows headline 4-stat grid, this shows two highlight metrics +
 * an hourly scan chart, so the two visualizations complement each other
 * instead of repeating.
 */
export default function PopupDataSection() {
  return (
    <section className="bg-cream px-5 py-12 md:px-8 md:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
          The data
        </p>
        <h2 className="font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
          Post-event proof your guests showed up.
        </h2>
        <p className="mt-4 text-base leading-relaxed text-stone-700 md:text-lg">
          Event planners spend months on the night. Plus None gives you the
          numbers afterward — the demographic mix, the social pull, the
          repeat-visitor signal — so you can sell sponsors, book the venue
          back, and pitch the next edition with data.
        </p>

        {/* Sample post-event report card */}
        <div className="mt-8 rounded-xl bg-stone-900 p-5 md:mt-10 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-[11px] uppercase tracking-[0.14em] text-stone-400">
              The Singles Mixer · Vol. 4
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
                Submissions
              </div>
              <div className="font-serif text-3xl leading-none text-cream">
                284
              </div>
            </div>
            <div className="rounded-md bg-stone-800 px-3 py-2.5">
              <div className="mb-1 text-[11px] uppercase tracking-wider text-stone-500">
                Social reach
              </div>
              <div className="font-serif text-3xl leading-none text-cream">
                84K
              </div>
            </div>
          </div>

          <div className="mb-2 text-[11px] uppercase tracking-[0.1em] text-stone-500">
            Scans by hour
          </div>
          <div className="mb-2 flex h-14 items-end gap-1.5">
            {[20, 38, 62, 92, 88, 56, 28].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t-sm bg-cobalt"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-stone-500">
            {["8p", "9p", "10p", "11p", "12a", "1a", "2a"].map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>
        </div>

        {/* Tile grid */}
        <p className="mb-3 mt-10 text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
          Your post-event report covers
        </p>
        <div className="grid grid-cols-2 gap-2">
          <Tile icon={Users} label="Demographic mix" />
          <Tile icon={Clock} label="Peak hours of the night" />
          <Tile icon={Megaphone} label="Social reach from your event" />
          <Tile icon={Award} label="Submission-to-follow conversion" />
          <Tile
            icon={BarChart3}
            label="Benchmark vs similar Plus None events"
            wide
          />
        </div>

        {/* Pull-quote outcomes */}
        <p className="mb-3 mt-10 text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
          So you can
        </p>
        <div className="space-y-3">
          <Quote
            headline="Prove ROI to sponsors and partners."
            sub="Sell next year's sponsorship deck with real demographic and reach numbers, not vibes."
          />
          <Quote
            headline="Build a case for a repeat edition."
            sub="When the venue or planner asks 'should we do this again?' — show them."
          />
          <Quote
            headline="Get retargetable post-event attention."
            sub="The Plus None Instagram posts keep your event in front of single attendees for days afterward."
          />
          <Quote
            headline="Understand who actually showed up."
            sub="Marketing said one thing, the door was another. Plus None tells you what the room really looked like."
          />
          <Quote
            headline="Land your next venue or brand partnership."
            sub="Pitch decks land harder when there's a single-page report attached, not a vague claim."
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
