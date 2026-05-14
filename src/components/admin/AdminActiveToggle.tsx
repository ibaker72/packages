"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProductActive } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function AdminActiveToggle({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <button
      disabled={pending}
      onClick={() => start(async () => { await toggleProductActive(id, !active); router.refresh(); })}
      className={cn(
        "h-5 w-9 rounded-full relative transition",
        active ? "bg-emerald-500" : "bg-ink-200",
      )}
      aria-label="toggle active"
    >
      <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white transition", active ? "left-4" : "left-0.5")} />
    </button>
  );
}
