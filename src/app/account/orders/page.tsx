import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/login?next=/account/orders");

  const { data: orders } = await sb
    .from("orders")
    .select("id, status, total_cents, created_at, delivery_method")
    .order("created_at", { ascending: false });

  return (
    <div className="container py-10 max-w-4xl">
      <Link href="/account" className="text-sm text-ink-500 hover:text-ink-900">← Account</Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Orders</h1>

      {(!orders || orders.length === 0) ? (
        <div className="surface p-10 mt-8 text-center text-ink-500 text-sm">
          No orders yet. <Link href="/products" className="underline">Start shopping →</Link>
        </div>
      ) : (
        <div className="mt-8 surface divide-y divide-ink-100">
          {orders.map((o) => (
            <Link key={o.id} href={`/account/orders/${o.id}`} className="p-4 sm:p-5 flex items-center justify-between hover:bg-ink-50/50 transition">
              <div>
                <div className="font-medium">#{o.id.slice(0, 8).toUpperCase()}</div>
                <div className="text-xs text-ink-500">
                  {new Date(o.created_at).toLocaleDateString()} · {o.delivery_method.replace("_", " ")}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase tracking-wider text-ink-500">{o.status}</span>
                <span className="font-semibold">{formatCents(o.total_cents)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
