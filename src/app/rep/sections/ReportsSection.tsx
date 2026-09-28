import Link from "next/link";
import type { BusinessAccount } from "@/lib/rep-data";

/**
 * Client report launcher. For every Active Business sub, Sydney can
 * generate a monthly report — an in-dashboard, printable page that
 * fills in the scan/demographic/repeat-visit numbers automatically.
 *
 * Reports do NOT include individual end-user PII (per contract §9.8).
 * Only aggregate counts and demographic bands.
 */
export default function ReportsSection({
  clients,
}: {
  clients: BusinessAccount[];
}) {
  return (
    <section className="mb-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Client reports
      </p>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        Generate a monthly report.
      </h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-700">
        Once a Client is Active, their monthly report shows here.
        Aggregated data only — no individual end-user names, photos, or
        handles (see §9.8 of your contract). Click a Client to open a
        printable report page you can save to PDF and email.
      </p>
      {clients.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-400 bg-white/40 p-6 text-center text-sm text-stone-600">
          No Active Clients yet. Your first monthly report will land here
          once you close a Business sub.
        </div>
      ) : (
        <ul className="space-y-2">
          {clients.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between rounded border border-stone-300 bg-white px-4 py-3"
            >
              <div>
                <div className="font-medium text-stone-900">
                  {c.businessName}
                </div>
                <div className="text-xs text-stone-500">
                  {c.geotagAddress || "no address"}
                </div>
              </div>
              <Link
                href={`/rep/reports/${c.id}`}
                className="rounded bg-stone-900 px-3 py-1.5 text-xs text-[#f4ede4]"
              >
                Generate →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
