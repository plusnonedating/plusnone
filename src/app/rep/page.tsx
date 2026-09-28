import type { Metadata } from "next";
import Link from "next/link";
import { requireRep } from "@/lib/rep-auth";
import { fetchRepSnapshot } from "@/lib/rep-data";
import RepShell from "./RepShell";
import CommissionCard from "./sections/CommissionCard";
import TrackingLinks from "./sections/TrackingLinks";
import AccountsTable from "./sections/AccountsTable";
import PipelineTable from "./sections/PipelineTable";
import ReportsSection from "./sections/ReportsSection";
import SocialsPlaceholder from "./sections/SocialsPlaceholder";
import PlaybookLinks from "./sections/PlaybookLinks";

export const metadata: Metadata = {
  title: "Rep dashboard · Plus None",
  robots: { index: false, follow: false },
};

// Default rep identity for Phase 1. Sydney is the only rep, and the
// dashboard is shared via a single password. When we add more reps
// we'll derive this from the session.
const REP_HANDLE = "sydney";
const REP_DISPLAY_NAME = "Sydney";

export default async function RepDashboardPage() {
  await requireRep();
  const snap = await fetchRepSnapshot(REP_HANDLE);

  return (
    <RepShell>
      <section className="mb-10">
        <p className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
          Rep dashboard
        </p>
        <h1 className="font-serif text-4xl leading-[1.05] tracking-tight text-stone-900 md:text-5xl">
          Hey {REP_DISPLAY_NAME} —
        </h1>
        <p className="mt-3 max-w-xl text-base leading-relaxed text-stone-700">
          Everything tied to your name is below. Commission runs while
          you&apos;re engaged; PayPal goes out on the 15th of the next
          month. Anything missing from this dashboard, ping Kate.
        </p>
      </section>

      <CommissionCard commission={snap.commission} />

      <TrackingLinks rep={REP_HANDLE} />

      <AccountsTable
        businessActive={snap.business.active}
        businessPending={snap.business.pending}
        eventsBooked={snap.events.booked}
        eventsPending={snap.events.pending}
      />

      <PipelineTable
        pipeline={snap.pipeline}
        waitlist={snap.waitlist}
      />

      <ReportsSection clients={snap.business.active} />

      <SocialsPlaceholder />

      <PlaybookLinks />

      <footer className="mt-16 border-t border-stone-300 pt-6 text-xs text-stone-500">
        <p>
          Plus None LLC · Questions to{" "}
          <Link
            href="mailto:plusnone@fetewell.com"
            className="underline"
          >
            plusnone@fetewell.com
          </Link>
        </p>
      </footer>
    </RepShell>
  );
}
