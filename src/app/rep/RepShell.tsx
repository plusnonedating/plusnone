import type { ReactNode } from "react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

/**
 * Branded shell for every authenticated /rep page. Cream ground,
 * cobalt accents, matches the marketing site so Sydney feels like
 * she's inside Plus None, not a generic admin panel.
 */
export default function RepShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f4ede4] text-stone-900">
      <header className="border-b border-stone-300/70 bg-[#f4ede4]/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/rep" className="flex items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Plus None
            </span>
            <span className="text-xs uppercase tracking-[0.14em] text-stone-500">
              / Rep portal
            </span>
          </Link>
          <div className="flex items-center gap-4 text-xs text-stone-600">
            <Link
              href="https://airtable.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden underline underline-offset-2 hover:text-stone-900 md:inline"
            >
              Airtable →
            </Link>
            <Link
              href="mailto:kate@fetewell.com"
              className="hidden underline underline-offset-2 hover:text-stone-900 md:inline"
            >
              Kate ↗
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-10 md:px-8 md:py-14">
        {children}
      </main>
    </div>
  );
}
