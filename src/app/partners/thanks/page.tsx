import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Welcome to Plus None",
};

export default function RegularThanksPage() {
  return (
    <ThanksPage
      heading="Welcome to Plus None"
      body={
        <>
          We&apos;ll set up your location within 48 hours. Signage ships in 5
          business days. Look for an email from plusnone@fetewell.com.
        </>
      }
    />
  );
}
