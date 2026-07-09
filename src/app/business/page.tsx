import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";
import { isLiveCheckout } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "For business · Plus None",
  description:
    "Turn your business into a social pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

/**
 * /business — public sales page. CTA target depends on
 * LIVE_CHECKOUT:
 *
 *   - true  → /business/signup (paid Auth.net flow)
 *   - false → /business/waitlist (existing waitlist form)
 *
 * The rest of the page (hero, pricing, FAQ) is identical either way.
 * Waitlist mode is the fallback we can revert to instantly if the
 * checkout has to go dark (Auth.net outage, PCI incident, etc.).
 */
export default function BusinessPage() {
  const live = isLiveCheckout();

  return (
    <PartnerSignup
      checkoutUrl={live ? "/business/signup" : "/business/waitlist"}
      primaryCtaLabel={live ? "Sign up →" : "Get on the waitlist →"}
      pricingCtaLabel={live ? "Sign up →" : "Get on the waitlist →"}
      heroCtaSubtext={
        live
          ? "First 30 days free. Card on file required; no charges until day 31."
          : "First 30 days free when we launch. Card on file required at signup; no charges for 30 days."
      }
      pricingFootTag={live ? "Welcome offer" : "Welcome offer"}
      pricingFootBody={
        live ? (
          <>First 30 days free. Cancel anytime before day 31 and you won&apos;t be charged.</>
        ) : (
          <>
            First month free when we open in your city. We&apos;ll email you
            before launch to confirm your spot.
          </>
        )
      }
      footerDisclosure={
        live
          ? "Payments processed by Authorize.net. Card entry happens on our processor's secure page; Plus None never sees or stores your card number. By signing up you agree to our Partner Terms."
          : "By joining the waitlist you agree to receive launch updates by email. We won't charge you anything — payment + Partner Terms come when you confirm at launch."
      }
    />
  );
}
