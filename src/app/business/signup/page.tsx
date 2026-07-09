import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/partners/Header";
import BusinessSignupForm from "@/components/marketing/BusinessSignupForm";
import { isLiveCheckout } from "@/lib/site-config";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign up · Plus None for Business",
  description:
    "Add Plus None to your bar, restaurant, or venue. $99/month, 30 days free.",
  // Not linked from public nav until Kate flips LIVE_CHECKOUT=true.
  robots: { index: false, follow: false },
};

/**
 * /business/signup — the paid Business subscription signup form.
 *
 * Guarded by `LIVE_CHECKOUT`; if the flag isn't set, we redirect to
 * /business/waitlist so anyone who bookmarks this URL during waitlist
 * mode lands somewhere useful instead of a broken page.
 */
export default function BusinessSignupPage() {
  if (!isLiveCheckout()) {
    redirect("/business/waitlist");
  }

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
              Sign up for Plus None.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              $99/month. Your first 30 days are on us — we won&apos;t
              charge you a cent until day 31. Cancel anytime.
            </p>
            <p className="mt-5 font-serif text-xl italic leading-snug text-stone-700 md:mt-6 md:text-2xl">
              Card required at signup to hold your spot. No charges for
              30 days.
            </p>
          </div>
        </section>

        <section className="px-5 py-12 md:px-8 md:py-16">
          <div className="mx-auto max-w-2xl">
            <BusinessSignupForm />
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
