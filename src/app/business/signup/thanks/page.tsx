import type { Metadata } from "next";
import ThanksPage from "@/components/partners/ThanksPage";

export const metadata: Metadata = {
  title: "You're in · Plus None",
  robots: { index: false, follow: false },
};

/**
 * /business/signup/thanks — final confirmation after Auth.net's
 * hosted CIM form + our callback route successfully create the ARB
 * subscription with an immediate first charge.
 *
 * Airtable automation (Kate's setup, not our code) fires on the row
 * transition to "Active" and sends the customer email + the
 * plusnone@fetewell.com admin notification.
 */
export default function BusinessSignupThanksPage() {
  return (
    <ThanksPage
      heading="Welcome to Plus None."
      showPlaybookDownload
      body={
        <>
          You&apos;re all set. Your card was charged $210.94 today
          ($199 base + 6% MD sales tax), and every month from now on.
          Cancel anytime.
          <br />
          <br />
          We&apos;ll email you within 48 hours with your digital brand
          kit — your unique QR code plus Plus None-branded templates
          for stickers, table tents, and flyers — and confirm your
          geo-config is live.
        </>
      }
    />
  );
}
