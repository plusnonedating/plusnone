import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "Become a partner · Plus None",
  description:
    "Turn your business into a dating pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

const STRIPE_URL = "https://buy.stripe.com/6oUeVf9fR6p5gV30yicV203";

export default function RegularPartnerPage() {
  return (
    <PartnerSignup
      stripeUrl={STRIPE_URL}
      pricingFootTag="Welcome offer"
      pricingFootBody={
        <>
          First month free with code{" "}
          <strong className="coupon-code">PLUSNONE</strong> at checkout. Card
          on file, no charges for 30 days, auto-renews unless you cancel.
        </>
      }
      footerDisclosure="Payments processed by Stripe. First month free with code PLUSNONE; renews at $99/month unless cancelled before billing date. By signing up you agree to our Partner Terms."
    />
  );
}
