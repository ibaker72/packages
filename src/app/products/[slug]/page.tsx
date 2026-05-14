import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatCents } from "@/lib/utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { getKitItems, getProductBySlug } from "@/lib/data";
import { AddToCartPanel } from "@/components/site/AddToCartPanel";

export const dynamic = "force-dynamic";

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const items = product.category === "kits" ? await getKitItems(product.id) : [];
  const lowStock = product.inventory_count > 0 && product.inventory_count <= LOW_STOCK_THRESHOLD;

  return (
    <div className="container py-10">
      <Link href={product.category === "kits" ? "/kits" : "/products"} className="text-sm text-ink-500 hover:text-ink-900">
        ← Back
      </Link>

      <div className="mt-6 grid md:grid-cols-2 gap-10">
        <div className="surface overflow-hidden aspect-[4/3] bg-ink-100">
          {product.images?.[0] && (
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {product.is_eco && <Badge tone="eco">Eco</Badge>}
            {product.is_featured && <Badge tone="best">Best Seller</Badge>}
            {product.pack_quantity >= 50 && <Badge tone="bulk">Bulk · {product.pack_quantity}</Badge>}
            <Badge tone="local">Local delivery</Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            <div className="text-2xl font-semibold">{formatCents(product.price_cents)}</div>
            {product.compare_at_price_cents && (
              <div className="text-ink-400 line-through">{formatCents(product.compare_at_price_cents)}</div>
            )}
            <div className="text-sm text-ink-500">/ pack of {product.pack_quantity}</div>
          </div>
          <p className="mt-4 text-ink-600 leading-relaxed">{product.description}</p>

          <div className="mt-5 flex items-center gap-4 text-sm text-ink-600">
            <div>SKU: <span className="text-ink-900 font-medium">{product.sku}</span></div>
            {lowStock ? (
              <div className="text-amber-700 font-medium">Only {product.inventory_count} left</div>
            ) : product.inventory_count === 0 ? (
              <div className="text-red-700 font-medium">Out of stock</div>
            ) : (
              <div className="text-emerald-700">In stock · ships today</div>
            )}
          </div>

          {items.length > 0 && (
            <div className="mt-6 surface p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-3">What's inside</div>
              <ul className="space-y-2 text-sm">
                {items.map((it) => (
                  <li key={it.item_product_id} className="flex items-center justify-between">
                    <span>
                      <span className="font-medium">{it.quantity}× </span>
                      <Link href={`/products/${it.item?.slug}`} className="hover:underline">{it.item?.name}</Link>
                    </span>
                    <span className="text-ink-500 text-xs">{it.item?.pack_quantity} ct pack</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <AddToCartPanel product={product} />

          <div className="mt-6 text-xs text-ink-500">
            Free local delivery on orders over $75 in eligible NJ ZIPs.
            Nationwide shipping in 2–4 business days.
          </div>
        </div>
      </div>
    </div>
  );
}
