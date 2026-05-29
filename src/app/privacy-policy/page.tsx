import type { Metadata } from "next";
import LegalPage from "@/components/partners/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy · Plus None",
  description:
    "How Plus None collects, uses, and protects information about you.",
};

export default function PrivacyPolicyPage() {
  return <LegalPage contentFile="privacy-policy.md" navTag="Privacy" />;
}
