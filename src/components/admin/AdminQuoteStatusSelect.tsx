"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateQuoteStatus } from "@/app/admin/actions";

const STATUSES = ["new", "contacted", "quoted", "won", "lost"] as const;

export function AdminQuoteStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        start(async () => {
          await updateQuoteStatus(id, next);
          router.refresh();
        });
      }}
      className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
