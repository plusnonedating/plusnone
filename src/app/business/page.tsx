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
      heroCtaSubtext="$199/mo, billed monthly. Cancel anytime. Maryland venues also pay 6% MD sales tax."
      pricingFootTag="What you get"
      pricingFootBody={
        <>A digital kit — your unique QR code plus Plus None-branded print templates. Print your own stickers, table tents, and flyers, at whatever size and quantity fits your venue.</>
      }
      footerDisclosure="Payments processed by Authorize.net. Card entry happens on our processor's secure page; Plus None never sees or stores your card number. By signing up you agree to our Partner Terms."
    />
  );
}
