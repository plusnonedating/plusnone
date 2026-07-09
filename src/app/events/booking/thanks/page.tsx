import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "Event booked · Plus None",
  robots: { index: false, follow: false },
};

/**
 * /events/booking/thanks — final confirmation after successful
 * one-time charge. Airtable automation on the row transition to
 * "Booked" fires the customer + admin emails.
 */
export default function EventsBookingThanksPage() {
  return (
    <ThanksPage
      heading="Your event is booked."
      showPlaybookDownload
      body={
        <>
          Payment is confirmed. We&apos;ll email you within 48 hours to
          finalize signage design and schedule geo-config for your venue.
          <br />
          <br />
          <strong>Reschedule / cancellation:</strong> free reschedule
          anytime up to 7 days before your event. Within 7 days,
          non-refundable per Partner Terms.
        </>
      }
    />
  );
}
