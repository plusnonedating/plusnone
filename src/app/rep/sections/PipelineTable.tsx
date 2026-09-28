import Link from "next/link";
import type { PipelineItem, WaitlistLead } from "@/lib/rep-data";

interface Props {
  pipeline: PipelineItem[];
  waitlist: WaitlistLead[];
}

/**
 * Open pipeline — prospects Sydney's working. Pulls from two places:
 * the Event Pitch Pipeline table (leads Sydney adds via the portal or
 * Kate curates in Airtable) and Web Waitlist rows tagged to her. She
 * can add + edit + delete pipeline rows here; waitlist rows are
 * read-only because they come from the signup flow.
 */
export default function PipelineTable({ pipeline, waitlist }: Props) {
  const total = pipeline.length + waitlist.length;
  return (
    <section className="mb-10">
      <div className="mb-1 flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
          Pipeline ({total})
        </p>
        <Link
          href="/rep/leads/new"
          className="rounded bg-black px-3 py-1.5 text-xs font-medium text-[#f4ede4] hover:opacity-90"
        >
          + Add lead
        </Link>
      </div>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        Who you&apos;re chasing.
      </h2>

      {total === 0 && (
        <div className="rounded-lg border border-dashed border-stone-400 bg-white/40 p-6 text-center text-sm text-stone-600">
          Empty pipeline. Tap <span className="font-medium">+ Add lead</span>{" "}
          to start tracking a prospect, or use the cold-pitch templates below
          for outreach ideas.
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
                  {p.priority && <PriorityChip level={p.priority} />}
                  {p.status && (
                    <span className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-stone-600">
                      {p.status}
                    </span>
                  )}
                  {p.pitchSent && (
                    <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-emerald-800">
                      Pitched
                    </span>
                  )}
                  <Link
                    href={`/rep/leads/${p.id}/edit`}
                    className="ml-auto text-xs text-stone-500 underline underline-offset-2 hover:text-stone-900"
                  >
                    Edit
                  </Link>
                </div>
                <div className="mt-0.5 text-xs text-stone-600">
                  {p.type && <span>{p.type} · </span>}
                  {p.category && <span>{p.category} · </span>}
                  {p.location || "location TBD"}
                </div>
                {(p.contactName || p.contactEmail || p.contactPhone) && (
                  <div className="mt-0.5 text-xs text-stone-600">
                    {p.contactName && <span>{p.contactName}</span>}
                    {p.contactName && (p.contactEmail || p.contactPhone) && (
                      <span> · </span>
                    )}
                    {p.contactEmail && (
                      <Link
                        href={`mailto:${p.contactEmail}`}
                        className="underline underline-offset-2"
                      >
                        {p.contactEmail}
                      </Link>
                    )}
                    {p.contactEmail && p.contactPhone && <span> · </span>}
                    {p.contactPhone && <span>{p.contactPhone}</span>}
                  </div>
                )}
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
