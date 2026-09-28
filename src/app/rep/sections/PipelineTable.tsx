import Link from "next/link";
import type { PipelineItem, WaitlistLead } from "@/lib/rep-data";

interface Props {
  pipeline: PipelineItem[];
  waitlist: WaitlistLead[];
}

/**
 * Open pipeline — prospects Sydney's working. Currently pulls from
 * two places: the Event Pitch Pipeline table (curated list Kate
 * maintains) and Web Waitlist rows tagged to her.
 */
export default function PipelineTable({ pipeline, waitlist }: Props) {
  const total = pipeline.length + waitlist.length;
  return (
    <section className="mb-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Pipeline ({total})
      </p>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        Who you&apos;re chasing.
      </h2>

      {total === 0 && (
        <div className="rounded-lg border border-dashed border-stone-400 bg-white/40 p-6 text-center text-sm text-stone-600">
          Empty pipeline. Ask Kate to hand you leads from the Event Pitch
          Pipeline table, or use the cold-pitch templates below to source
          your own.
        </div>
      )}

      {pipeline.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg border border-stone-300 bg-white">
          <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-stone-600">
            Event pitch pipeline
          </div>
          <div className="divide-y divide-stone-200">
            {pipeline.map((p) => (
              <div key={p.id} className="px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-stone-900">{p.name}</span>
                  {p.priority && (
                    <PriorityChip level={p.priority} />
                  )}
                  {p.status && (
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone-600">
                      {p.status}
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-stone-600">
                  {p.category && <span>{p.category} · </span>}
                  {p.location || "location TBD"}
                </div>
                {p.notes && (
                  <div className="mt-1 text-xs text-stone-500">{p.notes}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {waitlist.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-stone-300 bg-white">
          <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-stone-600">
            Waitlist leads (yours)
          </div>
          <div className="divide-y divide-stone-200">
            {waitlist.map((w) => (
              <div key={w.id} className="px-4 py-3">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-medium text-stone-900">
                    {w.businessName}
                  </span>
                  <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone-600">
                    {w.type}
                  </span>
                </div>
                <div className="mt-0.5 text-xs text-stone-600">
                  {w.contactName} ·{" "}
                  <Link
                    href={`mailto:${w.email}`}
                    className="underline underline-offset-2"
                  >
                    {w.email}
                  </Link>
                </div>
                {w.location && (
                  <div className="mt-0.5 text-xs text-stone-500">
                    {w.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function PriorityChip({ level }: { level: string }) {
  const l = level.toLowerCase();
  const color =
    l === "high" || l === "hot"
      ? "bg-red-100 text-red-800"
      : l === "medium" || l === "warm"
        ? "bg-amber-100 text-amber-800"
        : "bg-stone-100 text-stone-700";
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${color}`}
    >
      {level}
    </span>
  );
}
