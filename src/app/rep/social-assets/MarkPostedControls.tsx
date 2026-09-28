"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Per-card controls for marking a Submissions row as posted to IG or
 * TikTok. Optionally prompts for the post URL so the archive keeps
 * clickable links. Refreshes the page on success so the card jumps
 * to the archive (or gains its "Posted" pill).
 *
 * Kept in a separate client file so the /rep/social-assets page can
 * stay a server component and keep doing its Airtable read at render
 * time.
 */
export default function MarkPostedControls({
  id,
  postedToIg,
  postedToTiktok,
}: {
  id: string;
  postedToIg: boolean;
  postedToTiktok: boolean;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<null | "ig" | "tiktok">(null);
  const [error, setError] = useState<string | null>(null);

  const mark = async (platform: "ig" | "tiktok") => {
    setError(null);
    // Ask (once) for the post URL — optional, they can hit Cancel and
    // still flag the checkbox without a link.
    let url: string | null = null;
    if (typeof window !== "undefined") {
      url = window.prompt(
        `Paste the ${platform === "ig" ? "IG" : "TikTok"} post URL (optional — click OK with the box empty to skip):`,
        "",
      );
      // window.prompt returns null on Cancel — treat as "user backed
      // out entirely" and abort so we don't accidentally mark posted.
      if (url === null) return;
    }
    setSaving(platform);
    try {
      const payload: Record<string, unknown> =
        platform === "ig"
          ? { postedToIg: true }
          : { postedToTiktok: true };
      if (url && url.trim().length > 0) {
        payload[platform === "ig" ? "igPostUrl" : "tiktokPostUrl"] = url.trim();
      }
      const res = await fetch(
        `/api/rep/submissions/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        throw new Error(data.error ?? "Couldn't save.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {!postedToIg && (
        <button
          type="button"
          onClick={() => mark("ig")}
          disabled={saving !== null}
          className="rounded border border-stone-300 px-2 py-1 text-[11px] text-stone-700 hover:border-stone-500 disabled:opacity-50"
        >
          {saving === "ig" ? "Saving…" : "Mark IG posted"}
        </button>
      )}
      {!postedToTiktok && (
        <button
          type="button"
          onClick={() => mark("tiktok")}
          disabled={saving !== null}
          className="rounded border border-stone-300 px-2 py-1 text-[11px] text-stone-700 hover:border-stone-500 disabled:opacity-50"
        >
          {saving === "tiktok" ? "Saving…" : "Mark TikTok posted"}
        </button>
      )}
      {error && (
        <span className="text-[11px] text-red-700">{error}</span>
      )}
    </div>
  );
}
