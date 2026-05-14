# PackFlow Supply

Premium B2B packaging supply + recurring restock platform for small e-commerce sellers, boutiques, resellers, and local businesses. Built for North Jersey first, with nationwide shipping.

Stack: Next.js 15 (App Router) · TypeScript · Tailwind · Supabase (Postgres + Auth + RLS) · Stripe Checkout + Subscriptions · Resend · Vercel-ready.

## Features

- Catalog with category / eco / subscription filters
- Curated kits (Etsy Starter, TikTok Seller, Boutique, Sneaker, Fragile Goods, Eco Brand)
- Cart (Zustand + localStorage) with "Subscribe & save 10%" per line
- Stripe Checkout (one-time) + Subscription Checkout (recurring restock)
- Stripe webhook creates orders/subscriptions and decrements inventory
- Custom packaging quote form → Supabase + Resend email
- Account: orders, order detail with reorder, subscriptions
- Admin: KPIs, orders, subscriptions, quotes, products (inline inventory + active toggle), customers
- North Jersey ZIP-aware local delivery messaging
- Mobile-first design with sticky mobile cart bar

## Quick start

```bash
# 1. install
pnpm install   # or npm install

# 2. env
cp .env.example .env.local
# fill in Supabase, Stripe, Resend, ADMIN_EMAIL

# 3. database
# Run the SQL in supabase/migrations/ against your Supabase project
# (Dashboard → SQL Editor, or `supabase db push` if using the CLI):
#   0001_init.sql
#   0002_rls.sql
#   0003_rpc.sql

# 4. seed
pnpm seed

# 5. dev
pnpm dev
```

Visit http://localhost:3000.

## Promote your first admin

After signing up via `/login`, run in Supabase SQL editor:

```sql
update public.profiles set role = 'admin' where email = 'you@example.com';
```

Then visit `/admin`.

## Stripe webhook (local)

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
# copy the signing secret into STRIPE_WEBHOOK_SECRET in .env.local
```

Test with `4242 4242 4242 4242` (Stripe test card). The webhook will create an `orders` row, line items, decrement inventory, and email a confirmation via Resend (if configured).

## Project structure

```
src/
  app/
    page.tsx                  # homepage
    products/                 # catalog + PDP
    kits/                     # curated kits index
    subscriptions/            # subscription marketing
    custom-packaging/         # quote form
    local-delivery/           # NJ ZIP-aware page
    cart/
    checkout/success/
    account/                  # protected (login redirect)
    admin/                    # role-gated admin dashboard
    api/
      checkout/               # Stripe Checkout Session (one-time)
      subscriptions/create/   # Stripe Subscription Checkout
      stripe/webhook/         # signed webhook handler
      quotes/                 # quote-request intake
  components/
    site/                     # public UI
    admin/                    # admin UI
    ui/                       # primitives (Button, Badge, Input)
  lib/
    cart.ts                   # Zustand cart store
    constants.ts              # NJ ZIPs, categories, thresholds
    data.ts                   # Supabase read helpers
    resend.ts                 # email templates
    stripe.ts                 # lazy Stripe client
    supabase/                 # browser + server + service clients
    types.ts                  # shared TS types
    utils.ts                  # cn(), formatCents(), slugify()
  middleware.ts               # Supabase auth cookie refresh
supabase/
  migrations/
    0001_init.sql             # schema + triggers + profile auto-create
    0002_rls.sql              # RLS policies + is_admin()
    0003_rpc.sql              # decrement_inventory()
scripts/
  seed.ts                     # 24 products + 6 kits (idempotent)
```

## Deploying to Vercel

1. Import this repo into Vercel.
2. Add all env vars from `.env.example`.
3. After deploy, set the Stripe webhook endpoint to `https://your-domain/api/stripe/webhook` and copy the new signing secret into `STRIPE_WEBHOOK_SECRET`.
4. `NEXT_PUBLIC_SITE_URL` should be your production URL.

## Notes / known limits

- Tax is read from Stripe's `total_details.amount_tax` — wire Stripe Tax in dashboard if you need automatic calculation.
- "Custom packaging" is intake-only in v1; design configurator is out of scope.
- Subscriptions use Stripe Checkout for setup; cancellation/pause UI is read-only in v1 — admins can cancel in Stripe.
- Inventory decrement runs on `checkout.session.completed`; no oversell protection beyond pre-checkout availability check.
