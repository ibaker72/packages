"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart, cartCount } from "@/lib/cart";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

const nav = [
  { href: "/products", label: "Products" },
  { href: "/kits", label: "Kits" },
  { href: "/subscriptions", label: "Subscriptions" },
  { href: "/custom-packaging", label: "Custom" },
  { href: "/local-delivery", label: "Local Delivery" },
];

export function Header() {
  const pathname = usePathname();
  const lines = useCart((s) => s.lines);
  const count = cartCount(lines);

  return (
    <header className="sticky top-0 z-40 bg-ink-50/85 backdrop-blur border-b border-ink-100">
      <div className="container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-ink-900 grid place-items-center text-white text-xs font-bold">PF</div>
          <span className="font-semibold tracking-tight">PackFlow Supply</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "px-3 py-2 rounded-full text-sm transition",
                pathname?.startsWith(n.href) ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/account" className="hidden md:inline-flex btn-ghost text-sm">Account</Link>
          <Link
            href="/cart"
            className="relative inline-flex items-center gap-2 rounded-full bg-ink-900 text-white px-4 py-2 text-sm hover:bg-ink-800"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full bg-amber-500 text-white text-[10px] h-5 min-w-5 px-1 grid place-items-center">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
