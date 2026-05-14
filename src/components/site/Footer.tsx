import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100 bg-white">
      <div className="container py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-7 w-7 rounded-md bg-ink-900 grid place-items-center text-white text-xs font-bold">PF</div>
            <span className="font-semibold tracking-tight">PackFlow Supply</span>
          </div>
          <p className="text-sm text-ink-500 leading-relaxed">
            Packaging supplies and recurring restocks for businesses that ship every day.
            North Jersey, with nationwide shipping.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><Link href="/products?category=boxes">Boxes</Link></li>
            <li><Link href="/products?category=mailers">Mailers</Link></li>
            <li><Link href="/products?category=void_fill">Void Fill</Link></li>
            <li><Link href="/products?category=tape_labels">Tape & Labels</Link></li>
            <li><Link href="/products?category=inserts">Branded Inserts</Link></li>
            <li><Link href="/kits">Kits</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-3">Programs</h4>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><Link href="/subscriptions">Restock Subscriptions</Link></li>
            <li><Link href="/custom-packaging">Custom Packaging</Link></li>
            <li><Link href="/local-delivery">Local Delivery</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-3">Account</h4>
          <ul className="space-y-2 text-sm text-ink-600">
            <li><Link href="/account">Sign in</Link></li>
            <li><Link href="/account/orders">Orders</Link></li>
            <li><Link href="/account/subscriptions">Subscriptions</Link></li>
          </ul>
        </div>
      </div>
      <div className="container py-6 hairline flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-ink-500">
        <div>© {new Date().getFullYear()} PackFlow Supply. Newark, NJ.</div>
        <div>Built for operators.</div>
      </div>
    </footer>
  );
}
