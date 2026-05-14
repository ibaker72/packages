"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateOrderStatus } from "@/app/admin/actions";

const STATUSES = ["pending", "paid", "fulfilled", "cancelled", "refunded"] as const;

export function AdminOrderStatusSelect({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <select
      defaultValue={status}
      disabled={pending}
      onChange={(e) => {
        const next = e.target.value;
        start(async () => {
          await updateOrderStatus(id, next);
          router.refresh();
        });
      }}
      className="rounded-full border border-ink-200 bg-white px-3 py-1 text-xs"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
