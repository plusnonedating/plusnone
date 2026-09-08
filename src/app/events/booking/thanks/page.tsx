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
          Payment is confirmed. We&apos;ll email you within 48 hours
          with your event brand kit — QR code + Plus None-branded
          templates for stickers, table tents, and flyers — and
          confirm your geo-config schedule for the event.
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
