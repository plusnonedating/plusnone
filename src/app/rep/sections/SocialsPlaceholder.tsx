import Link from "next/link";

/**
 * Socials directory. Sydney has the account logins (per contract §8.4)
 * so she gets live follower counts, post performance, story insights,
 * and audience data straight from each platform's native analytics.
 * Nothing to duplicate here — this section just gets her to the right
 * dashboard in one click.
 */
export default function SocialsPlaceholder() {
  return (
    <section className="mb-10">
      <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#2647e8]">
        Socials
      </p>
      <h2 className="mb-4 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        @plusnonedating across platforms.
      </h2>
      <p className="mb-4 max-w-2xl text-sm leading-relaxed text-stone-700">
        Live metrics live inside each platform&apos;s native insights.
        You have the logins — pull follower counts, post performance,
        and audience data straight from the source.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <PlatformTile
          name="Instagram"
          handle="@plusnonedating"
          href="https://www.instagram.com/plusnonedating/"
        />
        <PlatformTile
          name="TikTok"
          handle="@plusnonedating"
          href="https://www.tiktok.com/@plusnonedating"
        />
        <PlatformTile
          name="Facebook"
          handle="Plus None"
          href="https://www.facebook.com/plusnonedating"
        />
      </div>
    </section>
  );
}

function PlatformTile({
  name,
  handle,
  href,
}: {
  name: string;
  handle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg border border-stone-300 bg-white p-4 transition-colors hover:border-stone-500"
    >
      <div className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
        {name}
      </div>
      <div className="mt-0.5 font-serif text-lg text-stone-900">{handle}</div>
      <div className="mt-3 text-xs text-stone-500">Open profile →</div>
    </Link>
  );
}
