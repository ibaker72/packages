import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/utils";
import { AdminInventoryInput } from "@/components/admin/AdminInventoryInput";
import { AdminActiveToggle } from "@/components/admin/AdminActiveToggle";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("products")
    .select("id, name, sku, category, price_cents, inventory_count, is_active, is_featured")
    .order("name");

  return (
    <div className="surface p-6">
      <h2 className="font-semibold mb-4">Products</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-ink-500 tracking-wider">
            <tr>
              <th className="py-2">Name</th><th>SKU</th><th>Cat</th><th>Price</th><th>Inv</th><th>Active</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <tr key={p.id} className="border-t border-ink-100">
                <td className="py-2.5 font-medium">{p.name}</td>
                <td className="text-ink-500">{p.sku}</td>
                <td className="capitalize">{p.category.replace("_", " ")}</td>
                <td>{formatCents(p.price_cents)}</td>
                <td><AdminInventoryInput id={p.id} value={p.inventory_count} /></td>
                <td><AdminActiveToggle id={p.id} active={p.is_active} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
