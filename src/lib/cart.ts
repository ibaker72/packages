"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "@/lib/types";
import { SUBSCRIPTION_DISCOUNT } from "@/lib/constants";

type CartState = {
  lines: CartLine[];
  hydrated: boolean;
  add: (line: CartLine) => void;
  remove: (product_id: string) => void;
  setQty: (product_id: string, qty: number) => void;
  toggleSubscribe: (product_id: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      hydrated: false,
      add: (line) =>
        set((s) => {
          const existing = s.lines.find((l) => l.product_id === line.product_id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.product_id === line.product_id
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l,
              ),
            };
          }
          return { lines: [...s.lines, line] };
        }),
      remove: (product_id) =>
        set((s) => ({ lines: s.lines.filter((l) => l.product_id !== product_id) })),
      setQty: (product_id, qty) =>
        set((s) => ({
          lines: s.lines
            .map((l) => (l.product_id === product_id ? { ...l, quantity: qty } : l))
            .filter((l) => l.quantity > 0),
        })),
      toggleSubscribe: (product_id) =>
        set((s) => ({
          lines: s.lines.map((l) =>
            l.product_id === product_id && l.is_subscription_eligible
              ? { ...l, subscribe: !l.subscribe }
              : l,
          ),
        })),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "packflow_cart",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    },
  ),
);

export function lineTotalCents(l: CartLine) {
  const discounted = l.subscribe
    ? Math.round(l.unit_price_cents * (1 - SUBSCRIPTION_DISCOUNT))
    : l.unit_price_cents;
  return discounted * l.quantity;
}

export function cartSubtotalCents(lines: CartLine[]) {
  return lines.reduce((s, l) => s + lineTotalCents(l), 0);
}

export function cartCount(lines: CartLine[]) {
  return lines.reduce((s, l) => s + l.quantity, 0);
}

export function hasSubscriptionLines(lines: CartLine[]) {
  return lines.some((l) => l.subscribe);
}
