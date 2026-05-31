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
          Send your venue address to{" "}
          <a href="mailto:plusnone@fetewell.com?subject=Plus%20None%20venue%20setup">
            plusnone@fetewell.com
          </a>{" "}
          so we can set up your geo-gate. Signage arrives within 10 business
          days of signup. Your first 30 days are on us.
        </>
      }
    />
  );
}
