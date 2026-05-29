import Image from "next/image";
import Link from "next/link";

type Context = "partners" | "popup" | "founder";

const CONTEXT_LABEL: Record<Context, string> = {
  partners: "For partners",
  popup: "Pop-up events",
  founder: "Founding partner",
};

interface Props {
  context: Context;
}

/**
 * Shared header used across /founding-partner, /partner, and /popup.
 * Big-logo-left, stacked-nav-right layout — context tag + (Pricing/FAQ on
 * desktop) + Contact button stack vertically on mobile, sit inline on
 * desktop (≥ md). Anchored to the brand cream and the existing brand
 * cobalt; not wrapped in `.partner-page`, so it composes cleanly with the
 * namespaced CSS used by the rest of each signup page.
 */
export default function Header({ context }: Props) {
  return (
    <header className="bg-cream">
      <div className="mx-auto max-w-6xl px-5 py-5 md:px-8 md:py-7">
        <div className="flex items-start justify-between gap-4">
          <Link href="/" className="shrink-0" aria-label="Plus None home">
            <Image
              src="/plus-none-logo.png"
              alt="Plus None"
              width={240}
              height={96}
              priority
              className="h-16 w-auto md:h-20"
            />
          </Link>

          <div className="flex flex-col items-end gap-2 md:flex-row md:items-center md:gap-6">
            <span className="text-[11px] uppercase tracking-wide text-stone-600 md:border-l md:border-stone-400 md:pl-4">
              {CONTEXT_LABEL[context]}
            </span>
            <nav className="hidden gap-5 text-sm md:flex">
              <a href="#pricing">Pricing</a>
              <a href="#faq">FAQ</a>
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
