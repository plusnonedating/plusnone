import type { Metadata } from "next";
import Link from "next/link";
import { requireRep } from "@/lib/rep-auth";
import { fetchSocialAssets, type SocialAsset } from "@/lib/rep-social-assets";
import RepShell from "../RepShell";
import CopyIceBreakerLink from "./CopyIceBreakerLink";
import MarkPostedControls from "./MarkPostedControls";

export const metadata: Metadata = {
  title: "Social assets · Plus None Rep",
  robots: { index: false, follow: false },
};

// Rebuild on demand — pretty cheap, and we want fresh data whenever
// Sydney opens the page.
export const dynamic = "force-dynamic";

export default async function SocialAssetsPage() {
  await requireRep();
  const assets = await fetchSocialAssets();
  const unposted = assets.filter(
    (a) => !(a.postedToIg && a.postedToTiktok),
  );
  const posted = assets.filter((a) => a.postedToIg && a.postedToTiktok);

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
        Content
      </p>
      <h1 className="mb-2 font-serif text-4xl leading-[1.05] tracking-tight text-stone-900 md:text-5xl">
        Social assets.
      </h1>
      <p className="mb-6 max-w-2xl text-base leading-relaxed text-stone-700">
        Daters who checked <em>OK to Post</em> on their submission. Only
        these are cleared for @plusnonedating and @TheVenueCEO — nobody
        else. When in doubt, don&apos;t post it.
      </p>

      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <p className="mb-1 font-medium">Rules for these photos (§9.7–9.10):</p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            Consent covers <strong>@plusnonedating and @TheVenueCEO only</strong>.
            Not your personal accounts (§7.8), not your portfolio (§7.9).
          </li>
          <li>
            <strong>No individual contact.</strong> Never DM, follow, or
            friend a dater whose photo you post (§9.9).
          </li>
          <li>
            <strong>Any doubt about consent = don&apos;t post.</strong>{" "}
            Get written approval from Plus None LLC first.
          </li>
        </ul>
      </div>

      <Group
        title={`Ready to post (${unposted.length})`}
        subtitle="Not yet on IG + TikTok. Priority queue."
        assets={unposted}
        emptyMsg="Nothing new to post. Check back after tonight's venue events."
      />

      {posted.length > 0 && (
        <Group
          title={`Archive (${posted.length})`}
          subtitle="Already posted to IG and TikTok. Kept for reference."
          assets={posted}
        />
      )}
    </RepShell>
  );
}

function Group({
  title,
  subtitle,
  assets,
  emptyMsg,
}: {
  title: string;
  subtitle: string;
  assets: SocialAsset[];
  emptyMsg?: string;
}) {
  return (
    <section className="mb-10">
      <h2 className="mb-1 font-serif text-2xl leading-tight tracking-tight text-stone-900 md:text-3xl">
        {title}
      </h2>
      <p className="mb-4 text-sm text-stone-600">{subtitle}</p>
      {assets.length === 0 && emptyMsg ? (
        <div className="rounded-lg border border-dashed border-stone-400 bg-white/40 p-6 text-center text-sm text-stone-600">
          {emptyMsg}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {assets.map((a) => (
            <AssetCard key={a.id} asset={a} />
          ))}
        </div>
      )}
    </section>
  );
}

function AssetCard({ asset }: { asset: SocialAsset }) {
  const meta = [
    asset.age ? String(asset.age) : "",
    asset.gender,
    asset.lookingFor && `looking for ${asset.lookingFor.toLowerCase()}`,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="overflow-hidden rounded-lg border border-stone-300 bg-white">
      <div className="relative aspect-square w-full bg-stone-100">
        {/* Airtable photo URLs are hot-linkable but not on our next/image
            allowlist, so use a plain <img>. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset.photoUrl}
          alt={`${asset.firstName || "Dater"} — Plus None submission`}
          className="h-full w-full object-cover"
        />
        <div className="absolute right-2 top-2 flex flex-col items-end gap-1">
          {asset.postedToIg && <StatusPill label="IG posted" tone="ok" />}
          {asset.postedToTiktok && (
            <StatusPill label="TikTok posted" tone="ok" />
          )}
          {asset.usedInEpisode && (
            <StatusPill
              label={`Ep ${asset.episodeNumber || "used"}`}
              tone="info"
            />
          )}
        </div>
      </div>
      <div className="p-3">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-medium text-stone-900">
            {asset.firstName || "—"}
          </span>
          {asset.handle && (
            <span className="text-xs text-stone-500">
              @{asset.handle.replace(/^@/, "")}
            </span>
          )}
        </div>
        {meta && <div className="mt-0.5 text-xs text-stone-600">{meta}</div>}
        {asset.venue && (
          <div className="mt-0.5 text-xs text-stone-500">
            {asset.venue}
            {asset.submittedAt && (
              <>
                {" · "}
                {formatDate(asset.submittedAt)}
              </>
            )}
          </div>
        )}
        {asset.iceBreaker && (
          <p className="mt-2 border-l-2 border-stone-200 pl-2 text-xs italic text-stone-700">
            &ldquo;{asset.iceBreaker}&rdquo;
          </p>
        )}
        {(asset.igPostUrl || asset.tiktokPostUrl) && (
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {asset.igPostUrl && (
              <a
                href={asset.igPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2647e8] underline underline-offset-2"
              >
                IG post ↗
              </a>
            )}
            {asset.tiktokPostUrl && (
              <a
                href={asset.tiktokPostUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2647e8] underline underline-offset-2"
              >
                TikTok post ↗
              </a>
            )}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={asset.photoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-stone-300 px-2 py-1 text-[11px] text-stone-700 hover:border-stone-500"
          >
            Open image ↗
          </a>
          {asset.iceBreaker && <CopyIceBreakerLink text={asset.iceBreaker} />}
        </div>
        {(!asset.postedToIg || !asset.postedToTiktok) && (
          <MarkPostedControls
            id={asset.id}
            postedToIg={asset.postedToIg}
            postedToTiktok={asset.postedToTiktok}
          />
        )}
      </div>
    </div>
  );
}

function StatusPill({
  label,
  tone,
}: {
  label: string;
  tone: "ok" | "info";
}) {
  const cls =
    tone === "ok"
      ? "bg-emerald-100 text-emerald-800"
      : "bg-[#2647e8]/10 text-[#2647e8]";
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${cls}`}
    >
      {label}
    </span>
  );
}

function formatDate(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Date(t).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
