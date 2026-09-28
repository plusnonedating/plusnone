import type { Metadata } from "next";
import Link from "next/link";
import { requireRep } from "@/lib/rep-auth";
import RepShell from "../../RepShell";

export const metadata: Metadata = {
  title: "Brand guidelines · Plus None Rep",
  robots: { index: false, follow: false },
};

export default async function BrandGuidelinesPage() {
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
        Brand guidelines.
      </h1>
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-stone-700">
        Everything you post as @plusnonedating, everything you send as
        plusnone@fetewell.com, everything you print with your Client
        onboarding — pass it through these first. Plus None LLC holds
        editorial authority (§7.6 of your contract); if something feels
        off-brand, ask before publishing.
      </p>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Swatch name="Cobalt" hex="#2647e8" role="Accent, links, buttons" light />
          <Swatch name="Cream" hex="#f4ede4" role="Ground" />
          <Swatch name="Ink" hex="#1c1c1c" role="Body text" light />
          <Swatch name="Stone" hex="#78716c" role="Muted text" />
        </div>
      </Section>

      <Section title="Typography">
        <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
          <li>
            <strong className="font-serif text-lg">Serif display</strong>{" "}
            (Instrument Serif) — headlines only. Never for body copy.
          </li>
          <li>
            <strong>Sans body</strong> (Inter) — everything else. Regular
            weight, comfortable line height.
          </li>
          <li>
            <strong className="uppercase tracking-widest text-xs text-[#2647e8]">
              Cobalt eyebrow
            </strong>{" "}
            — small caps, wide letter-spacing, above headlines to anchor a
            section.
          </li>
        </ul>
      </Section>

      <Section title="Voice">
        <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
          <li>
            <strong>Punchy.</strong> Short sentences. No jargon. No corporate
            hedging.
          </li>
          <li>
            <strong>Direct.</strong> Say what the thing is, not what it&apos;s
            &quot;like.&quot;
          </li>
          <li>
            <strong>Warm, not cheeky.</strong> We&apos;re romantic about
            meeting people IRL. We&apos;re not making dating-app jokes.
          </li>
          <li>
            <strong>Never talk down to daters or Clients.</strong> They&apos;re
            adults deciding whether to opt in.
          </li>
          <li>
            <strong>Sample lines that ARE us:</strong> &ldquo;The bar people
            meet at.&rdquo; · &ldquo;We met at your place — said at weddings
            for decades.&rdquo; · &ldquo;No app, no download, no messaging
            — just IRL connections.&rdquo;
          </li>
          <li>
            <strong>Sample lines that AREN&apos;T us:</strong> &ldquo;Swipe
            no more!&rdquo; · &ldquo;The Tinder killer.&rdquo; · anything
            that mocks online dating or daters.
          </li>
        </ul>
      </Section>

      <Section title="Content rules (contract §9.7–9.10)">
        <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
          <li>
            <strong>End-user photos, names, profiles are off-limits</strong>{" "}
            unless the individual has given documented opt-in consent for
            that specific use. When in doubt, get written approval from
            Plus None LLC. Silence is not consent.
          </li>
          <li>
            <strong>Never contact an end-user directly.</strong> Not DMs,
            not follows, not friend requests. Not for any reason.
          </li>
          <li>
            <strong>Client-facing reports have zero individual data</strong>{" "}
            — aggregate counts only. Nothing granular enough to identify a
            specific dater.
          </li>
          <li>
            <strong>No forecasts, guarantees, or invented Client results</strong>{" "}
            (§10.2). Only claims Plus None LLC has approved or that are
            supported by our own data.
          </li>
        </ul>
      </Section>

      <Section title="Do / Don't">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <List title="Do" items={[
            "Post daters ONLY after opt-in consent confirmed by Plus None LLC",
            "Lead pitches with the Client's problem, not with us",
            "Reply to comments within 24 hours",
            "Tag venues where daters submit from",
            "Use the ?rep=sydney tracking links every time",
          ]} />
          <List title="Don't" items={[
            "Post any end-user photo without confirmed opt-in",
            "Mention individual Client results without Plus None LLC's OK",
            "Use Plus None in your personal portfolio (§7.9)",
            "Publish anything to your own accounts (§7.8)",
            "Discount or offer free periods (§1.5) — pricing is set by Plus None LLC",
          ]} />
        </div>
      </Section>

      <Section title="Assets">
        <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-700">
          Right-click to save, or click to open in a new tab. All assets
          are Plus None LLC property (§8) — use them for Plus None
          content only.
        </p>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Asset
            href="/plus-none-logo.png"
            name="Wordmark"
            filename="plus-none-logo.png"
            note="PNG · square"
            imgSrc="/plus-none-logo.png"
            imgBg="#f4ede4"
          />
          <Asset
            href="/cat-cool.svg"
            name="Cool cat"
            filename="cat-cool.svg"
            note="SVG · line"
            imgSrc="/cat-cool.svg"
            imgBg="#f4ede4"
          />
          <Asset
            href="/cat-clueless.svg"
            name="Clueless cat"
            filename="cat-clueless.svg"
            note="SVG · line"
            imgSrc="/cat-clueless.svg"
            imgBg="#f4ede4"
          />
          <Asset
            href="/pattern-1.svg"
            name="Pattern"
            filename="pattern-1.svg"
            note="SVG · tile"
            imgSrc="/pattern-1.svg"
            imgBg="#2647e8"
          />
        </div>
      </Section>
    </RepShell>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Swatch({
  name,
  hex,
  role,
  light,
}: {
  name: string;
  hex: string;
  role: string;
  light?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div
        className="flex h-20 items-end px-3 pb-2"
        style={{ backgroundColor: hex }}
      >
        <span
          className={`font-mono text-xs ${light ? "text-white/90" : "text-stone-900/80"}`}
        >
          {hex}
        </span>
      </div>
      <div className="p-3">
        <div className="font-medium text-stone-900">{name}</div>
        <div className="text-xs text-stone-500">{role}</div>
      </div>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-stone-300 bg-white p-4">
      <div className="mb-2 font-medium text-stone-900">{title}</div>
      <ul className="space-y-1 text-sm text-stone-700">
        {items.map((i, ix) => (
          <li key={ix}>· {i}</li>
        ))}
      </ul>
    </div>
  );
}

function Asset({
  href,
  name,
  filename,
  note,
  imgSrc,
  imgBg,
}: {
  href: string;
  name: string;
  filename: string;
  note: string;
  imgSrc: string;
  imgBg: string;
}) {
  return (
    <a
      href={href}
      download={filename}
      className="group block overflow-hidden rounded-lg border border-stone-300 bg-white transition-colors hover:border-stone-500"
    >
      <div
        className="flex h-32 items-center justify-center p-4"
        style={{ backgroundColor: imgBg }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={name}
          className="max-h-full max-w-full object-contain"
        />
      </div>
      <div className="p-3">
        <div className="text-sm font-medium text-stone-900">{name}</div>
        <div className="text-[11px] text-stone-500">{note}</div>
        <div className="mt-1 text-[11px] text-[#2647e8] group-hover:underline">
          Download →
        </div>
      </div>
    </a>
  );
}
