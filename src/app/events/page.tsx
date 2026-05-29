import type { Metadata } from "next";
import Link from "next/link";
import CheckIcon from "@/components/partners/CheckIcon";
import Header from "@/components/partners/Header";
import PopupDataSection from "@/components/partners/PopupDataSection";

export const metadata: Metadata = {
  title: "Plus None Events · Event activations",
  description:
    "One-night Plus None activations for conventions, weddings, festivals, and brand events. Geo-gated to your event, featured to a 1M+ audience.",
};

const STRIPE_URL_SINGLE = "https://buy.stripe.com/dRmcN74ZBfZF48hbcWcV202";
const STRIPE_URL_WEEKEND = "https://buy.stripe.com/cNidRb3Vx4gX0W5a8ScV201";

export default function EventsPage() {
  return (
    <div className="partner-page">
      <div className="page">
        <Header />

        {/* HERO — locked Change 5b */}
        <section className="bg-[#f4ede4] px-5 pt-6 pb-12 md:px-8 md:pt-16 md:pb-28">
          <div className="mx-auto max-w-3xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              — For festivals · conferences · conventions · faires
            </p>
            <h1 className="font-serif text-[40px] leading-[0.95] tracking-tight text-stone-900 md:text-7xl md:leading-tight">
              The best part of your event <em>isn&apos;t</em> on the schedule.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-stone-800 md:mt-7 md:text-lg">
              We&apos;re sure the schedule&apos;s great. But Plus None turns
              your event into a dating pool so the singles in the room can
              actually find each other. That&apos;s why they come back next
              year.
            </p>
            <a
              href="#book"
              className="mt-6 inline-block bg-black px-5 py-3 text-sm text-[#f4ede4] md:mt-8 md:px-6 md:py-4 md:text-base"
            >
              Add Plus None to your event →
            </a>
          </div>
        </section>

        {/* WHY THIS WORKS — locked Change 5d */}
        <section className="bg-[#f4ede4] px-5 py-10 md:px-8 md:py-20">
          <div className="mx-auto max-w-3xl">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#2647e8]">
              Why this works
            </p>
            <h2 className="mb-4 font-serif text-3xl leading-[1.02] tracking-tight text-stone-900 md:text-5xl">
              The events that last are the ones where you made friends.
            </h2>
            <p className="mb-10 text-base leading-relaxed text-stone-700 md:text-lg">
              Headliners fade. Speakers get forgotten. The person they met in
              the dating pool shows up in their life for the next ten years.
              Plus None makes sure those people find each other.
            </p>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
              <div className="rounded-xl bg-[#ede4d5] p-5 md:p-6">
                <p className="font-serif text-3xl text-[#2647e8] md:text-4xl">
                  01
                </p>
                <h3 className="mt-3 font-serif text-xl leading-tight text-stone-900">
                  Make the singles findable.
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  Plus None gives attendees a way to opt into the room&apos;s
                  dating pool. Geo-gated to your event, gone when it ends.
                  The people who want to meet someone can — without rolling
                  the dice on every conversation.
                </p>
              </div>

              <div className="rounded-xl bg-[#ede4d5] p-5 md:p-6">
                <p className="font-serif text-3xl text-[#2647e8] md:text-4xl">
                  02
                </p>
                <h3 className="mt-3 font-serif text-xl leading-tight text-stone-900">
                  &ldquo;I met my person there.&rdquo;
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  The sentence that gets said at weddings. That ends up in
                  the New York Times. That turns your event into a tradition
                  someone built their life around.
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
                  Plus None posts your event across @plusnonedating and
                  @TheVenueCEO — an audience of 1M+ already engaged with
                  going-out content. The exposure is built into the booking.
                </p>
              </div>
            </div>

            <div className="mt-10 border-l-2 border-[#2647e8] pl-5 md:mt-12 md:pl-6">
              <p className="font-serif text-2xl leading-tight text-stone-900 md:text-3xl">
                Build the event they tell stories about for the next decade.
              </p>
            </div>
          </div>
        </section>

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
              <div className="step-title">We set up your event</div>
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

        <PopupDataSection />

        {/* PRICING */}
        <span id="book" />
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
              <div className="tier-name">Event Activation — Single Day</div>
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
                Sign up →
              </a>
            </div>
            <div className="tier featured">
              <div className="tier-badge">Most popular</div>
              <div className="tier-name">Event Activation — Multi-Day</div>
              <div className="tier-price">
                <span className="num">$799</span>
                <span className="per">/ event</span>
              </div>
              <div className="tier-note">
                Plus None active for up to 3 consecutive nights.
              </div>
              <ul>
                <li>Everything in Single Day</li>
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
                Sign up →
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
          <a href="https://fetewell.com/plus-none-terms">User Terms</a> ·{" "}
          <Link href="/privacy-policy">Privacy</Link>
          <div className="footer-disclosure">
            Payments processed by Stripe. Events are one-time charges.
            Reschedule free up to 7 days before; cancel for full refund up to
            14 business days before. Cancellations inside 14 business days are
            non-refundable. By signing up you agree to our Partner Terms.
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
