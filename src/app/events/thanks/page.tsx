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
          To set up your geo-gate and prep your event brand kit, send
          your event date(s), event location address, event logo, and
          any branding notes to{" "}
          <a href="mailto:plusnone@fetewell.com?subject=Event%20brand%20kit%20assets">
            plusnone@fetewell.com
          </a>
          . We&apos;ll have your ready-to-print kit in your inbox
          shortly after your assets land.
        </>
      }
    />
  );
}
