import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AccountSubsPage() {
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/login?next=/account/subscriptions");

  const { data: subs } = await sb
    .from("subscriptions")
    .select("id, cadence, status, next_delivery_date, items, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/account" className="text-sm text-ink-500 hover:text-ink-900">← Account</Link>
      <h1 className="text-3xl font-semibold tracking-tight mt-2">Subscriptions</h1>

      {(!subs || subs.length === 0) ? (
        <div className="surface p-10 mt-8 text-center text-ink-500 text-sm">
          You haven't set up a restock yet.{" "}
          <Link href="/subscriptions" className="underline">Start one →</Link>
        </div>
      ) : (
        <div className="mt-8 surface divide-y divide-ink-100">
          {subs.map((s) => (
            <div key={s.id} className="p-5 flex items-center justify-between">
              <div>
                <div className="font-medium capitalize">{s.cadence} restock</div>
                <div className="text-xs text-ink-500">
                  Next delivery: {s.next_delivery_date || "—"} · {(s.items as { quantity: number }[] | null)?.length ?? 0} items
                </div>
              </div>
              <span className="chip">{s.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
