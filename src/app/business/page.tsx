import type { Metadata } from "next";
import PartnerSignup from "@/components/partners/PartnerSignup";

export const metadata: Metadata = {
  title: "For business · Plus None",
  description:
    "Turn your business into a social pool. Plus None is geo-gated to your venue, featured to a 1M+ audience, and reports on your bar monthly.",
};

// Waitlist mode — payment processor still pending. CTAs route to
// the waitlist form which writes to the Airtable "Waitlist" table.
// Replace with a Buy Link once we have a processor.
const WAITLIST_URL = "/business/waitlist";

export default function BusinessPage() {
  return (
    <PartnerSignup
      checkoutUrl={WAITLIST_URL}
      primaryCtaLabel="Get on the waitlist →"
      pricingCtaLabel="Get on the waitlist →"
      heroCtaSubtext="First 30 days free when we launch. Card on file required at signup; no charges for 30 days."
      pricingFootTag="Welcome offer"
      pricingFootBody={
        <>
          First month free when we open in your city. We&apos;ll email you
          before launch to confirm your spot.
        </>
      }
      footerDisclosure="By joining the waitlist you agree to receive launch updates by email. We won't charge you anything — payment + Partner Terms come when you confirm at launch."
    />
  );
}
