import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Event booked · Plus None",
};

export default function EventsThanksPage() {
  return (
    <ThanksPage
      heading="Event booked"
      showPlaybookDownload
      body={
        <>
          To kick off design and set up your geo-gate, send your event
          date(s), event location address, event logo, and any signage notes
          to{" "}
          <a href="mailto:plusnone@fetewell.com?subject=Event%20signage%20assets">
            plusnone@fetewell.com
          </a>
          . We&apos;ll have proofs in your inbox shortly after your assets
          land.
        </>
      }
    />
  );
}
