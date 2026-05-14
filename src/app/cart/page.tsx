"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart, cartSubtotalCents, lineTotalCents, hasSubscriptionLines } from "@/lib/cart";
import { formatCents } from "@/lib/utils";
import { useState } from "react";

export default function CartPage() {
  const lines = useCart((s) => s.lines);
  const hydrated = useCart((s) => s.hydrated);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const toggleSubscribe = useCart((s) => s.toggleSubscribe);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartSubtotalCents(lines);
  const hasSubs = hasSubscriptionLines(lines);
  const hasOneTime = lines.some((l) => !l.subscribe);
  const mixed = hasSubs && hasOneTime;

  async function checkout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Checkout failed");
      window.location.href = json.url;
    } catch (e) {
      setError((e as Error).message);
      setLoading(false);
    }
  }

  if (!hydrated) {
    return <div className="container py-16 text-ink-500">Loading cart…</div>;
  }

  if (lines.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty.</h1>
        <p className="text-ink-500 mt-2">Time to stock up.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/products" className="btn-primary">Shop products</Link>
          <Link href="/kits" className="btn-outline">Shop kits</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-6">Cart</h1>
        <div className="surface divide-y divide-ink-100">
          {lines.map((l) => (
            <div key={l.product_id} className="p-4 sm:p-5 flex gap-4">
              <Link href={`/products/${l.slug}`} className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-ink-100 flex-shrink-0">
                {l.image && <img src={l.image} className="h-full w-full object-cover" alt={l.name} />}
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${l.slug}`} className="font-medium hover:underline line-clamp-2">
                  {l.name}
                </Link>
                <div className="text-sm text-ink-500">{formatCents(l.unit_price_cents)} ea</div>
                {l.is_subscription_eligible && (
                  <label className="mt-2 inline-flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!l.subscribe}
                      onChange={() => toggleSubscribe(l.product_id)}
                      className="h-3.5 w-3.5 accent-amber-600"
                    />
                    Subscribe & save 10%
                  </label>
                )}
                <div className="mt-2 flex items-center gap-3">
                  <div className="inline-flex items-center rounded-full border border-ink-200 bg-white">
                    <button onClick={() => setQty(l.product_id, l.quantity - 1)} className="h-8 w-8 grid place-items-center text-ink-600 hover:bg-ink-50 rounded-l-full" aria-label="decrease">
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <div className="w-8 text-center text-sm">{l.quantity}</div>
                    <button onClick={() => setQty(l.product_id, l.quantity + 1)} className="h-8 w-8 grid place-items-center text-ink-600 hover:bg-ink-50 rounded-r-full" aria-label="increase">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button onClick={() => remove(l.product_id)} className="text-ink-400 hover:text-red-700">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="text-right font-medium">{formatCents(lineTotalCents(l))}</div>
            </div>
          ))}
        </div>
      </div>

      <aside className="surface p-5 h-fit sticky top-24">
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-3">Summary</div>
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-ink-500">Subtotal</span>
          <span className="font-medium">{formatCents(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm py-1.5">
          <span className="text-ink-500">Shipping</span>
          <span className="text-ink-500">Calculated at checkout</span>
        </div>
        <div className="hairline my-3" />
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatCents(subtotal)}</span>
        </div>
        {mixed && (
          <div className="mt-3 text-xs rounded-xl bg-amber-50 text-amber-800 px-3 py-2 border border-amber-100">
            One-time and subscription items can't checkout together. We'll process the subscription items separately on the next step.
          </div>
        )}
        {error && <div className="mt-3 text-xs text-red-700">{error}</div>}
        <button onClick={checkout} disabled={loading} className="btn-primary w-full mt-4">
          {loading ? "Redirecting…" : "Checkout"}
        </button>
        <p className="text-xs text-ink-500 mt-3 text-center">
          Secure checkout powered by Stripe.
        </p>
      </aside>
    </div>
  );
}
