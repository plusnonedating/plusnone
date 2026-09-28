"use client";

/**
 * One-click "email this to the client" button. Opens the rep's
 * default mail client via mailto: with a pre-filled draft that
 * mirrors what's on the report page above. Sydney can hit Send as-is
 * or tweak first — either way, no copy-paste dance.
 *
 * We use mailto: rather than server-side sending because:
 *   - No SES/Resend key needed for a one-rep workflow.
 *   - The mail goes from Sydney's actual account, so replies land in
 *     her inbox (and Bcc'ing plusnone@ is her decision).
 *   - Sydney's brain-check on tone/wording happens before send.
 *
 * The report URL is generated on the client (current page location)
 * so the recipient's link matches whatever host this page loaded
 * from — production, preview, or local dev.
 */
export default function SendToClientButton({
  clientEmail,
  contactName,
  businessName,
  reportMonth,
  headlineMetrics,
  senderName,
  senderEmail,
}: {
  clientEmail: string;
  contactName: string;
  businessName: string;
  reportMonth: string;
  headlineMetrics: { label: string; value: string }[];
  senderName: string;
  senderEmail: string;
}) {
  const disabled = !clientEmail;

  const firstName = (contactName || "there").trim().split(/\s+/)[0] ?? "there";
  const subject = `Your Plus None report — ${reportMonth}`;

  const onClick = () => {
    if (disabled) return;
    const reportUrl =
      typeof window !== "undefined" ? window.location.href : "";
    const metricLines = headlineMetrics
      .map((m) => `  • ${m.label}: ${m.value}`)
      .join("\n");
    const body = [
      `Hi ${firstName},`,
      ``,
      `Here's your ${reportMonth} Plus None report for ${businessName || "your venue"}.`,
      ``,
      `Headline numbers:`,
      metricLines,
      ``,
      `Full report (demographics, peak nights, social pull, and what to do with it):`,
      reportUrl,
      ``,
      `Reply here if you want a specific data pull or want to talk through what these mean for staffing and promos.`,
      ``,
      `— ${senderName}`,
      `Plus None · ${senderEmail}`,
    ].join("\n");
    const href = `mailto:${encodeURIComponent(clientEmail)}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={
        disabled
          ? "No email on file for this Client — add one in Airtable before sending."
          : `Send this report to ${clientEmail}`
      }
      className="rounded bg-[#2647e8] px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      Send to client
    </button>
  );
}
