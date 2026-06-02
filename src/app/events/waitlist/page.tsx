import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/partners/Header";
import WaitlistForm, {
  type EventsTier,
} from "@/components/marketing/WaitlistForm";

export const metadata: Metadata = {
  title: "Join the waitlist · Plus None for Events",
  description:
    "Get on the Plus None waitlist for your conference, festival, or one-night event. We'll email you when we open for new event activations.",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ tier?: string }>;
}

/**
 * /events/waitlist — public waitlist signup for event organizers.
 *
 * Accepts ?tier=single or ?tier=multi to pre-select a tier in the
 * form, matching which CTA the user clicked on /events. Falls back
 * to "undecided" if no/invalid tier provided.
 */
export default async function EventsWaitlistPage({
  searchParams,
}: PageProps) {
  const params = await searchParams;
  const initialTier: EventsTier =
    params.tier === "single"
      ? "single"
      : params.tier === "multi"
        ? "multi"
        : "undecided";

  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        <section className="bg-[#f4ede4] px-5 pt-6 pb-10 md:px-8 md:pt-16 md:pb-16">
          <div className="mx-auto max-w-2xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              For events
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-6xl md:leading-tight">
              Get on the Plus None waitlist.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              We&apos;re rolling out in priority order. Tell us about
              your event and we&apos;ll be in touch as soon as we open
              for new activations.
            </p>
            <p className="mt-5 font-serif text-xl italic leading-snug text-stone-700 md:mt-6 md:text-2xl">
              Minimum 14 business days lead time once we launch.
            </p>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-2xl">
            <WaitlistForm mode="events" initialTier={initialTier} />
          </div>
        </section>

        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/events">← Back to overview</Link>
        </div>
      </div>
    </div>
  );
}
