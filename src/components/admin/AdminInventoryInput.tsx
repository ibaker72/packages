"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProductInventory } from "@/app/admin/actions";

export function AdminInventoryInput({ id, value }: { id: string; value: number }) {
  const [v, setV] = useState(value);
  const [pending, start] = useTransition();
  const router = useRouter();
  return (
    <input
      type="number"
      value={v}
      disabled={pending}
      onChange={(e) => setV(parseInt(e.target.value) || 0)}
      onBlur={() => {
        if (v !== value) start(async () => { await updateProductInventory(id, v); router.refresh(); });
      }}
      className="w-20 rounded-lg border border-ink-200 bg-white px-2 py-1 text-sm"
    />
  );
}
