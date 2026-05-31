import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "For business · Plus None",
  description:
    "Turn your business into a dating pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

const CHECKOUT_URL =
  "https://plusnone.lemonsqueezy.com/checkout/buy/3d2daf8e-4bc4-47d6-90cc-7fab51225517?discount=0";

export default function BusinessPage() {
  return (
    <PartnerSignup
      checkoutUrl={CHECKOUT_URL}
      heroCtaSubtext="First 30 days free. Cancel anytime."
      pricingFootTag="Welcome offer"
      pricingFootBody={
        <>
          First month free. Card on file, no charges for 30 days, auto-renews
          unless you cancel.
        </>
      }
      footerDisclosure="Payments processed by Lemon Squeezy. First month free; renews at $99/month unless cancelled before billing date. By signing up you agree to our Partner Terms."
    />
  );
}
