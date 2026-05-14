-- PackFlow Supply — initial schema
create extension if not exists "pgcrypto";

-- updated_at trigger helper
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  business_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated
  before update on public.profiles
  for each row execute function set_updated_at();

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name')
  on conflict (id) do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  category text not null check (category in
    ('boxes','mailers','tape_labels','void_fill','inserts','kits','eco')),
  price_cents integer not null check (price_cents >= 0),
  compare_at_price_cents integer,
  sku text not null unique,
  images text[] not null default '{}',
  inventory_count integer not null default 0,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  is_subscription_eligible boolean not null default true,
  is_eco boolean not null default false,
  tags text[] not null default '{}',
  dimensions jsonb,
  pack_quantity integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_featured on public.products(is_featured) where is_active;
create trigger trg_products_updated
  before update on public.products
  for each row execute function set_updated_at();

-- kit composition (kits are products with category='kits')
create table if not exists public.kit_items (
  id uuid primary key default gen_random_uuid(),
  kit_product_id uuid not null references public.products(id) on delete cascade,
  item_product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unique(kit_product_id, item_product_id)
);
create index if not exists idx_kit_items_kit on public.kit_items(kit_product_id);

-- quote requests
create table if not exists public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  contact_name text not null,
  email text not null,
  phone text,
  website text,
  packaging_type text,
  quantity_needed text,
  branding_needed boolean not null default false,
  delivery_location text,
  notes text,
  status text not null default 'new' check (status in
    ('new','contacted','quoted','won','lost')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_quotes_updated
  before update on public.quote_requests
  for each row execute function set_updated_at();

-- orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  stripe_session_id text unique,
  stripe_payment_intent_id text,
  status text not null default 'pending' check (status in
    ('pending','paid','fulfilled','cancelled','refunded')),
  subtotal_cents integer not null default 0,
  shipping_cents integer not null default 0,
  tax_cents integer not null default 0,
  total_cents integer not null default 0,
  delivery_method text not null default 'shipping' check (delivery_method in
    ('local_delivery','shipping','pickup')),
  delivery_address jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_orders_user on public.orders(user_id);
create index if not exists idx_orders_email on public.orders(customer_email);
create trigger trg_orders_updated
  before update on public.orders
  for each row execute function set_updated_at();

-- order items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name_snapshot text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null,
  total_cents integer not null
);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- subscriptions
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_subscription_id text unique,
  status text not null default 'active',
  cadence text not null check (cadence in ('weekly','biweekly','monthly')),
  items jsonb not null default '[]'::jsonb,
  next_delivery_date date,
  delivery_method text not null default 'shipping' check (delivery_method in
    ('local_delivery','shipping','pickup')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists idx_subs_user on public.subscriptions(user_id);
create trigger trg_subs_updated
  before update on public.subscriptions
  for each row execute function set_updated_at();

-- admin helper
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;
