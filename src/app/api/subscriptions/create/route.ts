import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServerClient, createSupabaseServiceClient } from "@/lib/supabase/server";
import { SUBSCRIPTION_DISCOUNT } from "@/lib/constants";

const bodySchema = z.object({
  cadence: z.enum(["weekly", "biweekly", "monthly"]),
  items: z
    .array(z.object({ product_id: z.string().uuid(), quantity: z.number().int().positive() }))
    .min(1),
});

export async function POST(req: NextRequest) {
  const parsed = bodySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { cadence, items } = parsed.data;

  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const service = createSupabaseServiceClient();
  type Row = { id: string; name: string; price_cents: number; is_subscription_eligible: boolean; is_active: boolean };
  const { data: products } = await service
    .from("products")
    .select("id, name, price_cents, is_subscription_eligible, is_active")
    .returns<Row[]>();
  const byId = new Map<string, Row>((products ?? []).map((p) => [p.id, p]));
  for (const it of items) {
    const p = byId.get(it.product_id);
    if (!p?.is_active || !p.is_subscription_eligible) {
      return NextResponse.json({ error: `Not subscription-eligible: ${p?.name ?? it.product_id}` }, { status: 400 });
    }
  }

  const interval =
    cadence === "weekly" ? { interval: "week" as const, interval_count: 1 } :
    cadence === "biweekly" ? { interval: "week" as const, interval_count: 2 } :
    { interval: "month" as const, interval_count: 1 };

  const stripe = getStripe();
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: auth.user.email ?? undefined,
    line_items: items.map((it) => {
      const p = byId.get(it.product_id)!;
      return {
        quantity: it.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(p.price_cents * (1 - SUBSCRIPTION_DISCOUNT)),
          recurring: interval,
          product_data: {
            name: `${p.name} — ${cadence} restock`,
            metadata: { product_id: p.id },
          },
        },
      };
    }),
    success_url: `${site}/account/subscriptions?ok=1`,
    cancel_url: `${site}/subscriptions`,
    metadata: {
      user_id: auth.user.id,
      cadence,
      items: JSON.stringify(items).slice(0, 4900),
    },
  });

  return NextResponse.json({ url: session.url });
}
