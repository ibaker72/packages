"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function ensureAdmin() {
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) throw new Error("Unauthorized");
  const { data: profile } = await sb.from("profiles").select("role").eq("id", auth.user.id).single();
  if (profile?.role !== "admin") throw new Error("Forbidden");
  return sb;
}

export async function updateOrderStatus(id: string, status: string) {
  const sb = await ensureAdmin();
  await sb.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
}

export async function updateQuoteStatus(id: string, status: string) {
  const sb = await ensureAdmin();
  await sb.from("quote_requests").update({ status }).eq("id", id);
  revalidatePath("/admin/quotes");
}

export async function updateProductInventory(id: string, inventory_count: number) {
  const sb = await ensureAdmin();
  await sb.from("products").update({ inventory_count }).eq("id", id);
  revalidatePath("/admin/products");
}

export async function toggleProductActive(id: string, is_active: boolean) {
  const sb = await ensureAdmin();
  await sb.from("products").update({ is_active }).eq("id", id);
  revalidatePath("/admin/products");
}
