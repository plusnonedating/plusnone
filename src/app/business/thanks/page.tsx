import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Welcome to Plus None",
};

export default function BusinessThanksPage() {
  return (
    <ThanksPage
      heading="Welcome to Plus None"
      showPlaybookDownload
      body={
        <>
          We&apos;ll set up your location within 48 hours. Signage arrives
          within 10 business days of signup. Look for an email from
          plusnone@fetewell.com.
        </>
      }
    />
  );
}
