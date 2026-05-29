import fs from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";

export const metadata: Metadata = {
  title: "Partner Terms · Plus None",
  description:
    "Partner Terms & Conditions for Plus None subscriptions and pop-up event bookings.",
};

async function loadTerms(): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    "src",
    "content",
    "partner-terms.md",
  );
  return await fs.readFile(filePath, "utf8");
}

export default async function PartnerTermsPage() {
  const terms = await loadTerms();

  return (
    <div className="partner-page terms">
      {/* Compact nav so users can find their way back to the signup pages */}
      <div className="page">
        <div className="nav">
          <div className="nav-left">
            <Link href="/partners">
              <Image
                src="/plus-none-logo.png"
                alt="Plus None"
                width={144}
                height={144}
                className="nav-logo"
                priority
              />
            </Link>
            <div className="nav-divider" />
            <div className="nav-tag">Partner Terms</div>
          </div>
          <div className="nav-right">
            <Link href="/partners">Partners</Link>
            <Link href="/popup">Pop-Up</Link>
            <a
              className="btn-ghost"
              href="mailto:plusnone@fetewell.com"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="container">
          <ReactMarkdown>{terms}</ReactMarkdown>
        </div>

        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/plus-none-terms">User Terms</Link> ·{" "}
          <Link href="/privacy-policy">Privacy</Link>
        </div>
      </div>
    </div>
  );
}
