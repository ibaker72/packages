import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminSubsPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("subscriptions")
    .select("id, cadence, status, next_delivery_date, items, created_at, user_id")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="surface p-6">
      <h2 className="font-semibold mb-4">Subscriptions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-ink-500 tracking-wider">
            <tr><th className="py-2">User</th><th>Cadence</th><th>Next</th><th>Items</th><th>Status</th><th>Started</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((s) => (
              <tr key={s.id} className="border-t border-ink-100">
                <td className="py-2.5 font-mono text-xs">{s.user_id?.slice(0, 8)}</td>
                <td className="capitalize">{s.cadence}</td>
                <td>{s.next_delivery_date || "—"}</td>
                <td>{(s.items as { quantity: number }[] | null)?.length ?? 0}</td>
                <td><span className="chip">{s.status}</span></td>
                <td className="text-ink-500">{new Date(s.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={6} className="py-8 text-center text-ink-500">No subscriptions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
