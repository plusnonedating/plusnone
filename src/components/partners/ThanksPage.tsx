import Image from "next/image";
import Link from "next/link";

interface Props {
  heading: string;
  body: React.ReactNode;
  /**
   * When true, renders a dark "Download the Plus None Playbook" CTA
   * between the heading and the body. The button links to
   * /plus-none-playbook.pdf with the `download` attribute.
   */
  showPlaybookDownload?: boolean;
}

/**
 * Shared layout for the three post-checkout confirmation pages
 * (/founding-partner/thanks, /business/thanks, /events/thanks).
 * Logo, heading, optional playbook download CTA, body paragraph,
 * link back to the consumer landing.
 */
export default function ThanksPage({
  heading,
  body,
  showPlaybookDownload = false,
}: Props) {
  return (
    <div className="partner-page thanks">
      <div className="container">
        <div className="logo-wrap">
          <Image
            src="/plus-none-logo.png"
            alt="Plus None"
            width={330}
            height={330}
            priority
            style={{ width: 165, height: "auto", display: "block" }}
          />
        </div>
        <h1>{heading}</h1>
        <p>{body}</p>
        {showPlaybookDownload && (
          <a
            href="/plus-none-playbook.pdf"
            download
            className="mt-6 mb-4 inline-block bg-black px-5 py-3 text-sm text-[#f4ede4] md:px-6 md:py-4 md:text-base"
          >
            Download the Plus None Playbook →
          </a>
        )}
        <Link className="back-link" href="/">
          plusnone.fetewell.com →
        </Link>
      </div>
    </div>
  );
}
