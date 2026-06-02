import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/partners/Header";
import WaitlistForm from "@/components/marketing/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the waitlist · Plus None for Business",
  description:
    "Get on the Plus None waitlist for your bar, restaurant, or venue. We'll email you when we open for new businesses in your city.",
  robots: { index: false, follow: false },
};

/**
 * /business/waitlist — public waitlist signup for bars / restaurants
 * / venues.
 *
 * Replaces the mailto link on /business while Plus None is between
 * payment processors. POSTs to /api/waitlist which writes to the
 * Airtable "Waitlist" table with Type = "Business".
 */
export default function BusinessWaitlistPage() {
  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        <section className="bg-[#f4ede4] px-5 pt-6 pb-10 md:px-8 md:pt-16 md:pb-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              For business
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-6xl md:leading-tight">
              Get on the Plus None waitlist.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              We&apos;re finalizing our payment processor and rolling
              out in priority order. Tell us about your business and
              we&apos;ll be in touch the moment we open in your city.
            </p>
            <p className="mt-5 font-serif text-xl italic leading-snug text-stone-700 md:mt-6 md:text-2xl">
              First 30 days free when we launch. Card on file required
              at signup; no charges for 30 days.
            </p>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-2xl">
            <WaitlistForm mode="business" />
          </div>
        </section>

        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/business">← Back to overview</Link>
        </div>
      </div>
    </div>
  );
}
