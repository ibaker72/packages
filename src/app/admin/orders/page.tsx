import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/utils";
import { AdminOrderStatusSelect } from "@/components/admin/AdminOrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("orders")
    .select("id, customer_email, status, total_cents, delivery_method, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="surface p-6">
      <h2 className="font-semibold mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-ink-500 tracking-wider">
            <tr>
              <th className="py-2">Order</th><th>Email</th><th>Method</th><th>Total</th><th>When</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((o) => (
              <tr key={o.id} className="border-t border-ink-100">
                <td className="py-2.5 font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                <td>{o.customer_email}</td>
                <td className="capitalize">{o.delivery_method.replace("_", " ")}</td>
                <td>{formatCents(o.total_cents)}</td>
                <td className="text-ink-500">{new Date(o.created_at).toLocaleString()}</td>
                <td><AdminOrderStatusSelect id={o.id} status={o.status} /></td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={6} className="py-8 text-center text-ink-500">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
