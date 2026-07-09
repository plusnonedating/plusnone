import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/partners/Header";
import EventsBookingForm from "@/components/marketing/EventsBookingForm";
import { isLiveCheckout } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Book Plus None for your event",
  description:
    "One-time Plus None activation for your festival, conference, or brand event. $499 (24h) or $799 (72h).",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ tier?: string }>;
}

/**
 * /events/booking — paid booking form for the one-time event tiers.
 *
 * When LIVE_CHECKOUT=false, we redirect to /events/waitlist so the
 * old CTA URLs work during either mode without the user hitting a
 * broken payment page.
 */
export default async function EventsBookingPage({ searchParams }: PageProps) {
  if (!isLiveCheckout()) {
    redirect("/events/waitlist");
  }

  const params = await searchParams;
  const initialTier = params.tier === "multi" ? "multi" : "single";

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
              Book Plus None for your event.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              $499 for a 24-hour single-day activation, or $799 for a
              72-hour multi-day. Charged in full at booking. Free
              reschedule up to 7 days before your event; non-refundable
              within 7 days.
            </p>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-2xl">
            <EventsBookingForm initialTier={initialTier as "single" | "multi"} />
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
