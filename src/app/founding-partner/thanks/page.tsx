import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Welcome, founding partner · Plus None",
};

export default function FoundingThanksPage() {
  return (
    <ThanksPage
      heading="Welcome, founding partner"
      showPlaybookDownload
      body={
        <>
          We&apos;ll set up your location within 48 hours. Signage arrives
          within 10 business days of signup. You&apos;ll get an email
          confirmation. Look for it from plusnone@fetewell.com.
        </>
      }
    />
  );
}
