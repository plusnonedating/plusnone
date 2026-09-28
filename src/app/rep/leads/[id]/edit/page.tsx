import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRep } from "@/lib/rep-auth";
import { getSalesBase } from "@/lib/sales-base";
import RepShell from "../../../RepShell";
import LeadForm, { type LeadInitial } from "../../LeadForm";

export const metadata: Metadata = {
  title: "Edit lead · Plus None Rep",
  robots: { index: false, follow: false },
};

const PIPELINE_TABLE = "Event Pitch Pipeline";
const REP_HANDLE = "sydney";

function s(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

export default async function EditLeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRep();
  const { id } = await params;

  const base = getSalesBase();
  const row = await base(PIPELINE_TABLE)
    .find(id)
    .catch(() => null);
  if (!row) notFound();
  const f = row.fields as Record<string, unknown>;
  if (f["Sourced By"] !== REP_HANDLE) {
    // Don't leak details of leads that belong to a different rep.
    notFound();
  }

  const initial: LeadInitial = {
    id,
    name: s(f["Event Name"]),
    type: s(f["Type"]),
    category: s(f["Category"]),
    contactName: s(f["Contact"]),
    contactEmail: s(f["Contact Email"]),
    contactPhone: s(f["Contact Phone"]),
    location: s(f["Location"]),
    seasonDates: s(f["Season / Dates"]),
    attendance: s(f["Attendance"]),
    whyItsAFit: s(f["Why It's a Fit"]),
    priority: s(f["Priority"]),
    status: s(f["Status"]),
    notes: s(f["Notes"]),
    pitchSent: Boolean(f["Pitch Sent?"]),
    dateLastContact: s(f["Date Last Contact"]),
  };

  return (
    <RepShell>
      <div className="mb-6">
        <Link
          href="/rep"
          className="text-xs uppercase tracking-wider text-stone-500 underline underline-offset-2"
        >
          ← Back to dashboard
        </Link>
      </div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Pipeline
      </p>
      <h1 className="mb-8 font-serif text-4xl leading-[1.05] tracking-tight text-stone-900 md:text-5xl">
        Edit {initial.name || "lead"}.
      </h1>
      <LeadForm initial={initial} />
    </RepShell>
  );
}
