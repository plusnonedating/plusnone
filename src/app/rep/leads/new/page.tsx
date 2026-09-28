import type { Metadata } from "next";
import Link from "next/link";
import { requireRep } from "@/lib/rep-auth";
import RepShell from "../../RepShell";
import LeadForm, { EMPTY_LEAD } from "../LeadForm";

export const metadata: Metadata = {
  title: "Add lead · Plus None Rep",
  robots: { index: false, follow: false },
};

export default async function NewLeadPage() {
  await requireRep();
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
      <h1 className="mb-2 font-serif text-4xl leading-[1.05] tracking-tight text-stone-900 md:text-5xl">
        Add a lead.
      </h1>
      <p className="mb-8 max-w-xl text-sm leading-relaxed text-stone-700">
        Fill in whatever you know. Only the name is required — you can
        fill in the rest as you dig deeper. Everything you save here is
        tagged to you automatically.
      </p>
      <LeadForm initial={EMPTY_LEAD} />
    </RepShell>
  );
}
