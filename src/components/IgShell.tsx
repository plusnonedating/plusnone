"use client";

import { lock } from "@/lib/storage";
import GateGuard from "./GateGuard";

export default function IgShell() {
  return (
    <GateGuard slug="ig">
      <IgThankYou />
    </GateGuard>
  );
}

function IgThankYou() {
  const handleClearAccess = () => {
    lock("ig");
    window.location.href = "/";
  };

  return (
    <>
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <p className="font-display text-5xl sm:text-6xl tracking-wide text-ink leading-none">
          you&apos;re in
        </p>
        <p className="mt-5 max-w-sm text-base text-muted leading-relaxed">
          follow{" "}
          <a
            href="https://instagram.com/plusnonedating"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-cobalt hover:text-cobalt-hover underline decoration-dotted"
          >
            @plusnonedating
          </a>{" "}
          — we&apos;ll post your video soon. someone out there might shoot their shot. 💋
        </p>
      </section>
      <div className="pb-8 pt-4 text-center">
        <button
          type="button"
          onClick={handleClearAccess}
          className="text-xs text-muted underline decoration-dotted hover:text-cobalt"
        >
          submitted by mistake? clear your access
        </button>
      </div>
    </>
  );
}
