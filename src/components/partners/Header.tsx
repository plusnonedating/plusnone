"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Shared header used across /founding-partner, /partner, and /popup.
 * Bigger-logo-left, pathname-aware nav-right: Subscription / Pop-up
 * tabs underline the current page, with a Contact button trailing.
 *
 * Client component because it reads the current pathname to compute
 * active-tab state. Lives outside the namespaced `.partner-page` CSS
 * so it composes cleanly with the rest of each signup page.
 *
 * Bigger-logo sizing is intentional: the source PNG is cropped tight
 * to the wordmark (no transparent padding), so h-28 / md:h-36 makes
 * the visible wordmark properly dominant on the left.
 */
export default function Header() {
  const pathname = usePathname();
  const isSubscription =
    pathname?.startsWith("/partner") ||
    pathname?.startsWith("/founding-partner");
  const isPopup = pathname?.startsWith("/popup");

  return (
    <header className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-5 md:px-8 md:py-7">
        <div className="flex items-start justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="Plus None home">
            <Image
              src="/plus-none-logo.png"
              alt="Plus None"
              width={296}
              height={280}
              priority
              className="h-28 w-auto md:h-36"
            />
          </Link>

          <div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:gap-6">
            <nav className="flex items-center gap-4 text-xs md:gap-5 md:text-sm">
              <Link
                href="/partner"
                className={`pb-0.5 ${
                  isSubscription
                    ? "border-b border-stone-900 font-medium text-stone-900"
                    : "text-stone-600"
                }`}
              >
                Subscription
              </Link>
              <Link
                href="/popup"
                className={`pb-0.5 ${
                  isPopup
                    ? "border-b border-stone-900 font-medium text-stone-900"
                    : "text-stone-600"
                }`}
              >
                Pop-up
              </Link>
            </nav>
            <a
              href="mailto:plusnone@fetewell.com"
              className="rounded-sm border border-black px-3 py-1 text-[11px] md:px-4 md:py-2 md:text-sm"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
