import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "@/components/site/SignOutButton";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const sb = await createSupabaseServerClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) redirect("/login?next=/account");

  const { data: profile } = await sb.from("profiles").select("*").eq("id", data.user.id).single();

  return (
    <div className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Account</h1>
      <p className="text-ink-500 mt-1">{data.user.email}</p>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <Link href="/account/orders" className="surface p-5 hover:shadow-soft transition">
          <div className="font-medium">Orders</div>
          <div className="text-sm text-ink-500 mt-1">View past orders and reorder.</div>
        </Link>
        <Link href="/account/subscriptions" className="surface p-5 hover:shadow-soft transition">
          <div className="font-medium">Subscriptions</div>
          <div className="text-sm text-ink-500 mt-1">Manage restock cadence.</div>
        </Link>
      </div>

      {profile?.role === "admin" && (
        <div className="mt-6 surface p-5 border-amber-200">
          <div className="font-medium">Admin tools</div>
          <Link href="/admin" className="btn-accent mt-3 inline-flex">Open admin dashboard →</Link>
        </div>
      )}

      <div className="mt-10">
        <SignOutButton />
      </div>
    </div>
  );
}
