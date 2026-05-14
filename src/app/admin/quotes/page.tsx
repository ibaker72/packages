import { createSupabaseServerClient } from "@/lib/supabase/server";
import { AdminQuoteStatusSelect } from "@/components/admin/AdminQuoteStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="surface p-6">
      <h2 className="font-semibold mb-4">Quote requests</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-ink-500 tracking-wider">
            <tr>
              <th className="py-2">Business</th><th>Contact</th><th>Email</th><th>Type</th><th>Qty</th><th>When</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((q) => (
              <tr key={q.id} className="border-t border-ink-100 align-top">
                <td className="py-2.5 font-medium">{q.business_name}</td>
                <td>{q.contact_name}</td>
                <td>{q.email}</td>
                <td>{q.packaging_type || "—"}</td>
                <td>{q.quantity_needed || "—"}</td>
                <td className="text-ink-500">{new Date(q.created_at).toLocaleDateString()}</td>
                <td><AdminQuoteStatusSelect id={q.id} status={q.status} /></td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={7} className="py-8 text-center text-ink-500">No quote requests yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
