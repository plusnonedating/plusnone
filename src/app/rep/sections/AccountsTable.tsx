import Link from "next/link";
import type { BusinessAccount, EventAccount } from "@/lib/rep-data";

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

interface Props {
  businessActive: BusinessAccount[];
  businessPending: BusinessAccount[];
  eventsBooked: EventAccount[];
  eventsPending: EventAccount[];
}

/**
 * Closed and in-flight accounts. Splits active/booked (commission
 * earning) from Pending Payment (started checkout, didn't finish —
 * worth a follow-up).
 */
export default function AccountsTable({
  businessActive,
  businessPending,
  eventsBooked,
  eventsPending,
}: Props) {
  const totalClosed = businessActive.length + eventsBooked.length;
  return (
    <section className="mb-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Accounts ({totalClosed} closed)
      </p>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        What you&apos;ve closed.
      </h2>

      {totalClosed === 0 && (
        <div className="rounded-lg border border-dashed border-stone-400 bg-white/40 p-6 text-center text-sm text-stone-600">
          Nothing yet. Close your first Business sub and it&apos;ll show up
          here with your $99/mo ticking. Every event booking adds $450 or
          $600 in one shot.
        </div>
      )}

      {businessActive.length > 0 && (
        <SubList title="Active Business subs" items={businessActive} />
      )}
      {eventsBooked.length > 0 && (
        <EventList title="Booked events" items={eventsBooked} />
      )}
      {(businessPending.length > 0 || eventsPending.length > 0) && (
        <div className="mt-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-amber-900">
            Pending Payment — chase these
          </p>
          <ul className="space-y-1 text-sm text-amber-900">
            {businessPending.map((b) => (
              <li key={b.id}>
                {b.businessName} — {b.contactName} —{" "}
                <Link
                  href={`mailto:${b.email}`}
                  className="underline underline-offset-2"
                >
                  {b.email}
                </Link>
              </li>
            ))}
            {eventsPending.map((e) => (
              <li key={e.id}>
                {e.eventName} ({e.tier}) — {e.contactName} —{" "}
                <Link
                  href={`mailto:${e.email}`}
                  className="underline underline-offset-2"
                >
                  {e.email}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function SubList({ title, items }: { title: string; items: BusinessAccount[] }) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-stone-600">
        {title}
      </div>
      <div className="divide-y divide-stone-200">
        {items.map((b) => (
          <div key={b.id} className="flex flex-wrap gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-stone-900">{b.businessName}</div>
              <div className="text-xs text-stone-600">
                {b.contactName} · {b.email}
              </div>
              <div className="mt-0.5 text-xs text-stone-500">
                Since {b.signupDate ?? "—"} · {b.geotagAddress || "no address"}
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-mono text-stone-900">
                {USD.format(b.commissionPerMonth)}
              </div>
              <div className="text-xs text-stone-500">/mo to you</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventList({ title, items }: { title: string; items: EventAccount[] }) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div className="border-b border-stone-200 bg-stone-50 px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-stone-600">
        {title}
      </div>
      <div className="divide-y divide-stone-200">
        {items.map((e) => (
          <div key={e.id} className="flex flex-wrap gap-3 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="font-medium text-stone-900">{e.eventName}</div>
              <div className="text-xs text-stone-600">
                {e.contactName} · {e.email}
              </div>
              <div className="mt-0.5 text-xs text-stone-500">
                {e.tier} · {e.eventStartDate ?? "date TBD"}
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-mono text-stone-900">
                {USD.format(e.commission)}
              </div>
              <div className="text-xs text-stone-500">one-time</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
