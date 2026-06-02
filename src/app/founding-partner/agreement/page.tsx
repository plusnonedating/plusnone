import type { Metadata } from "next";
import Link from "next/link";
import { AtSign, BarChart3, MapPin, Megaphone } from "lucide-react";
import Header from "@/components/partners/Header";
import AgreementForm from "@/components/partners/AgreementForm";
import { StatStrip } from "@/components/marketing/StatStrip";
import { Statement } from "@/components/marketing/Statement";

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
 *
 * The page mirrors the "what you get" pitch from /founding-partner so
 * partners hit the agreement re-energized, not just doing paperwork.
 */
export default function FoundingPartnerAgreementPage() {
  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        {/* HERO */}
        <section className="bg-[#f4ede4] px-5 pt-6 pb-10 md:px-8 md:pt-16 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Founding partner
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-6xl md:leading-tight">
              Confirm your founding partner spot.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              Plus None turns the room into a social pool. Singles at
              your business can find each other — no app, no download,
              no messaging, just IRL connections.
            </p>
            <p className="mt-5 font-serif text-xl italic leading-snug text-stone-700 md:mt-6 md:text-2xl">
              You&apos;re one of our first five. We deploy at your
              venue this week.
            </p>
          </div>
        </section>

        {/* STAT STRIP — visual social proof */}
        <StatStrip
          items={[
            { value: "1M+", label: "Social reach" },
            { value: "Yours", label: "Geo-gated" },
            { value: "Monthly", label: "Data report" },
          ]}
        />

        {/* WHAT YOU'RE GETTING — concrete deliverables */}
        <section className="bg-[#f4ede4] px-5 pt-12 pb-8 md:px-8 md:pt-20 md:pb-12">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              What you&apos;re getting
            </p>
            <h2 className="font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
              Built to run itself. Designed not to bug you.
            </h2>

            <div className="mt-8 space-y-5 md:mt-10 md:space-y-6">
              <Statement
                icon={MapPin}
                title="Geo-gated exclusively to your business."
                body="Only people physically at your business join the pool. The bar next door doesn't get your patrons. Period."
              />
              <Statement
                icon={AtSign}
                title="Featured to 1M+."
                body="Your venue posted on Plus None's Instagram and our founder's @TheVenueCEO — combined 1M+ followers actively engaged with going-out content."
              />
              <Statement
                icon={Megaphone}
                title="Printed signage, shipped to you."
                body="Designed, printed, delivered. Table tents + bathroom-mirror stickers, ready to place. Within 10 business days of signing."
              />
              <Statement
                icon={BarChart3}
                title="Monthly data report."
                body="Scans, submissions, unique visitors, repeat visit rates — at your business specifically. Delivered by email."
              />
            </div>

            <p className="mt-10 font-serif text-2xl italic leading-snug text-[#2647e8] md:mt-12 md:text-3xl">
              Build the place they tell stories about for the next decade.
            </p>
          </div>
        </section>

        {/* WHAT YOU'RE AGREEING TO — formal bullets */}
        <section className="px-5 pt-12 pb-8 md:px-8 md:pt-16 md:pb-10">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              The fine print
            </p>
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
                <strong>What we ask.</strong> Place the signage somewhere
                visible (bar top, mirror, host stand). Let us reference
                your business and the activation in our marketing — photos,
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
                anytime. We&apos;ll remove your business from the geo-gated
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
          </div>
        </section>

        {/* FORM */}
        <section className="px-5 pb-16 md:px-8 md:pb-20">
          <div className="mx-auto max-w-2xl">
            <AgreementForm />
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
