import Link from "next/link";
import CheckIcon from "./CheckIcon";
import Header from "./Header";

interface Props {
  /** Which signup context the header tag should reflect. */
  context: "partners" | "founder";
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
 * Shared signup landing layout used by both /founding-partner and /partner
 * (standard monthly). Differences are passed via props — the
 * structure, copy, and CTAs are identical otherwise.
 */
export default function PartnerSignup({
  context,
  stripeUrl,
  pricingFootTag,
  pricingFootBody,
  footerDisclosure,
}: Props) {
  return (
    <div className="partner-page">
      <div className="page">
        <Header context={context} />

        {/* HERO */}
        <div className="hero">
          <div className="hero-row">
            <div>
              <div className="eyebrow">For bars · restaurants · venues</div>
              <h1 className="h1">
                Turn your business <span className="italic">into</span>
                <br />a dating pool.
              </h1>
              <p className="hero-body">
                Singles already come to your bar. Plus None gives them a reason
                to scan, stick around, and come back — and gives you the data
                to prove it. Featured on our socials. Geo-gated to your room
                only. Reported on monthly.
              </p>
              <div className="hero-actions">
                <a
                  href={stripeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Become a partner →
                </a>
              </div>
            </div>
            <div className="hero-visual">
              <div className="hv-phone">
                <div className="hv-phone-h">Who&apos;s single here?</div>
                <div className="hv-phone-v">CITIZENS BALLROOM</div>
                {[
                  ["Sam, 28", "Ask me about my dog"],
                  ["Jay, 31", "Ask me about Berlin"],
                  ["Rae, 26", "Ask me about hot sauce"],
                  ["Mo, 33", "Ask me about karaoke"],
                ].map(([name, ask]) => (
                  <div key={name} className="hv-profile">
                    <div className="hv-pic" />
                    <div className="hv-info">
                      <div className="hv-name">{name}</div>
                      <div className="hv-ask">{ask}</div>
                    </div>
                    <div className="hv-dot">↗</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TRUST */}
        <div className="trust">
          <div className="trust-label">Highlights</div>
          <div className="trust-stats">
            <div>
              <div className="stat-num">1M+</div>
              <div className="stat-label">
                Social reach across IG &amp; TikTok
              </div>
            </div>
            <div>
              <div className="stat-num">Yours</div>
              <div className="stat-label">Geo-gated to your venue only</div>
            </div>
            <div>
              <div className="stat-num">Monthly</div>
              <div className="stat-label">Data report on your venue</div>
            </div>
          </div>
        </div>

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

        {/* THE DATA */}
        <div className="section">
          <div className="section-head">
            <div className="section-eyebrow">The data</div>
            <h2 className="section-h2">
              Real intelligence on who walks through your door.
            </h2>
            <p className="section-sub">
              No bar has visibility into who its single patrons are, how often
              they come back, or what nights actually drive new traffic. Plus
              None gives you that.
            </p>
          </div>

          <div className="data-grid">
            <div>
              <div className="data-col-eyebrow">You&apos;ll see</div>
              <ul className="data-list">
                <li>
                  <strong>Demographic mix</strong> — age and gender breakdown
                  of who scanned at your venue
                </li>
                <li>
                  <strong>Peak hours and nights</strong> — when single patrons
                  actually show up
                </li>
                <li>
                  <strong>Repeat visit rate</strong> — how many of your
                  scanners come back within 30 / 60 / 90 days
                </li>
                <li>
                  <strong>Social pull</strong> — submissions that converted to
                  follows on @plusnonedating and tagged your venue
                </li>
                <li>
                  <strong>Benchmark</strong> — how your venue compares to
                  similar Plus None bars (anonymized)
                </li>
              </ul>
            </div>
            <div>
              <div className="data-col-eyebrow">So you can</div>
              <ul className="data-list">
                <li>
                  <strong>Staff the right nights.</strong> Stop over-staffing
                  slow ones. Stop drowning on the busy ones.
                </li>
                <li>
                  <strong>Run promotions where they&apos;ll land.</strong>{" "}
                  Tuesday slow? Now you know what kind of singles are missing —
                  target them.
                </li>
                <li>
                  <strong>Prove your bar&apos;s story to brands.</strong> Sell
                  sponsorship and partnership deals with real demographic data,
                  not guesses.
                </li>
                <li>
                  <strong>Justify rent. Justify expansion.</strong> When your
                  landlord or your investor asks &ldquo;is this place
                  working?&rdquo; — show them.
                </li>
                <li>
                  <strong>Become the singles bar of your city.</strong>{" "}
                  Repeat-visit data is the proof. Use it in your own marketing.
                </li>
              </ul>
            </div>
          </div>

          <div className="data-callout">
            <div>
              <div className="data-callout-eyebrow">Why this matters</div>
              <div className="data-callout-text">
                Most bars rely on &ldquo;vibes&rdquo; to make staffing,
                programming, and marketing decisions. Plus None partners get
                monthly numbers nobody else in their market has.
              </div>
            </div>
          </div>
        </div>

        {/* PRICING */}
        <div className="section" id="pricing">
          <div className="section-head">
            <div className="section-eyebrow">Pricing</div>
            <h2 className="section-h2">One plan. No upsells.</h2>
          </div>
          <div className="pricing-card">
            <div className="pricing-body">
              <div>
                <div className="pricing-name">Plus None Partner</div>
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
                Become a partner →
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
              a="No. Plus None is open competition by design — more participating venues means more singles using the platform, which benefits every partner."
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
