import Link from "next/link";
// Brief spec'd `Instagram`; lucide-react v1.17 doesn't export that name,
// so using AtSign — closest semantic match for the "featured on socials" row.
import { AtSign, Heart, MapPin } from "lucide-react";
import CheckIcon from "./CheckIcon";
import Header from "./Header";
import DataSection from "./DataSection";
import { LiveFeedPreview } from "@/components/marketing/LiveFeedPreview";
import { StatStrip } from "@/components/marketing/StatStrip";
import { Statement } from "@/components/marketing/Statement";

interface Props {
  /** Stripe Payment Link the primary CTA points to. */
  stripeUrl: string;
  /** Small uppercase tag in the pricing footer, e.g. "Founding partner" or "Welcome offer". */
  pricingFootTag: string;
  /** Pricing footer body — may include strong tags / coupon code chips. */
  pricingFootBody: React.ReactNode;
  /** Tiny disclosure line below the footer links. */
  footerDisclosure: string;
}

/**
 * Shared signup landing layout used by both /founding-partner and /business
 * (standard monthly). Differences are passed via props — the
 * structure, copy, and CTAs are identical otherwise.
 */
export default function PartnerSignup({
  stripeUrl,
  pricingFootTag,
  pricingFootBody,
  footerDisclosure,
}: Props) {
  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        {/* HERO — locked Change 5a (revised lean brief) */}
        <section className="bg-[#f4ede4] px-5 pt-6 pb-10 md:px-8 md:pt-16 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              — For bars · restaurants · venues
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-7xl md:leading-tight">
              The best part of your business <em>isn&apos;t</em> on the menu.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-stone-700 md:mt-6 md:text-lg">
              Plus None turns the room into a dating pool. Singles in the room
              can find each other.
            </p>
            <a
              href={stripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-black px-5 py-3 text-sm text-[#f4ede4] md:mt-8 md:px-6 md:py-4 md:text-base"
            >
              Become a Plus None Location →
            </a>

            <div className="mt-10 flex justify-center md:mt-14">
              <LiveFeedPreview venueName="Citizens Ballroom" />
            </div>
          </div>
        </section>

        <StatStrip
          items={[
            { value: "1M+", label: "Social reach" },
            { value: "Yours", label: "Geo-gated" },
            { value: "Monthly", label: "Data report" },
          ]}
        />

        {/* WHY THIS WORKS — locked Change 5c (revised lean brief) */}
        <section className="bg-[#f4ede4] px-5 py-12 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
              The businesses that last are the ones where people met.
            </h2>

            <div className="space-y-5 md:space-y-6">
              <Statement
                icon={MapPin}
                title="Findable."
                body="Singles opt in. Geo-gated to your room."
              />
              <Statement
                icon={Heart}
                title={'"We met at your place."'}
                body="Said at weddings for decades."
              />
              <Statement
                icon={AtSign}
                title="Featured to 1M+."
                body="Monthly. Across IG and TikTok."
              />
            </div>

            <p className="mt-10 font-serif text-2xl italic leading-snug text-[#2647e8] md:mt-12 md:text-3xl">
              Build the place they tell stories about for the next decade.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <div className="section">
          <div className="section-head">
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-h2">Three steps. Live in under a week.</h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1.</div>
              <div className="step-title">Sign up &amp; submit your details</div>
              <div className="step-desc">
                Business address, shipping address, payment method. Two minutes
                via Stripe.
              </div>
            </div>
            <div className="step">
              <div className="step-num">2.</div>
              <div className="step-title">We set up your location</div>
              <div className="step-desc">
                Your venue is added to the geo-gated network within 48 hours.
                Printed signage ships in 5 business days.
              </div>
            </div>
            <div className="step">
              <div className="step-num">3.</div>
              <div className="step-title">
                Place signage. Watch scans roll in.
              </div>
              <div className="step-desc">
                Bathroom mirrors, bar tops, table tents. Monthly report lands
                in your inbox.
              </div>
            </div>
          </div>
        </div>

        {/* WHAT'S INCLUDED */}
        <div className="section">
          <div className="section-head">
            <div className="section-eyebrow">What&apos;s included</div>
            <h2 className="section-h2">
              Built to run itself, designed not to bug you.
            </h2>
          </div>
          <div className="items">
            <Item
              title="Geo-gated exclusively to your venue"
              desc="Only people physically at your business can join the pool. The business next door doesn't get your patrons. Period."
            />
            <Item
              title="Featured to a 1M+ audience"
              desc="Your venue gets posted on @plusnonedating and our founder's @TheVenueCEO account — a combined audience of 1M+ followers across Instagram and TikTok, actively engaged with going-out content."
            />
            <Item
              title="Printed signage, shipped to you"
              desc="Designed, printed, and delivered. Table tents and bathroom-mirror stickers, ready to place."
            />
            <Item
              title="Monthly data report"
              desc="Scans, submissions, unique visitors, and repeat visit rates — at your venue specifically. Delivered by email."
            />
          </div>
        </div>

        <DataSection />

        {/* PRICING */}
        <div className="section" id="pricing">
          <div className="section-head">
            <div className="section-eyebrow">Pricing</div>
            <h2 className="section-h2">One plan. No upsells.</h2>
          </div>
          <div className="pricing-card">
            <div className="pricing-body">
              <div>
                <div className="pricing-name">Plus None Business</div>
                <div className="pricing-row">
                  <span className="pricing-price">$99</span>
                  <span className="pricing-per">/ month</span>
                </div>
                <div className="pricing-note">
                  Billed monthly. Cancel anytime. No setup fees.
                </div>
              </div>
              <a
                href={stripeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Sign up →
              </a>
            </div>
            <div className="pricing-foot">
              <span className="pricing-foot-tag">{pricingFootTag}</span>
              <span>{pricingFootBody}</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="section" id="faq">
          <div className="section-head">
            <div className="section-eyebrow">FAQ</div>
            <h2 className="section-h2">Quick answers.</h2>
          </div>
          <div>
            <Faq
              q="What do you need from me at signup?"
              a="Business name and contact, the address you want geotagged (where guests will be scanning), a shipping address for signage if it's different, and payment via Stripe."
            />
            <Faq
              q="How long until I'm live?"
              a="Your location is configured manually within 48 hours of signup. Signage ships within 5 business days."
            />
            <Faq
              q="Can I cancel?"
              a="Anytime, via your account portal. Your venue is removed from the geo-gated network at the end of the billing cycle."
            />
            <Faq
              q="Do I have exclusivity in my area?"
              a="No. Plus None is open competition by design — more participating venues means more singles using the platform, which benefits every business."
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/partner-terms">Partner Terms</Link> ·{" "}
          <a href="https://fetewell.com/plus-none-terms">User Terms</a> ·{" "}
          <Link href="/privacy-policy">Privacy</Link>
          <div className="footer-disclosure">{footerDisclosure}</div>
        </div>
      </div>
    </div>
  );
}

function Item({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="item">
      <div className="check">
        <CheckIcon />
      </div>
      <div>
        <div className="item-title">{title}</div>
        <div className="item-desc">{desc}</div>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <div className="faq-item">
      <div className="faq-q">{q}</div>
      <div className="faq-a">{a}</div>
    </div>
  );
}
