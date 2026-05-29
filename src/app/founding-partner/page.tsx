import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "Founding partner · Plus None",
  description:
    "Turn your business into a dating pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

const STRIPE_URL = "https://buy.stripe.com/3cI3cxcs3cNt8ox0yicV200";

export default function FoundingPartnerPage() {
  return (
    <PartnerSignup
      stripeUrl={STRIPE_URL}
      pricingFootTag="Founding partner"
      pricingFootBody="First year free for our first five partners. Card on file, no charges for 365 days, auto-renews unless you cancel."
      footerDisclosure="Payments processed by Stripe. Founding partner offer: card on file, no charges for 365 days, auto-renews at $99/month unless cancelled. By signing up you agree to our Partner Terms."
    />
  );
}
