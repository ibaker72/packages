import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";

export function ProductCard({ p }: { p: Product }) {
  const lowStock = p.inventory_count > 0 && p.inventory_count <= LOW_STOCK_THRESHOLD;
  return (
    <Link
      href={`/products/${p.slug}`}
      className="group surface overflow-hidden flex flex-col transition hover:shadow-[0_8px_36px_rgba(15,15,10,0.08)]"
    >
      <div className="aspect-[4/3] bg-ink-100 relative overflow-hidden">
        {p.images?.[0] ? (
          <img
            src={p.images[0]}
            alt={p.name}
            className="h-full w-full object-cover transition group-hover:scale-[1.03]"
          />
        ) : null}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
          {p.is_eco && <Badge tone="eco">Eco</Badge>}
          {p.is_featured && <Badge tone="best">Best Seller</Badge>}
          {p.pack_quantity >= 50 && <Badge tone="bulk">Bulk · {p.pack_quantity}</Badge>}
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div className="text-xs uppercase tracking-wider text-ink-500 mb-1">
          {p.category.replace("_", " & ")}
        </div>
        <div className="font-medium text-ink-900 line-clamp-2">{p.name}</div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold">{formatCents(p.price_cents)}</span>
            {p.compare_at_price_cents ? (
              <span className="text-xs text-ink-400 line-through">
                {formatCents(p.compare_at_price_cents)}
              </span>
            ) : null}
          </div>
          {lowStock ? (
            <span className="text-xs text-amber-700">Low stock</span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
