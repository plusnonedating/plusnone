import Image from "next/image";
import Link from "next/link";

interface Props {
  heading: string;
  body: React.ReactNode;
}

/**
 * Shared layout for the three post-Stripe confirmation pages
 * (/founding-partner/thanks, /partner/thanks, /popup/thanks).
 * Logo, heading, body paragraph, link back to the consumer landing.
 */
export default function ThanksPage({ heading, body }: Props) {
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
        <Link className="back-link" href="/">
          plusnone.fetewell.com →
        </Link>
      </div>
    </div>
  );
}
