import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { getProducts } from "@/lib/data";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; eco?: string; sub?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category ?? null;
  const eco = sp.eco === "1";
  const sub = sp.sub === "1";

  const products = await getProducts({
    category: category && category !== "all" ? category : null,
    eco,
    subscriptionOnly: sub,
  });

  return (
    <div className="container py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Catalog</div>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-1">All packaging supplies</h1>
          <p className="text-ink-500 mt-2">Boxes, mailers, void fill, tape, labels, branded inserts.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">
        <aside className="surface p-5 h-fit sticky top-20">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-3">Categories</div>
          <ul className="space-y-1">
            <FilterLink active={!category} href="/products" label="All" />
            {CATEGORIES.map((c) => (
              <FilterLink
                key={c.key}
                active={category === c.key}
                href={`/products?category=${c.key}`}
                label={c.label}
              />
            ))}
          </ul>
          <div className="hairline my-5" />
          <div className="space-y-2">
            <ToggleLink active={eco} label="Eco only" toggleParam="eco" current={sp} />
            <ToggleLink active={sub} label="Subscription eligible" toggleParam="sub" current={sp} />
          </div>
        </aside>

        <div>
          {products.length === 0 ? (
            <div className="surface p-10 text-center text-ink-500 text-sm">
              No products match. Try clearing filters or running the seed script.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterLink({ active, href, label }: { active: boolean; href: string; label: string }) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "block rounded-lg px-3 py-2 text-sm transition",
          active ? "bg-ink-900 text-white" : "text-ink-700 hover:bg-ink-100",
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function ToggleLink({
  active, label, toggleParam, current,
}: { active: boolean; label: string; toggleParam: "eco" | "sub"; current: Record<string, string | undefined> }) {
  const next = new URLSearchParams();
  Object.entries(current).forEach(([k, v]) => { if (v) next.set(k, v); });
  if (active) next.delete(toggleParam); else next.set(toggleParam, "1");
  const href = `/products${next.toString() ? `?${next.toString()}` : ""}`;
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between text-sm rounded-lg px-3 py-2 transition",
        active ? "bg-emerald-50 text-emerald-800" : "text-ink-700 hover:bg-ink-100",
      )}
    >
      <span>{label}</span>
      <span className={cn("h-4 w-7 rounded-full transition relative", active ? "bg-emerald-500" : "bg-ink-200")}>
        <span className={cn("absolute top-0.5 h-3 w-3 rounded-full bg-white transition", active ? "left-3" : "left-0.5")} />
      </span>
    </Link>
  );
}
