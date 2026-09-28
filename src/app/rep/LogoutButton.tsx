"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/rep/logout", { method: "POST" });
        router.push("/rep/login");
        router.refresh();
      }}
      className="text-xs text-stone-600 underline underline-offset-2 hover:text-stone-900 disabled:opacity-50"
    >
      Sign out
    </button>
  );
}
