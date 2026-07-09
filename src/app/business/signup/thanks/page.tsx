import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "You're in · Plus None",
  robots: { index: false, follow: false },
};

/**
 * /business/signup/thanks — final confirmation after Auth.net's
 * hosted CIM form + our callback route successfully create the ARB
 * subscription with a 30-day trial start date.
 *
 * Airtable automation (Kate's setup, not our code) fires on the row
 * transition to "Active — Trial" and sends the customer email + the
 * plusnone@fetewell.com admin notification.
 */
export default function BusinessSignupThanksPage() {
  return (
    <ThanksPage
      heading="Welcome to Plus None."
      showPlaybookDownload
      body={
        <>
          You&apos;re all set. Your card is on file, but we won&apos;t
          charge you for the first 30 days — day 31 is when the $99
          monthly billing kicks in, and you can cancel anytime before
          then.
          <br />
          <br />
          We&apos;ll email you within 48 hours to schedule signage
          delivery and geo-config for your venue.
        </>
      }
    />
  );
}
