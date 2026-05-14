-- atomic inventory decrement
create or replace function public.decrement_inventory(p_id uuid, p_qty integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.products
  set inventory_count = greatest(0, inventory_count - p_qty)
  where id = p_id;
end $$;
