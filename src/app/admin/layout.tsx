import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/subscriptions", label: "Subscriptions" },
  { href: "/admin/quotes", label: "Quotes" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/customers", label: "Customers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/login?next=/admin");
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") redirect("/");

  return (
    <div className="container py-8">
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">PackFlow Admin</h1>
        <Link href="/" className="text-sm text-ink-500 hover:text-ink-900">← Back to site</Link>
      </div>
      <div className="flex flex-wrap gap-1 mb-8 surface p-1.5 w-fit">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} className={cn("px-3 py-1.5 rounded-full text-sm transition hover:bg-ink-100")}>
            {n.label}
          </Link>
        ))}
      </div>
      {children}
    </div>
  );
}
