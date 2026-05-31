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
          Send your venue address to{" "}
          <a href="mailto:plusnone@fetewell.com?subject=Plus%20None%20venue%20setup">
            plusnone@fetewell.com
          </a>{" "}
          so we can set up your geo-gate. Signage arrives within 10 business
          days of signup. Your founding-partner year is on us — billing starts
          on day 366.
        </>
      }
    />
  );
}
