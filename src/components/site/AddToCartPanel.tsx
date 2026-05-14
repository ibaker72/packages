"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useCart } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { formatCents } from "@/lib/utils";
import { SUBSCRIPTION_DISCOUNT } from "@/lib/constants";

export function AddToCartPanel({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [subscribe, setSubscribe] = useState(false);
  const [added, setAdded] = useState(false);
  const add = useCart((s) => s.add);

  const eligible = product.is_subscription_eligible;
  const subPrice = Math.round(product.price_cents * (1 - SUBSCRIPTION_DISCOUNT));
  const oos = product.inventory_count === 0;

  function onAdd() {
    add({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      unit_price_cents: product.price_cents,
      quantity: qty,
      image: product.images?.[0],
      is_subscription_eligible: eligible,
      subscribe: eligible && subscribe,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="mt-6 surface p-5 space-y-4">
      {eligible && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={subscribe}
            onChange={(e) => setSubscribe(e.target.checked)}
            className="mt-1 h-4 w-4 accent-amber-600"
          />
          <span>
            <span className="font-medium">Subscribe & save 10%</span>
            <span className="block text-sm text-ink-500">
              {formatCents(subPrice)} per pack · pause or cancel anytime
            </span>
          </span>
        </label>
      )}

      <div className="flex items-center gap-3">
        <div className="inline-flex items-center rounded-full border border-ink-200 bg-white">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="h-10 w-10 grid place-items-center text-ink-600 hover:bg-ink-50 rounded-l-full"
            aria-label="decrease"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            value={qty}
            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
            inputMode="numeric"
            className="w-12 text-center bg-transparent outline-none text-sm font-medium"
          />
          <button
            type="button"
            onClick={() => setQty((q) => q + 1)}
            className="h-10 w-10 grid place-items-center text-ink-600 hover:bg-ink-50 rounded-r-full"
            aria-label="increase"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          disabled={oos}
          onClick={onAdd}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          {oos ? "Out of stock" : added ? "Added ✓" : `Add to cart · ${formatCents(product.price_cents * qty)}`}
        </button>
      </div>
    </div>
  );
}
