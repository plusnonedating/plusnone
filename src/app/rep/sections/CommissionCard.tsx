import type { RepSnapshot } from "@/lib/rep-data";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function nextPayoutDate(today: Date = new Date()): Date {
  // Payouts are on the 15th of the month AFTER commissions are earned.
  // If it's the 15th or later, next payout is the 15th of month+1.
  const d = new Date(today);
  d.setUTCDate(15);
  if (today.getUTCDate() >= 15) {
    d.setUTCMonth(d.getUTCMonth() + 1);
  }
  return d;
}

/**
 * Big top-of-page card showing this month's commission tally. Split
 * into recurring (from Active subs) + one-time (events booked this
 * month) so Sydney knows what's building versus what's already logged.
 *
 * Payout copy explains the flow: current-month commissions pay on the
 * 15th of NEXT month, per Section 4.1 of the contract.
 */
export default function CommissionCard({
  commission,
}: {
  commission: RepSnapshot["commission"];
}) {
  const payout = nextPayoutDate();
  const payoutStr = payout.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });
  return (
    <section className="mb-10 rounded-xl bg-[#2647e8] p-6 text-[#f4ede4] md:p-8">
      <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#f4ede4]/70">
        This month
      </p>
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-serif text-5xl leading-none tracking-tight md:text-6xl">
          {USD.format(commission.thisMonthTotal)}
        </span>
        <span className="text-sm text-[#f4ede4]/80">
          payable on {payoutStr}
        </span>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-md bg-[#f4ede4]/10 px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-wider text-[#f4ede4]/60">
            Recurring
          </div>
          <div className="mt-0.5 font-serif text-2xl leading-tight">
            {USD.format(commission.monthlyRecurring)}
          </div>
          <div className="text-[11px] text-[#f4ede4]/70">
            {commission.activeSubCount} active sub
            {commission.activeSubCount === 1 ? "" : "s"} × $99/mo
          </div>
        </div>
        <div className="rounded-md bg-[#f4ede4]/10 px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-wider text-[#f4ede4]/60">
            Events this month
          </div>
          <div className="mt-0.5 font-serif text-2xl leading-tight">
            {USD.format(commission.thisMonthOneTime)}
          </div>
          <div className="text-[11px] text-[#f4ede4]/70">
            {commission.bookedEventCount} booked
          </div>
        </div>
        <div className="rounded-md bg-[#f4ede4]/10 px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-wider text-[#f4ede4]/60">
            PayPal to
          </div>
          <div className="mt-0.5 truncate font-mono text-sm">
            s.goldie95@gmail.com
          </div>
          <div className="text-[11px] text-[#f4ede4]/70">
            USD. Your PayPal fees + FX on your end.
          </div>
        </div>
      </div>
      <details className="mt-5 text-sm text-[#f4ede4]/80">
        <summary className="cursor-pointer text-[11px] uppercase tracking-wider text-[#f4ede4]/60">
          How this is calculated
        </summary>
        <p className="mt-2 leading-relaxed">
          Business subs: $99 per Client per month, only for Clients you
          personally sourced &amp; closed and only while their sub is
          Active (payment collected). One-time events: $450 for a
          single-day booking, $600 for multi-day, on collection. Chargebacks
          within 60 days reverse the commission. Full detail in your
          contract, Exhibit A.
        </p>
      </details>
    </section>
  );
}
