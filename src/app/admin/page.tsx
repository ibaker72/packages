import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOverview() {
  const sb = await createSupabaseServerClient();
  const since = new Date(Date.now() - 30 * 86400_000).toISOString();

  const [revenueRes, ordersRes, subsRes, quotesRes, recentOrders] = await Promise.all([
    sb.from("orders").select("total_cents").gte("created_at", since).eq("status", "paid"),
    sb.from("orders").select("id", { count: "exact", head: true }).gte("created_at", since),
    sb.from("subscriptions").select("id", { count: "exact", head: true }).eq("status", "active"),
    sb.from("quote_requests").select("id", { count: "exact", head: true }).eq("status", "new"),
    sb.from("orders").select("id, customer_email, total_cents, status, created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const revenue = (revenueRes.data ?? []).reduce((s, r) => s + (r.total_cents ?? 0), 0);
  const orderCount = ordersRes.count ?? 0;
  const activeSubs = subsRes.count ?? 0;
  const openQuotes = quotesRes.count ?? 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Kpi label="30-day revenue" value={formatCents(revenue)} />
        <Kpi label="Orders (30d)" value={String(orderCount)} />
        <Kpi label="Active subscriptions" value={String(activeSubs)} />
        <Kpi label="Open quote requests" value={String(openQuotes)} />
      </div>

      <div className="surface p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="text-sm text-ink-500 hover:text-ink-900">All orders →</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase text-ink-500 tracking-wider">
              <tr><th className="py-2">Order</th><th>Email</th><th>Status</th><th>Total</th><th>When</th></tr>
            </thead>
            <tbody>
              {(recentOrders.data ?? []).map((o) => (
                <tr key={o.id} className="border-t border-ink-100">
                  <td className="py-2.5 font-medium">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td>{o.customer_email}</td>
                  <td><span className="chip capitalize">{o.status}</span></td>
                  <td>{formatCents(o.total_cents)}</td>
                  <td className="text-ink-500">{new Date(o.created_at).toLocaleString()}</td>
                </tr>
              ))}
              {(!recentOrders.data || recentOrders.data.length === 0) && (
                <tr><td colSpan={5} className="py-8 text-center text-ink-500">No orders yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="kpi">
      <div className="text-xs uppercase tracking-wider text-ink-500">{label}</div>
      <div className="text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
