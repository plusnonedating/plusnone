import Link from "next/link";
import CheckIcon from "./CheckIcon";
import Header from "./Header";
import DataSection from "./DataSection";

interface Props {
  /** Stripe Payment Link the primary CTA points to. */
  stripeUrl: string;
  /** Small uppercase tag in the pricing footer, e.g. "Founding partner" or "Welcome offer". */
  pricingFootTag: string;
  /** Pricing footer body — may include strong tags / coupon code chips. */
  pricingFootBody: React.ReactNode;
  /** Tiny disclosure line below the footer links. */
  footerDisclosure: string;
  /** Show the "Two ways in" subscription-vs-event comparison after the hero. Defaults to false. */
  showTwoWaysIn?: boolean;
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
  showTwoWaysIn = false,
}: Props) {
  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        {/* HERO — locked Change 5a */}
        <section className="bg-[#f4ede4] px-5 pt-6 pb-12 md:px-8 md:pt-16 md:pb-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              — For bars · restaurants · venues
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-7xl md:leading-tight">
              The best part of your business <em>isn&apos;t</em> on the menu.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-stone-800 md:mt-7 md:text-lg">
              We&apos;re sure the cocktails are great. But Plus None turns your
              business into a dating pool so the singles in the room can
              actually find each other. That&apos;s why they keep coming back.
            </p>
            <a
              href={stripeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block bg-black px-5 py-3 text-sm text-[#f4ede4] md:mt-8 md:px-6 md:py-4 md:text-base"
            >
              Become a Plus None Location →
            </a>
          </div>
        </section>

        {/* WHY THIS WORKS — locked Change 5c */}
        <section className="bg-[#f4ede4] px-5 py-10 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Why this works
            </p>
            <h2 className="mb-4 font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
              The businesses that last are the ones where people met.
            </h2>
            <p className="mb-10 text-base leading-relaxed text-stone-700 md:text-lg">
              Cocktails fade. Dinner gets forgotten. The person they met at
              your place shows up in their life for the next ten years. Plus
              None makes sure those people find each other.
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <div className="rounded-xl bg-[#ede4d5] p-5 md:p-6">
                <p className="font-serif text-3xl text-[#2647e8] md:text-4xl">
                  01
                </p>
                <h3 className="mt-3 font-serif text-xl leading-tight text-stone-900">
                  The room becomes findable.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  Plus None geo-gates to your business only. Singles inside
                  opt into a dating pool that&apos;s gone the moment they
                  leave. The people who want to meet someone get to. The rest
                  of the room is none the wiser.
                </p>
              </div>

              <div className="rounded-xl bg-[#ede4d5] p-5 md:p-6">
                <p className="font-serif text-3xl text-[#2647e8] md:text-4xl">
                  02
                </p>
                <h3 className="mt-3 font-serif text-xl leading-tight text-stone-900">
                  &ldquo;We met at your place.&rdquo;
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  Four words that drive return visits for decades. That get
                  said at weddings. That turn your business into a landmark
                  in someone&apos;s life.
                </p>
              </div>

              <div className="rounded-xl bg-[#ede4d5] p-5 md:p-6">
                <p className="font-serif text-3xl text-[#2647e8] md:text-4xl">
                  03
                </p>
                <h3 className="mt-3 font-serif text-xl leading-tight text-stone-900">
                  Featured to 1M+ singles.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  Plus None posts your business across @plusnonedating and
                  @TheVenueCEO — an audience of 1M+ already engaged with
                  going-out content. The exposure is built into your
                  subscription.
                </p>
              </div>
            </div>

            <div className="mt-10 border-l-2 border-[#2647e8] pl-5 md:mt-12 md:pl-6">
              <p className="font-serif text-2xl leading-tight text-stone-900 md:text-3xl">
                Build the place they tell stories about for the next decade.
              </p>
            </div>
          </div>
        </section>

        {showTwoWaysIn && (
          // TWO WAYS IN — locked Change 4a, copy reconciled to shipped rebrand
          // (Partner subscription → Business subscription; Pop-up event →
          // Event activation; prices align with Single Day / Multi-Day tiers).
          <section className="bg-[#f4ede4] px-5 py-10 md:px-8 md:py-20">
            <div className="mx-auto max-w-3xl">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
                Two ways in
              </p>
              <h2 className="mb-8 font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
                Recurring or one-night.
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-stone-300 bg-[#ede4d5] p-6 md:p-7">
                  <p className="text-xs uppercase tracking-[0.14em] text-stone-600">
                    Ongoing
                  </p>
                  <h3 className="mt-1 font-serif text-2xl leading-tight text-stone-900">
                    Business subscription
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-700">
                    $99/month. Your venue geo-gated, monthly data report,
                    featured to 1M+. First month free with code PLUSNONE.
                  </p>
                  <a
                    href="#pricing"
                    className="mt-4 inline-block bg-black px-4 py-2.5 text-sm text-[#f4ede4]"
                  >
                    Sign up →
                  </a>
                </div>

                <div className="rounded-xl border border-stone-300 bg-[#ede4d5] p-6 md:p-7">
                  <p className="text-xs uppercase tracking-[0.14em] text-stone-600">
                    One night
                  </p>
                  <h3 className="mt-1 font-serif text-2xl leading-tight text-stone-900">
                    Event activation
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-stone-700">
                    $499 single day or $799 multi-day. We bring signage,
                    social pull, and a post-event report. No monthly
                    commitment.
                  </p>
                  <Link
                    href="/events"
                    className="mt-4 inline-block border border-stone-900 px-4 py-2.5 text-sm text-stone-900"
                  >
                    See event details →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

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
