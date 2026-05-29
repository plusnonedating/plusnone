import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Welcome, founding partner · Plus None",
};

export default function FoundingThanksPage() {
  return (
    <ThanksPage
      heading="Welcome, founding partner"
      body={
        <>
          We&apos;ll set up your location within 48 hours. Signage ships in 5
          business days. You&apos;ll get an email confirmation. Look for it
          from plusnone@fetewell.com.
        </>
      }
    />
  );
}
