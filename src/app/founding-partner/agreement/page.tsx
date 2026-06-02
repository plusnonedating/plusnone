import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/partners/Header";
import AgreementForm from "@/components/partners/AgreementForm";

export const metadata: Metadata = {
  title: "Founding Partner Agreement · Plus None",
  description:
    "Confirm your Plus None Founding Partner spot. 365 days free, $99/month after, cancel anytime.",
  // Direct-link-only — never linked from public nav, don't index.
  robots: { index: false, follow: false },
};

/**
 * /founding-partner/agreement — click-wrap agreement page for venues
 * Kate has already pitched as founding partners.
 *
 * Not linked from anywhere on the site. Kate texts/emails the URL
 * directly to each partner. They fill out the form, accept terms via
 * required checkbox, submit. The POST writes to the Airtable
 * "Founding Partner Agreements" table in the Submissions base — same
 * base AIRTABLE_API_KEY already has write access to.
 *
 * No payment is collected at this step. Once Kate has an approved
 * payment processor, she'll separately reach out to convert each
 * agreement record into a billing setup.
 */
export default function FoundingPartnerAgreementPage() {
  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        {/* HERO */}
        <section className="bg-[#f4ede4] px-5 pt-6 pb-10 md:px-8 md:pt-16 md:pb-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Founding partner
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-6xl md:leading-tight">
              Confirm your founding partner spot.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              Plus None deploys at your venue this week. Confirm the
              founding partner agreement below — no payment today; we&apos;ll
              be in touch before your free year ends to set up billing.
            </p>
          </div>
        </section>

        {/* AGREEMENT BODY + FORM */}
        <section className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-2xl leading-tight text-stone-900 md:text-3xl">
              What you&apos;re agreeing to
            </h2>

            <div className="mt-6 space-y-4 text-base leading-relaxed text-stone-700">
              <p>
                <strong>The offer.</strong> Plus None deployed at your
                venue, free for 365 days from launch. After 365 days,
                $99/month, billed monthly, cancel anytime. No setup
                fees, ever.
              </p>
              <p>
                <strong>What you get.</strong> Geo-gated venue
                deployment; custom-printed signage (table tents +
                bathroom-mirror stickers) shipped within 10 business
                days; monthly social posts on Plus None&apos;s Instagram +
                @TheVenueCEO (1M+ combined audience); monthly data
                report on scans, submissions, demographics, and
                repeat-visit rates at your venue.
              </p>
              <p>
                <strong>What we ask.</strong> Place the signage somewhere
                visible (bar top, mirror, host stand). Let us reference
                your venue + the activation in our marketing — photos,
                video, social posts, press.
              </p>
              <p>
                <strong>Cancellation.</strong> Email{" "}
                <a
                  href="mailto:plusnone@fetewell.com"
                  className="underline"
                >
                  plusnone@fetewell.com
                </a>{" "}
                anytime. We&apos;ll remove your venue from the geo-gated
                network at the end of the current billing cycle (or
                immediately, if still inside the 365-day free window).
              </p>
              <p className="text-sm text-stone-600">
                For the full legal terms see{" "}
                <Link
                  href="/partner-terms"
                  className="underline"
                  target="_blank"
                >
                  Partner Terms
                </Link>
                .
              </p>
            </div>

            <div className="mt-10">
              <AgreementForm />
            </div>
          </div>
        </section>

        {/* FOOTER — minimal, matches partner-page convention */}
        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/partner-terms">Partner Terms</Link> ·{" "}
          <a href="https://fetewell.com/plus-none-terms">User Terms</a> ·{" "}
          <Link href="/privacy-policy">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
