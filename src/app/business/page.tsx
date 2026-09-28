import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "For business · Plus None",
  description:
    "Turn your business into a social pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

interface Props {
  searchParams: Promise<{ rep?: string }>;
}

export default async function BusinessPage({ searchParams }: Props) {
  const { rep } = await searchParams;
  // Forward the ?rep= attribution through to the signup CTA so the
  // downstream Airtable row gets tagged correctly.
  const checkoutUrl = rep
    ? `/business/signup?rep=${encodeURIComponent(rep)}`
    : "/business/signup";
  return (
    <PartnerSignup
      checkoutUrl={checkoutUrl}
      primaryCtaLabel="Sign up →"
      pricingCtaLabel="Sign up →"
      heroCtaSubtext="$199/mo + 6% MD sales tax ($210.94/mo). Billed monthly. Cancel anytime."
      pricingFootTag="What you get"
      pricingFootBody={
        <>A digital kit — your unique QR code plus Plus None-branded print templates. Print your own stickers, table tents, and flyers, at whatever size and quantity fits your venue.</>
      }
      footerDisclosure="Payments processed by Authorize.net. Card entry happens on our processor's secure page; Plus None never sees or stores your card number. By signing up you agree to our Partner Terms."
    />
  );
}
