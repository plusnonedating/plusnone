"use client";

import { useCallback, useEffect, useState } from "react";
import type { Submission } from "@/lib/types";
import ProfileCard from "./ProfileCard";

interface Props {
  submissions: Submission[];
}

export default function Feed({ submissions }: Props) {
  const [audibleId, setAudibleId] = useState<string | null>(null);

  useEffect(() => {
    if (audibleId && !submissions.some((s) => s.id === audibleId)) {
      setAudibleId(null);
    }
  }, [submissions, audibleId]);

  const handleRequestAudible = useCallback((id: string) => {
    setAudibleId(id);
  }, []);

  const handleLeftView = useCallback((id: string) => {
    setAudibleId((current) => (current === id ? null : current));
  }, []);

  return (
    <div className="flex-1 px-4 py-2">
      <div className="max-w-md mx-auto space-y-6">
        {submissions.map((submission) => (
          <ProfileCard
            key={submission.id}
            submission={submission}
            isAudible={audibleId === submission.id}
            onRequestAudible={() => handleRequestAudible(submission.id)}
            onLeftView={() => handleLeftView(submission.id)}
          />
        ))}
      </div>
    </div>
  );
}
