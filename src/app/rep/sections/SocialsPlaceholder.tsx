/**
 * Placeholder social metrics tiles. Live API integration (Meta
 * Business Graph for IG + FB, TikTok Business API) takes days of
 * app-review approvals to set up — for now Sydney logs numbers
 * manually in a Google Sheet Kate keeps.
 *
 * When ready to hook up: pass PAGE_ACCESS_TOKEN + IG_BUSINESS_ID +
 * TT_BUSINESS_ID as env vars and swap this component for live queries.
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
        Live metrics are coming — we need to get through Meta&apos;s and
        TikTok&apos;s Business API reviews first. For now, log weekly
        numbers in the shared sheet (link from Kate) and this section will
        light up once the tokens are in.
      </p>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <PlatformTile name="Instagram" handle="@plusnonedating" />
        <PlatformTile name="TikTok" handle="@plusnonedating" />
        <PlatformTile name="Facebook" handle="Plus None" />
      </div>
    </section>
  );
}

function PlatformTile({ name, handle }: { name: string; handle: string }) {
  return (
    <div className="rounded-lg border border-stone-300 bg-white p-4">
      <div className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
        {name}
      </div>
      <div className="mt-0.5 font-serif text-lg text-stone-900">{handle}</div>
      <div className="mt-3 text-xs text-stone-400">Metrics coming soon</div>
    </div>
  );
}
