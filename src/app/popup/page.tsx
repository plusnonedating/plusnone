import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CheckIcon from "@/components/partners/CheckIcon";

export const metadata: Metadata = {
  title: "Plus None Pop-Up · Event activations",
  description:
    "One-night Plus None activations for conventions, weddings, festivals, and brand events. Geo-gated to your event, featured to a 1M+ audience.",
};

const STRIPE_URL_SINGLE = "https://buy.stripe.com/dRmcN74ZBfZF48hbcWcV202";
const STRIPE_URL_WEEKEND = "https://buy.stripe.com/cNidRb3Vx4gX0W5a8ScV201";

export default function PopupPage() {
  return (
    <div className="partner-page">
      <div className="page">
        {/* NAV */}
        <div className="nav">
          <div className="nav-left">
            <Image
              src="/plus-none-logo.png"
              alt="Plus None"
              width={144}
              height={144}
              className="nav-logo"
              priority
            />
            <div className="nav-divider" />
            <div className="nav-tag">Pop-Up</div>
          </div>
          <div className="nav-right">
            <a href="#pricing">Pricing</a>
            <a href="#faq">FAQ</a>
            <a className="btn-ghost" href="mailto:plusnone@fetewell.com">
              Book the team
            </a>
          </div>
        </div>

        {/* HERO */}
        <div className="hero">
          <div className="hero-row">
            <div>
              <div className="eyebrow">
                For conventions · weddings · activations · festivals
              </div>
              <h1 className="h1">
                Turn your event <span className="italic">into</span>
                <br />a dating pool.
              </h1>
              <p className="hero-body">
                For one night only. Add a Plus None Pop-Up to your event and
                give every single attendee a reason to scan, mingle, and post
                about it. The most-screenshotted moment of the night, by
                design.
              </p>
              <div className="hero-actions">
                <a
                  href={STRIPE_URL_SINGLE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Book your event →
                </a>
              </div>
            </div>
            <div className="hero-visual event">
              <div className="event-card">
                <div className="event-tag">POST-EVENT REPORT</div>
                <div className="event-name">The Singles Mixer · Vol. 4</div>
                <div className="event-meta">Brooklyn, NY · Saturday night</div>
                <div className="event-stats">
                  <div className="event-stat">
                    <div className="es-num">612</div>
                    <div className="es-label">Scans</div>
                  </div>
                  <div className="event-stat">
                    <div className="es-num">284</div>
                    <div className="es-label">Submissions</div>
                  </div>
                  <div className="event-stat">
                    <div className="es-num">84K</div>
                    <div className="es-label">Social Reach</div>
                  </div>
                  <div className="event-stat">
                    <div className="es-num">47%</div>
                    <div className="es-label">Repeat Visitors</div>
                  </div>
                </div>
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
              <div className="stat-num">14 days</div>
              <div className="stat-label">Minimum lead time to deploy</div>
            </div>
            <div>
              <div className="stat-num">Post-event</div>
              <div className="stat-label">Data report on your guests</div>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="section">
          <div className="section-head">
            <div className="section-eyebrow">How it works</div>
            <h2 className="section-h2">
              Three steps. Live the night of your event.
            </h2>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num">1.</div>
              <div className="step-title">Book your event date</div>
              <div className="step-desc">
                Tell us your event name, venue address, and event date. Minimum
                14 business days lead time. Payment via Stripe.
              </div>
            </div>
            <div className="step">
              <div className="step-num">2.</div>
              <div className="step-title">We set up your pop-up</div>
              <div className="step-desc">
                Geo-gating configured to your venue + event window. Custom
                event branding on your signage. Shipped to arrive 3 days
                before.
              </div>
            </div>
            <div className="step">
              <div className="step-num">3.</div>
              <div className="step-title">Run your event. Watch it explode.</div>
              <div className="step-desc">
                Plus None goes live the night of. We post your event to
                @plusnonedating before, during, and after for buzz.
              </div>
            </div>
          </div>
        </div>

        {/* WHAT'S INCLUDED */}
        <div className="section">
          <div className="section-head">
            <div className="section-eyebrow">What&apos;s included</div>
            <h2 className="section-h2">
              Everything you need for a memorable single night.
            </h2>
          </div>
          <div className="items">
            <Item
              title="Geo-gated to your event venue"
              desc="Only attendees actually at your event can join. Activated for the duration of your event. Auto-cleared after."
            />
            <Item
              title="Featured to a 1M+ audience"
              desc="Your event gets posted to @plusnonedating and @TheVenueCEO — before, during, and after — driving buzz and attendance."
            />
            <Item
              title="Event-branded signage"
              desc="Custom-printed table tents and bathroom-mirror stickers featuring your event name and brand. Shipped to arrive 3 days before."
            />
            <Item
              title="Post-event data report"
              desc="Scans, submissions, demographic mix, social reach, and engagement numbers — emailed within 5 days of your event."
            />
          </div>
        </div>

        {/* PRICING */}
        <div className="section" id="pricing">
          <div className="section-head">
            <div className="section-eyebrow">Pricing</div>
            <h2 className="section-h2">Pay per event. No subscriptions.</h2>
            <p className="section-sub">
              Pick the window that matches your event. Both tiers include the
              same deliverables — only the activation length differs.
            </p>
          </div>
          <div className="pricing-tiers">
            <div className="tier">
              <div className="tier-name">Single Night</div>
              <div className="tier-price">
                <span className="num">$499</span>
                <span className="per">/ event</span>
              </div>
              <div className="tier-note">
                Plus None active for one night, up to 12 hours.
              </div>
              <ul>
                <li>Geo-gated to your venue</li>
                <li>Custom event-branded signage</li>
                <li>Featured on @plusnonedating</li>
                <li>Post-event data report</li>
              </ul>
              <a
                href={STRIPE_URL_SINGLE}
                target="_blank"
                rel="noopener noreferrer"
                className="tier-btn"
                style={{ justifyContent: "center" }}
              >
                Book single night →
              </a>
            </div>
            <div className="tier featured">
              <div className="tier-badge">Most popular</div>
              <div className="tier-name">Weekend</div>
              <div className="tier-price">
                <span className="num">$799</span>
                <span className="per">/ event</span>
              </div>
              <div className="tier-note">
                Plus None active for up to 3 consecutive nights.
              </div>
              <ul>
                <li>Everything in Single Night</li>
                <li>Multi-night geo activation</li>
                <li>Pre- and mid-event social posts</li>
              </ul>
              <a
                href={STRIPE_URL_WEEKEND}
                target="_blank"
                rel="noopener noreferrer"
                className="tier-btn"
                style={{ justifyContent: "center" }}
              >
                Book weekend →
              </a>
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
              q="What's the minimum lead time?"
              a="14 business days from signup to event date. This covers geo configuration, custom signage design, printing, and shipping."
            />
            <Faq
              q="What types of events are this for?"
              a="Conferences and conventions, weddings, festivals, brand activations, pop-up bars, networking nights, charity events, hotel events — anywhere a critical mass of single attendees show up for a defined window."
            />
            <Faq
              q="Can we use our event branding on the signage?"
              a="Yes. Send us your logo and brand colors at signup. We'll integrate them with the Plus None brand on your table tents and stickers."
            />
            <Faq
              q="What if our event gets cancelled or rescheduled?"
              a="Reschedule for free up to 7 days before your event date. Cancellations within 7 days are non-refundable due to signage already being printed."
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="footer">
          Plus None LLC ·{" "}
          <a href="mailto:plusnone@fetewell.com">plusnone@fetewell.com</a> ·{" "}
          <Link href="/partner-terms">Partner Terms</Link> ·{" "}
          <Link href="/plus-none-terms">User Terms</Link> ·{" "}
          <Link href="/privacy-policy">Privacy</Link>
          <div className="footer-disclosure">
            Payments processed by Stripe. Pop-ups are one-time charges.
            Reschedule free up to 7 days before; cancel for full refund up to
            14 business days before. Cancellations inside 14 business days are
            non-refundable. By booking you agree to our Partner Terms.
          </div>
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
