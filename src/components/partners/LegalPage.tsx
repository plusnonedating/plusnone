import fs from "node:fs/promises";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Props {
  /** Filename under src/content/ — e.g. "partner-terms.md" or "privacy-policy.md". */
  contentFile: string;
  /** Short label that appears in the nav next to the logo — "Partner Terms" or "Privacy". */
  navTag: string;
}

/**
 * Shared layout for the legal text pages (/partner-terms, /privacy-policy).
 * Renders the markdown from src/content/{contentFile} via react-markdown,
 * scoped under .partner-page.terms for the clean-text styling.
 *
 * Logo (~80px) at top-left links back to /. Compact footer with the same
 * link set as the partner pages plus a disclosure line.
 */
export default async function LegalPage({ contentFile, navTag }: Props) {
  const md = await fs.readFile(
    path.join(process.cwd(), "src", "content", contentFile),
    "utf8",
  );

  return (
    <div className="partner-page terms">
      <div className="page">
        <div className="nav">
          <div className="nav-left">
            <Link href="/" aria-label="Plus None home">
              <Image
                src="/plus-none-logo.png"
                alt="Plus None"
                width={160}
                height={160}
                priority
                style={{ width: 80, height: "auto", display: "block" }}
              />
            </Link>
            <div className="nav-divider" />
            <div className="nav-tag">{navTag}</div>
          </div>
          <div className="nav-right">
            <a className="btn-ghost" href="mailto:plusnone@fetewell.com">
              Contact
            </a>
          </div>
        </div>

        <div className="container">
          <ReactMarkdown>{md}</ReactMarkdown>
        </div>

        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/partner-terms">Partner Terms</Link> ·{" "}
          <a href="https://fetewell.com/plus-none-terms">User Terms</a> ·{" "}
          <Link href="/privacy-policy">Privacy</Link>
          <div className="footer-disclosure">
            Plus None LLC, registered in Maryland. Payments processed by
            Stripe.
          </div>
        </div>
      </div>
    </div>
  );
}
