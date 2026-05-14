import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Product, KitItem } from "@/lib/types";

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const sb = await createSupabaseServerClient();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .neq("category", "kits")
      .order("created_at", { ascending: false })
      .limit(limit);
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export async function getFeaturedKits(limit = 6): Promise<Product[]> {
  try {
    const sb = await createSupabaseServerClient();
    const { data } = await sb
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category", "kits")
      .order("is_featured", { ascending: false })
      .limit(limit);
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export async function getProducts(opts: {
  category?: string | null;
  eco?: boolean;
  subscriptionOnly?: boolean;
} = {}): Promise<Product[]> {
  try {
    const sb = await createSupabaseServerClient();
    let q = sb.from("products").select("*").eq("is_active", true);
    if (opts.category) q = q.eq("category", opts.category);
    if (opts.eco) q = q.eq("is_eco", true);
    if (opts.subscriptionOnly) q = q.eq("is_subscription_eligible", true);
    const { data } = await q.order("is_featured", { ascending: false }).order("name");
    return (data ?? []) as Product[];
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const sb = await createSupabaseServerClient();
    const { data } = await sb.from("products").select("*").eq("slug", slug).single();
    return (data as Product) ?? null;
  } catch {
    return null;
  }
}

export async function getKitItems(kitProductId: string): Promise<KitItem[]> {
  try {
    const sb = await createSupabaseServerClient();
    const { data } = await sb
      .from("kit_items")
      .select("kit_product_id, item_product_id, quantity, item:products!kit_items_item_product_id_fkey(*)")
      .eq("kit_product_id", kitProductId);
    return (data ?? []) as unknown as KitItem[];
  } catch {
    return [];
  }
}
