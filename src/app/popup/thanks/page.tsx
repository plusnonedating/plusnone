import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Event booked · Plus None",
};

export default function PopupThanksPage() {
  return (
    <ThanksPage
      heading="Event booked"
      body={
        <>
          We&apos;ll be in touch within 24 hours with signage proofs. See you
          at your event.
        </>
      }
    />
  );
}
