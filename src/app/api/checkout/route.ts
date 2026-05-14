import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";

const lineSchema = z.object({
  product_id: z.string().uuid(),
  slug: z.string(),
  name: z.string(),
  unit_price_cents: z.number().int().positive(),
  quantity: z.number().int().positive(),
  subscribe: z.boolean().optional(),
  is_subscription_eligible: z.boolean().optional(),
  image: z.string().optional(),
});
const bodySchema = z.object({ lines: z.array(lineSchema).min(1) });

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid cart" }, { status: 400 });

  // Take one-time lines for this checkout; subscriptions handled by /api/subscriptions/create
  const lines = parsed.data.lines.filter((l) => !l.subscribe);
  if (lines.length === 0) {
    return NextResponse.json({ error: "Cart has only subscription items — use /subscriptions" }, { status: 400 });
  }

  // Re-price from DB to prevent client tampering
  const service = createSupabaseServiceClient();
  const ids = lines.map((l) => l.product_id);
  type Row = { id: string; name: string; slug: string; price_cents: number; images: string[]; inventory_count: number; is_active: boolean };
  const { data: products, error } = await service
    .from("products")
    .select("id, name, slug, price_cents, images, inventory_count, is_active")
    .in("id", ids)
    .returns<Row[]>();
  if (error || !products) return NextResponse.json({ error: "Lookup failed" }, { status: 500 });

  const byId = new Map<string, Row>(products.map((p) => [p.id, p]));
  for (const l of lines) {
    const p = byId.get(l.product_id);
    if (!p || !p.is_active) return NextResponse.json({ error: `Item unavailable: ${l.name}` }, { status: 400 });
    if (p.inventory_count < l.quantity) return NextResponse.json({ error: `Not enough stock for ${p.name}` }, { status: 400 });
  }

  let userId: string | null = null;
  let userEmail: string | null = null;
  try {
    const sb = await createSupabaseServerClient();
    const { data } = await sb.auth.getUser();
    userId = data.user?.id ?? null;
    userEmail = data.user?.email ?? null;
  } catch {}

  const stripe = getStripe();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lines.map((l) => {
      const p = byId.get(l.product_id)!;
      return {
        quantity: l.quantity,
        price_data: {
          currency: "usd",
          unit_amount: p.price_cents,
          product_data: {
            name: p.name,
            images: p.images?.slice(0, 1) ?? [],
            metadata: { product_id: p.id, slug: p.slug },
          },
        },
      };
    }),
    shipping_address_collection: { allowed_countries: ["US"] },
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Flat shipping (2–4 days)",
          fixed_amount: { amount: 900, currency: "usd" },
        },
      },
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Local NJ same/next-day",
          fixed_amount: { amount: 1500, currency: "usd" },
        },
      },
    ],
    customer_email: userEmail ?? undefined,
    success_url: `${site}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${site}/cart`,
    metadata: {
      user_id: userId ?? "",
      cart: JSON.stringify(
        lines.map((l) => ({ p: l.product_id, q: l.quantity, u: l.unit_price_cents, n: l.name })),
      ).slice(0, 4900),
    },
  });

  return NextResponse.json({ id: session.id, url: session.url });
}
