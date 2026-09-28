import type { Metadata } from "next";
import Link from "next/link";
import { requireRep } from "@/lib/rep-auth";
import RepShell from "../../RepShell";
import PitchTemplate from "./PitchTemplate";

export const metadata: Metadata = {
  title: "Cold pitch templates · Plus None Rep",
  robots: { index: false, follow: false },
};

const BAR_PITCH = {
  subject: "The bar people meet at",
  body: `Hey [First name] —

The bars that last aren't the ones with the best cocktails — they're the ones people meet at. Twenty years of "we met at [Bar Name]" said at weddings is worth more than any marketing budget.

That reputation used to build itself. Now singles are heads-down on phones, don't know who else at the bar is single, and don't approach strangers cold.

Plus None fixes that. A QR code at [Bar Name] geo-gates a dating pool to your patrons only. They scan, see who else in the room is single, meet up IRL. No app, no download. Clears overnight.

Printed table tents + mirror stickers — you'll get a downloadable brand kit to print your own — featured on our IG (1M+ audience), and a monthly report on demographic mix, repeat visits, and peak nights — the kind of data big chains pay thousands a month for.

plusnone.fetewell.com/business?rep=sydney for details, or hit reply and I'll show you what [Bar Name] would look like.

— Sydney
Plus None`,
};

const EVENT_PITCH = {
  subject: "The story people tell after [Event Name]",
  body: `Hey [First name] —

The best story your attendees tell about [Event Name] years from now won't be about the lineup — it'll be the one that starts "I actually met my person there."

That story doesn't happen by accident anymore. Singles at events keep their heads down, don't know who else is around, don't approach strangers cold.

Plus None fixes that. A QR code at your event geo-gates a dating pool to attendees only. They scan, see who else is single in the room, meet up IRL. No app, no download. When the event ends, the pool clears.

Custom event-branded downloadable kit shipped digitally within 48 hours. Featured on our IG pre/mid/post-event (1M+ audience). Post-event report on scans, demographics, and social reach — the kind of data you can put in front of sponsors when you're pitching them for next year.

14 business days lead time. plusnone.fetewell.com/events?rep=sydney for details, or hit reply and I'll show you what a [Event Name] setup would look like.

— Sydney
Plus None`,
};

export default async function ColdPitchesPage() {
  await requireRep();
  return (
    <RepShell>
      <div className="mb-6">
        <Link
          href="/rep"
          className="text-xs uppercase tracking-wider text-stone-500 underline underline-offset-2"
        >
          ← Back to dashboard
        </Link>
      </div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Playbook
      </p>
      <h1 className="mb-4 font-serif text-4xl leading-[1.05] tracking-tight text-stone-900 md:text-5xl">
        Cold pitch templates.
      </h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-stone-700">
        Both templates lead with the reader&apos;s problem, not with you.
        Swap in <code className="rounded bg-stone-200 px-1 text-xs">[First name]</code>{" "}
        and <code className="rounded bg-stone-200 px-1 text-xs">[Bar Name]</code>{" "}
        or <code className="rounded bg-stone-200 px-1 text-xs">[Event Name]</code>{" "}
        before sending. Send from your Plus None email
        (plusnone@fetewell.com), not a noreply.
      </p>

      <PitchTemplate
        kind="Business"
        subject={BAR_PITCH.subject}
        body={BAR_PITCH.body}
      />

      <PitchTemplate
        kind="Events"
        subject={EVENT_PITCH.subject}
        body={EVENT_PITCH.body}
      />

      <section className="mt-10 rounded-lg border border-stone-300 bg-white/60 p-5">
        <h2 className="mb-2 font-serif text-lg text-stone-900">
          Best practices
        </h2>
        <ul className="space-y-1.5 text-sm leading-relaxed text-stone-700">
          <li>
            <strong>Tuesday–Thursday, 10 a.m. local to the recipient</strong>{" "}
            are the highest-response send windows. Not Friday (they&apos;re
            prepping for the weekend).
          </li>
          <li>
            <strong>Follow up once after 5 business days</strong> if no
            reply. Bump the same thread with one line:{" "}
            <em>&ldquo;Bumping in case this got buried.&rdquo;</em>
          </li>
          <li>
            <strong>Do the name research</strong> — &ldquo;Hi there&rdquo;
            reads as spam. First name every time.
          </li>
          <li>
            <strong>Never attach a deck.</strong> The link is the deck.
          </li>
          <li>
            <strong>Send from your Plus None email,</strong> not a personal
            or noreply address. Kate&apos;s setting you up with{" "}
            plusnone@fetewell.com access — use it.
          </li>
          <li>
            <strong>Timing matters double for events</strong> — pitch at
            least 3 weeks before the event so they have room to hit the
            14-business-day cutoff.
          </li>
        </ul>
      </section>
    </RepShell>
  );
}
