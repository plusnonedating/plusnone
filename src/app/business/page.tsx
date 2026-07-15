import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "For business · Plus None",
  description:
    "Turn your business into a social pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

export default function BusinessPage() {
  return (
    <PartnerSignup
      checkoutUrl="/business/signup"
      primaryCtaLabel="Sign up →"
      pricingCtaLabel="Sign up →"
      heroCtaSubtext="First 30 days free. Card on file required; no charges until day 31. $99/mo + 6% MD sales tax = $104.94/mo starting day 31."
      pricingFootTag="Welcome offer"
      pricingFootBody={
        <>First 30 days free. Cancel anytime before day 31 and you won&apos;t be charged. $99 + 6% MD sales tax = $104.94/mo starting day 31.</>
      }
      footerDisclosure="Payments processed by Authorize.net. Card entry happens on our processor's secure page; Plus None never sees or stores your card number. By signing up you agree to our Partner Terms."
    />
  );
}
