import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "Founding partner · Plus None",
  description:
    "Turn your business into a social pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

const CHECKOUT_URL =
  "https://plusnone.lemonsqueezy.com/checkout/buy/e94e1fbc-cf42-46f4-9af0-b4764d7adfcb?discount=0";

export default function FoundingPartnerPage() {
  return (
    <PartnerSignup
      checkoutUrl={CHECKOUT_URL}
      heroCtaSubtext="First year free. Cancel anytime."
      pricingFootTag="Founding partner"
      pricingFootBody="First year free for our first five partners. Card on file, no charges for 365 days, auto-renews unless you cancel."
      footerDisclosure="Payments processed by Lemon Squeezy. Founding partner offer: card on file, no charges for 365 days, auto-renews at $99/month unless cancelled. By signing up you agree to our Partner Terms."
    />
  );
}
