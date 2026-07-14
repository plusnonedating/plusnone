"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  /** URL to POST the token to (accept.authorize.net/customer/addPayment or /payment/payment). */
  formUrl: string;
  /** Short-lived Auth.net hosted-page token. */
  token: string;
  /** Called when the customer completes card entry / payment. */
  onSuccess: () => void;
  /** Called when the customer hits Cancel inside the iframe. */
  onCancel?: () => void;
}

/**
 * Embed Auth.net's hosted card entry / payment form as an iframe
 * inside our own page. This keeps the URL bar on plusnone.fetewell.com
 * throughout the transaction — the user never sees a domain flip.
 *
 * PCI: the card fields are served by accept.authorize.net inside the
 * iframe. Nothing about the card touches our page or JS. Still SAQ A.
 *
 * The iframe navigates itself to `/checkout-comm` on transaction end,
 * which postMessages back here. We handle three actions:
 *   - successfulSave / transactResponse → onSuccess()
 *   - cancel → onCancel()
 *   - resizeWindow → grow the iframe to match its own content height
 */
export function CheckoutIframe({ formUrl, token, onSuccess, onCancel }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [height, setHeight] = useState(720);

  useEffect(() => {
    formRef.current?.submit();
  }, []);

  useEffect(() => {
    function handler(e: MessageEvent) {
      // Ignore messages from anywhere but our own origin — the
      // /checkout-comm page (same origin as parent) is the only
      // legitimate sender in this flow.
      if (e.origin !== window.location.origin) return;
      let data: Record<string, string>;
      try {
        data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      const action = data.action;
      if (action === "successfulSave" || action === "transactResponse") {
        onSuccess();
      } else if (action === "cancel") {
        onCancel?.();
      } else if (action === "resizeWindow") {
        const h = Number(data.height);
        if (Number.isFinite(h) && h > 200) {
          setHeight(Math.min(h + 40, 1400));
        }
      }
    }
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onSuccess, onCancel]);

  return (
    <div>
      {/* Hidden auto-submitting form; POSTs the token into the named iframe */}
      <form
        ref={formRef}
        method="POST"
        action={formUrl}
        target="authnet-checkout"
        style={{ display: "none" }}
      >
        <input type="hidden" name="token" value={token} />
      </form>
      <iframe
        name="authnet-checkout"
        title="Secure card entry"
        style={{
          width: "100%",
          height: `${height}px`,
          border: "none",
          background: "white",
        }}
      />
    </div>
  );
}
