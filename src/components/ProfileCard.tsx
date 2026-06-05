import type { Submission } from "@/lib/types";

interface Props {
  submission: Submission;
}

/**
 * Single profile card on a venue feed.
 *
 * Renders a static portrait selfie photo on top, name + age + opt-in
 * fields below. The selfie is a live photo captured via WPForms'
 * Camera widget — no library uploads, no video.
 *
 * No audio, no playback state, no IntersectionObserver — those went
 * away when we switched the submission flow from a selfie video to a
 * live selfie photo.
 */
export default function ProfileCard({ submission }: Props) {
  return (
    <article className="w-full max-w-md mx-auto rounded-2xl overflow-hidden bg-ink shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={submission.photoUrl}
        alt={submission.firstName}
        className="block w-full aspect-[9/16] object-cover bg-ink"
        loading="lazy"
        decoding="async"
      />
      <div className="bg-cream text-ink px-4 py-4">
        <div className="flex items-baseline gap-2">
          <h2 className="font-display text-3xl tracking-wide leading-none">
            {submission.firstName}
          </h2>
          <span className="font-display text-3xl tracking-wide leading-none text-cobalt">
            {submission.age}
          </span>
        </div>
        <dl className="mt-3 space-y-1.5 text-sm">
          <Row label="Gender" value={submission.gender} />
          {submission.interestedIn ? (
            <Row label="Interested in" value={submission.interestedIn} />
          ) : null}
          {submission.lookingFor ? (
            <Row label="Looking for" value={submission.lookingFor} />
          ) : null}
          {submission.pitch ? (
            <Row label="Ask me about" value={submission.pitch} />
          ) : null}
        </dl>
      </div>
    </article>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted uppercase tracking-wider text-[11px] font-semibold w-24 shrink-0 pt-0.5">
        {label}
      </dt>
      <dd className="text-ink">{value}</dd>
    </div>
  );
}
