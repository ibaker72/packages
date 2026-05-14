import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { email } from "@/lib/resend";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  const body = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (e) {
    return NextResponse.json({ error: `Bad signature: ${(e as Error).message}` }, { status: 400 });
  }

  const sb = createSupabaseServiceClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode === "payment") {
          await handlePayment(sb, stripe, s);
        } else if (s.mode === "subscription") {
          await handleSubscriptionCheckout(sb, s);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await sb.from("subscriptions").update({ status: sub.status }).eq("stripe_subscription_id", sub.id);
        break;
      }
    }
  } catch (e) {
    console.error("[webhook] handler error", e);
    return NextResponse.json({ received: true, warning: (e as Error).message });
  }

  return NextResponse.json({ received: true });
}

async function handlePayment(
  sb: ReturnType<typeof createSupabaseServiceClient>,
  stripe: ReturnType<typeof getStripe>,
  s: Stripe.Checkout.Session,
) {
  const userId = s.metadata?.user_id || null;
  const customerEmail = s.customer_details?.email ?? s.customer_email ?? "";
  const cart = safeParseCart(s.metadata?.cart);

  const li = await stripe.checkout.sessions.listLineItems(s.id, { limit: 100, expand: ["data.price.product"] });

  const subtotal = li.data.reduce((sum, l) => sum + (l.amount_subtotal ?? 0), 0);
  const shipping = s.shipping_cost?.amount_total ?? 0;
  const tax = s.total_details?.amount_tax ?? 0;
  const total = s.amount_total ?? subtotal + shipping + tax;

  const shippingAddr = s.shipping_details?.address ?? null;
  const isLocal = !!shippingAddr?.postal_code && shippingAddr.postal_code.startsWith("07");

  const { data: existing } = await sb.from("orders").select("id").eq("stripe_session_id", s.id).maybeSingle();
  let orderId = existing?.id as string | undefined;

  if (!orderId) {
    const { data: created, error } = await sb
      .from("orders")
      .insert({
        user_id: userId || null,
        customer_email: customerEmail,
        stripe_session_id: s.id,
        stripe_payment_intent_id: typeof s.payment_intent === "string" ? s.payment_intent : null,
        status: "paid",
        subtotal_cents: subtotal,
        shipping_cents: shipping,
        tax_cents: tax,
        total_cents: total,
        delivery_method: isLocal ? "local_delivery" : "shipping",
        delivery_address: shippingAddr,
      })
      .select("id")
      .single();
    if (error) throw error;
    orderId = created.id as string;

    // Items
    const items = li.data.map((l) => {
      const productMeta = (l.price?.product as Stripe.Product | undefined)?.metadata ?? {};
      const fromCart = cart.find((c) => c.p === productMeta.product_id);
      return {
        order_id: orderId!,
        product_id: productMeta.product_id || null,
        name_snapshot: l.description ?? fromCart?.n ?? "Item",
        quantity: l.quantity ?? 1,
        unit_price_cents: l.price?.unit_amount ?? 0,
        total_cents: l.amount_total ?? (l.price?.unit_amount ?? 0) * (l.quantity ?? 1),
      };
    });
    if (items.length > 0) await sb.from("order_items").insert(items);

    // Decrement inventory
    for (const it of items) {
      if (!it.product_id) continue;
      const productId = it.product_id;
      const rpcRes = await sb.rpc("decrement_inventory", { p_id: productId, p_qty: it.quantity });
      if (rpcRes.error) {
        const { data: p } = await sb.from("products").select("inventory_count").eq("id", productId).single();
        if (p) {
          await sb
            .from("products")
            .update({ inventory_count: Math.max(0, (p as { inventory_count: number }).inventory_count - it.quantity) })
            .eq("id", productId);
        }
      }
    }

    if (customerEmail) await email.orderConfirmation(customerEmail, orderId, total);
  }
}

async function handleSubscriptionCheckout(
  sb: ReturnType<typeof createSupabaseServiceClient>,
  s: Stripe.Checkout.Session,
) {
  const userId = s.metadata?.user_id;
  if (!userId) return;
  const cadence = (s.metadata?.cadence as "weekly" | "biweekly" | "monthly") ?? "monthly";
  const items = safeParseSubItems(s.metadata?.items);
  const subId = typeof s.subscription === "string" ? s.subscription : null;

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + (cadence === "weekly" ? 7 : cadence === "biweekly" ? 14 : 30));

  await sb.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subId,
      status: "active",
      cadence,
      items,
      next_delivery_date: nextDate.toISOString().slice(0, 10),
      delivery_method: "shipping",
    },
    { onConflict: "stripe_subscription_id" },
  );

  const customerEmail = s.customer_details?.email ?? s.customer_email ?? "";
  if (customerEmail) await email.subscriptionStarted(customerEmail, cadence);
}

function safeParseCart(raw?: string | null): Array<{ p: string; q: number; u: number; n: string }> {
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
function safeParseSubItems(raw?: string | null): Array<{ product_id: string; quantity: number }> {
  try { return raw ? JSON.parse(raw) : []; } catch { return []; }
}
