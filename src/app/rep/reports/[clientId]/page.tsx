import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRep } from "@/lib/rep-auth";
import { getSalesBase } from "@/lib/sales-base";
import PrintButton from "./PrintButton";
import SendToClientButton from "./SendToClientButton";

export const metadata: Metadata = {
  title: "Client report · Plus None Rep",
  robots: { index: false, follow: false },
};

interface Fields {
  [k: string]: unknown;
}

function str(v: unknown): string {
  if (typeof v === "string") return v;
  if (v == null) return "";
  return String(v);
}

/**
 * Individual client report. Pulls the Client's Airtable row and
 * renders a printable, brand-consistent monthly report Sydney can
 * save to PDF and email.
 *
 * Metrics are placeholder-labeled until we wire up the Submissions
 * table aggregation. When that lands, this page reads from
 * `fetchRecentSubmissions(venueLabel)` and computes real figures.
 * Contract §9.8 forbids any individual PII in the report — aggregate
 * counts and demographic bands only.
 */
export default async function ClientReportPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  await requireRep();
  const { clientId } = await params;

  const base = getSalesBase();
  const row = await base("Business")
    .find(clientId)
    .catch(() => null);
  if (!row) notFound();

  const f = row.fields as Fields;
  const businessName = str(f["Business Name"]);
  const contactName = str(f["Contact Name"]);
  const clientEmail = str(f["Email"]);
  const geotag = str(f["Geotag Address"]);
  const activeSince = str(f["Signup Date"]);
  const now = new Date();
  const reportMonth = now.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Kept in one place so the on-screen tiles and the Send-to-client
  // email body render the same numbers. When we wire real metrics
  // from the Submissions pipeline, swap the "—" values here.
  const headlineMetrics: { label: string; value: string }[] = [
    { label: "Total scans", value: "—" },
    { label: "Submissions", value: "—" },
    { label: "Repeat rate (30d)", value: "—" },
  ];

  return (
    <div className="min-h-screen bg-[#f4ede4] print:bg-white">
      <div className="mx-auto max-w-3xl px-6 py-8 print:py-4">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link
            href="/rep"
            className="text-xs uppercase tracking-wider text-stone-500 underline underline-offset-2"
          >
            ← Back to dashboard
          </Link>
          <div className="flex items-center gap-2">
            <PrintButton />
            <SendToClientButton
              clientEmail={clientEmail}
              contactName={contactName}
              businessName={businessName}
              reportMonth={reportMonth}
              headlineMetrics={headlineMetrics}
              senderName="Sydney"
              senderEmail="plusnone@fetewell.com"
            />
          </div>
        </div>

        <article className="rounded-xl border border-stone-300 bg-white p-8 shadow-sm print:border-0 print:shadow-none md:p-10">
          <header className="mb-8 border-b border-stone-300 pb-6">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
                  Plus None · {reportMonth} report
                </p>
                <h1 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-stone-900 md:text-4xl">
                  {businessName || "Client"}
                </h1>
              </div>
              <div className="text-right text-xs text-stone-500">
                <div>{geotag || "—"}</div>
                {activeSince && (
                  <div className="mt-0.5">Client since {activeSince}</div>
                )}
              </div>
            </div>
          </header>

          <PlaceholderNotice />

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Headline
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {headlineMetrics.map((m) => (
                <Metric key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Who&apos;s coming through
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Card
                title="Demographic mix"
                body="Age band split and gender mix from opt-in profiles this month."
              />
              <Card
                title="Peak nights"
                body="Top three nights of the week by scan volume."
              />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Social pull
            </h2>
            <Card
              title={`@plusnonedating features for ${businessName || "your venue"}`}
              body="Total reach across IG + TikTok from posts that tagged your location."
            />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              What to do with this
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
              <li>
                <strong>Staff your peak nights.</strong> Stop drowning on
                the busy ones, stop over-staffing the slow ones.
              </li>
              <li>
                <strong>Promote where the singles are missing.</strong>{" "}
                Tuesday soft? Now you know who&apos;s not showing up. Target them.
              </li>
              <li>
                <strong>Justify what you&apos;re building.</strong> When the
                landlord or investor asks if this is working, show them.
              </li>
            </ul>
          </section>

          <footer className="mt-10 border-t border-stone-300 pt-6 text-xs text-stone-500">
            <p>
              Prepared for {contactName || "you"} by Sydney at Plus None.
              Questions or a request for a data pull? plusnone@fetewell.com.
            </p>
            <p className="mt-1">
              This report reflects opt-in participation only. Individual
              profiles, photos, and identities are never included — figures
              are aggregated to protect dater privacy.
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}

function PlaceholderNotice() {
  return (
    <div className="mb-6 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900 print:hidden">
      <strong>Preview mode:</strong> the metrics below are placeholders
      until the Submissions data pipeline is wired to this dashboard.
      Layout and copy are final — the numbers will fill in automatically
      when it&apos;s live.
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-stone-900 p-4 text-[#f4ede4]">
      <div className="text-[10px] uppercase tracking-wider text-stone-400">
        {label}
      </div>
      <div className="mt-1 font-serif text-3xl leading-none">{value}</div>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-stone-300 bg-[#f4ede4]/50 p-4">
      <div className="font-medium text-stone-900">{title}</div>
      <div className="mt-1 text-sm text-stone-600">{body}</div>
    </div>
  );
}
