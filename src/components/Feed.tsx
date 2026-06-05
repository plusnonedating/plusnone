"use client";

import type { Submission } from "@/lib/types";
import ProfileCard from "./ProfileCard";

interface Props {
  submissions: Submission[];
}

/**
 * The vertical stack of profile cards inside the venue feed.
 *
 * Used to track which card had audio playing (one-at-a-time mute
 * arbitration when these were videos). Now that submissions are
 * static photos there's nothing for the wrapper to coordinate — it's
 * just a map.
 */
export default function Feed({ submissions }: Props) {
  return (
    <div className="flex-1 px-4 py-2">
      <div className="max-w-md mx-auto space-y-6">
        {submissions.map((submission) => (
          <ProfileCard key={submission.id} submission={submission} />
        ))}
      </div>
    </div>
  );
}
