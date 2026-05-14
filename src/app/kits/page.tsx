import { ProductCard } from "@/components/site/ProductCard";
import { getFeaturedKits } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function KitsPage() {
  const kits = await getFeaturedKits(24);
  return (
    <div className="container py-10">
      <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Curated</div>
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">Shipping kits</h1>
      <p className="text-ink-500 mt-2 max-w-xl">
        Pre-built bundles for Etsy, TikTok, boutiques, sneakers, fragile goods, and eco brands.
        Subscribe to most kits for 10% off and a recurring restock.
      </p>
      {kits.length === 0 ? (
        <div className="surface p-10 text-center text-ink-500 mt-10 text-sm">
          Run the seed script to populate kits.
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {kits.map((k) => <ProductCard key={k.id} p={k} />)}
        </div>
      )}
    </div>
  );
}
