import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  body?: string;
}

/**
 * Statement — used in the lean "Why this works" section and the
 * customer-mechanic explainer on /business and /events. Small
 * cobalt-tinted icon circle on the left, serif title + (optional)
 * sans body on the right. No card chrome.
 *
 * When `body` is omitted, the icon and title vertically center so the
 * row reads as a clean inline pair instead of an icon awkwardly floating
 * above a one-liner.
 *
 * Spec: section 5e of plus-none-brand-pass.md (revised lean rewrite).
 */
export function Statement({ icon: Icon, title, body }: Props) {
  return (
    <div
      className={`flex gap-3 md:gap-4 ${
        body ? "items-start" : "items-center"
      }`}
    >
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#ede4d5] md:h-10 md:w-10">
        <Icon className="h-4 w-4 text-[#2647e8] md:h-5 md:w-5" />
      </div>
      <div>
        <p className="font-serif text-lg font-medium leading-tight text-stone-900 md:text-xl">
          {title}
        </p>
        {body && (
          <p className="mt-0.5 text-sm leading-relaxed text-stone-700 md:text-base">
            {body}
          </p>
        )}
      </div>
    </div>
  );
}
