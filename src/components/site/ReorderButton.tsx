"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";

type Item = {
  id: string;
  product_id?: string | null;
  name_snapshot: string;
  quantity: number;
  unit_price_cents?: number;
};

export function ReorderButton({ items }: { items: Item[] }) {
  const add = useCart((s) => s.add);
  const router = useRouter();

  function reorder() {
    items.forEach((it) => {
      if (!it.product_id) return;
      add({
        product_id: it.product_id,
        slug: "",
        name: it.name_snapshot,
        unit_price_cents: it.unit_price_cents ?? 0,
        quantity: it.quantity,
      });
    });
    router.push("/cart");
  }

  return <button onClick={reorder} className="btn-primary">Reorder these items</button>;
}
