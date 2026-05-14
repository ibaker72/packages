import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatCents } from "@/lib/utils";
import { ReorderButton } from "@/components/site/ReorderButton";

export const dynamic = "force-dynamic";

export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect(`/login?next=/account/orders/${id}`);

  const { data: order } = await sb
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();
  if (!order) notFound();

  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/account/orders" className="text-sm text-ink-500 hover:text-ink-900">← All orders</Link>
      <div className="mt-2 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Order #{order.id.slice(0, 8).toUpperCase()}</h1>
        <span className="text-xs uppercase tracking-wider text-ink-500">{order.status}</span>
      </div>
      <div className="text-sm text-ink-500 mt-1">
        Placed {new Date(order.created_at).toLocaleString()} · {order.delivery_method.replace("_", " ")}
      </div>

      <div className="mt-8 surface divide-y divide-ink-100">
        {order.order_items.map((it: { id: string; name_snapshot: string; quantity: number; total_cents: number }) => (
          <div key={it.id} className="p-4 flex justify-between text-sm">
            <span>{it.quantity}× {it.name_snapshot}</span>
            <span className="font-medium">{formatCents(it.total_cents)}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 surface p-5 max-w-sm ml-auto text-sm">
        <Row label="Subtotal" value={formatCents(order.subtotal_cents)} />
        <Row label="Shipping" value={formatCents(order.shipping_cents)} />
        <Row label="Tax" value={formatCents(order.tax_cents)} />
        <div className="hairline my-2" />
        <Row label="Total" value={formatCents(order.total_cents)} strong />
      </div>

      <div className="mt-6 flex gap-3">
        <ReorderButton items={order.order_items} />
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className={strong ? "font-semibold" : "text-ink-500"}>{label}</span>
      <span className={strong ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
