import Link from "next/link";

/**
 * Playbook — links to the standing resources Sydney uses to work.
 * Cold pitch templates already exist; brand guidelines are a live
 * page in this dashboard; client best-practices PDF is what Clients
 * download after they pay, and Sydney trains them on it.
 */
export default function PlaybookLinks() {
  return (
    <section className="mb-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Playbook
      </p>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        Everything you need to sell + service.
      </h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Card
          href="/rep/playbook/cold-pitches"
          title="Cold pitch templates"
          body="Bar/venue + events, both stripped of my running-a-company voice and written to feel like a lead-with-their-problem cold email. Copy, paste, personalize."
        />
        <Card
          href="/rep/playbook/brand"
          title="Brand guidelines"
          body="Colors, type, voice, do's and don'ts. Reference this before you publish anything to the accounts."
        />
        <Card
          href="/plus-none-playbook.pdf"
          title="Client best-practices PDF"
          body="What Clients download after signup. You'll walk them through it during onboarding. Print it before your first training call."
          external
        />
        <Card
          href="mailto:kate@fetewell.com"
          title="Stuck? Ping Kate."
          body="kate@fetewell.com. She'll get back within a business day."
          external
        />
      </div>
    </section>
  );
}

function Card({
  href,
  title,
  body,
  external,
}: {
  href: string;
  title: string;
  body: string;
  external?: boolean;
}) {
  const props = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <Link
      href={href}
      {...props}
      className="block rounded-lg border border-stone-300 bg-white p-4 transition-colors hover:border-stone-500"
    >
      <div className="font-medium text-stone-900">{title} →</div>
      <p className="mt-1 text-sm leading-relaxed text-stone-600">{body}</p>
    </Link>
  );
}
