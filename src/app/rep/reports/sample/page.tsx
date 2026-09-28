import type { Metadata } from "next";
import Link from "next/link";
import { requireRep } from "@/lib/rep-auth";
import PrintButton from "../[clientId]/PrintButton";

export const metadata: Metadata = {
  title: "Sample report · Plus None Rep",
  robots: { index: false, follow: false },
};

/**
 * Sample client report — a fully-populated version of the monthly
 * report Sydney can show prospects during a pitch. Layout mirrors
 * the real /rep/reports/[clientId] page so what she demos is what
 * the Client will actually receive.
 *
 * Numbers here are illustrative — realistic-but-fictional for a
 * mid-size bar in month one. They're clearly labeled SAMPLE on the
 * page so nobody mistakes them for real Client data.
 */
export default async function SampleReportPage() {
  await requireRep();

  const businessName = "The Sample Bar";
  const contactName = "Alex";
  const geotag = "123 Main St, Frederick, MD";
  const activeSince = "2026-03-01";
  const reportMonth = "March 2026";

  const headlineMetrics = [
    { label: "Total scans", value: "847" },
    { label: "Submissions", value: "312" },
    { label: "Repeat rate (30d)", value: "18%" },
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
          <PrintButton />
        </div>

        <div className="mb-4 rounded border border-[#2647e8] bg-[#2647e8]/5 px-4 py-3 text-xs text-[#2647e8] print:hidden">
          <strong>Sample report</strong> — this is what a Client&apos;s
          monthly report looks like once they&apos;re signed up. Use it in
          pitches to show prospects the deliverable. Numbers are
          illustrative.
        </div>

        <article className="rounded-xl border border-stone-300 bg-white p-8 shadow-sm print:border-0 print:shadow-none md:p-10">
          <header className="mb-8 border-b border-stone-300 pb-6">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
                  Plus None · {reportMonth} report · SAMPLE
                </p>
                <h1 className="mt-1 font-serif text-3xl leading-tight tracking-tight text-stone-900 md:text-4xl">
                  {businessName}
                </h1>
              </div>
              <div className="text-right text-xs text-stone-500">
                <div>{geotag}</div>
                <div className="mt-0.5">Client since {activeSince}</div>
              </div>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Headline
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {headlineMetrics.map((m) => (
                <Metric key={m.label} label={m.label} value={m.value} />
              ))}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-stone-600">
              847 phones tapped the geotag at your door this month. 312 of
              those (37%) filled out a profile. Nearly 1 in 5 came back
              within 30 days — that&apos;s the flywheel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Who&apos;s coming through
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <Card
                title="Demographic mix"
                lines={[
                  "21–25: 34%",
                  "26–30: 41%",
                  "31–35: 17%",
                  "36+: 8%",
                  "Gender: 52% women / 46% men / 2% non-binary",
                ]}
              />
              <Card
                title="Peak nights"
                lines={[
                  "Fri: 212 scans (25%)",
                  "Sat: 198 scans (23%)",
                  "Thu: 141 scans (17%)",
                  "Sun brunch: 89 scans (11%)",
                ]}
              />
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Social pull
            </h2>
            <Card
              title={`@plusnonedating features for ${businessName}`}
              lines={[
                "4 posts tagged your location this month",
                "Combined reach: 47,300 across IG + TikTok",
                "Top post: 18,900 views (Thurs karaoke crowd)",
                "Estimated attributed foot traffic: ~60 new faces",
              ]}
            />
          </section>

          <section className="mb-8">
            <h2 className="mb-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              What to do with this
            </h2>
            <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
              <li>
                <strong>Staff Friday and Saturday hard.</strong> 48% of
                your Plus None traffic hits those two nights. Book the
                extra bartender.
              </li>
              <li>
                <strong>Tuesday is your opportunity.</strong> Under 30
                scans. Run a &ldquo;singles night&rdquo; promo — your
                26–30 demographic is your bread and butter and they&apos;re
                not showing up midweek.
              </li>
              <li>
                <strong>Justify what you&apos;re building.</strong> 847
                scans + 47,300 social reach + 60 attributed new faces.
                That&apos;s the story for your landlord, your investors,
                or whoever needs to hear the ROI.
              </li>
            </ul>
          </section>

          <footer className="mt-10 border-t border-stone-300 pt-6 text-xs text-stone-500">
            <p>
              Prepared for {contactName} by Sydney at Plus None.
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

function Card({ title, lines }: { title: string; lines: string[] }) {
  return (
    <div className="rounded-lg border border-stone-300 bg-[#f4ede4]/50 p-4">
      <div className="mb-2 font-medium text-stone-900">{title}</div>
      <ul className="space-y-1 text-sm text-stone-700">
        {lines.map((l, i) => (
          <li key={i}>· {l}</li>
        ))}
      </ul>
    </div>
  );
}
