-- RLS policies
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.kit_items enable row level security;
alter table public.quote_requests enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: user reads/updates own; admin reads all
drop policy if exists profiles_self_read on public.profiles;
create policy profiles_self_read on public.profiles
  for select using (id = auth.uid() or public.is_admin());

drop policy if exists profiles_self_update on public.profiles;
create policy profiles_self_update on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- products: anyone reads active; admin writes
drop policy if exists products_public_read on public.products;
create policy products_public_read on public.products
  for select using (is_active = true or public.is_admin());

drop policy if exists products_admin_write on public.products;
create policy products_admin_write on public.products
  for all using (public.is_admin()) with check (public.is_admin());

-- kit_items: same as products
drop policy if exists kit_items_public_read on public.kit_items;
create policy kit_items_public_read on public.kit_items for select using (true);

drop policy if exists kit_items_admin_write on public.kit_items;
create policy kit_items_admin_write on public.kit_items
  for all using (public.is_admin()) with check (public.is_admin());

-- quote requests: anyone inserts; only admin reads/updates
drop policy if exists quotes_insert_anyone on public.quote_requests;
create policy quotes_insert_anyone on public.quote_requests
  for insert with check (true);

drop policy if exists quotes_admin_read on public.quote_requests;
create policy quotes_admin_read on public.quote_requests
  for select using (public.is_admin());

drop policy if exists quotes_admin_update on public.quote_requests;
create policy quotes_admin_update on public.quote_requests
  for update using (public.is_admin()) with check (public.is_admin());

-- orders: user reads own; admin reads all; webhooks (service role) bypass RLS
drop policy if exists orders_self_read on public.orders;
create policy orders_self_read on public.orders
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists orders_admin_update on public.orders;
create policy orders_admin_update on public.orders
  for update using (public.is_admin()) with check (public.is_admin());

-- order items: read if you can read the order
drop policy if exists order_items_self_read on public.order_items;
create policy order_items_self_read on public.order_items
  for select using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and (o.user_id = auth.uid() or public.is_admin())
    )
  );

-- subscriptions
drop policy if exists subs_self_read on public.subscriptions;
create policy subs_self_read on public.subscriptions
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists subs_admin_update on public.subscriptions;
create policy subs_admin_update on public.subscriptions
  for update using (public.is_admin()) with check (public.is_admin());
