"use client";

import Link from "next/link";
import { useCart, cartCount, cartSubtotalCents } from "@/lib/cart";
import { formatCents } from "@/lib/utils";

export function StickyCartBar() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const count = cartCount(lines);
  if (!hydrated || count === 0) return null;
  return (
    <div className="md:hidden fixed bottom-3 inset-x-3 z-50">
      <Link
        href="/cart"
        className="flex items-center justify-between gap-3 rounded-2xl bg-ink-900 text-white px-4 py-3 shadow-soft"
      >
        <span className="text-sm">{count} in cart</span>
        <span className="text-sm font-semibold">
          {formatCents(cartSubtotalCents(lines))} · View cart →
        </span>
      </Link>
    </div>
  );
}
