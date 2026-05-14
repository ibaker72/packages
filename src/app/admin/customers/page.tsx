import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("profiles")
    .select("id, email, full_name, business_name, role, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="surface p-6">
      <h2 className="font-semibold mb-4">Customers</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase text-ink-500 tracking-wider">
            <tr><th className="py-2">Email</th><th>Name</th><th>Business</th><th>Role</th><th>Joined</th></tr>
          </thead>
          <tbody>
            {(data ?? []).map((p) => (
              <tr key={p.id} className="border-t border-ink-100">
                <td className="py-2.5 font-medium">{p.email}</td>
                <td>{p.full_name || "—"}</td>
                <td>{p.business_name || "—"}</td>
                <td><span className="chip capitalize">{p.role}</span></td>
                <td className="text-ink-500">{new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {(!data || data.length === 0) && (
              <tr><td colSpan={5} className="py-8 text-center text-ink-500">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
