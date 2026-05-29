import type { Metadata } from "next";
import LegalPage from "@/components/partners/LegalPage";

export const metadata: Metadata = {
  title: "Partner Terms · Plus None",
  description:
    "Partner Terms & Conditions for Plus None subscriptions and pop-up event bookings.",
};

export default function PartnerTermsPage() {
  return <LegalPage contentFile="partner-terms.md" navTag="Partner Terms" />;
}
