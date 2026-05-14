export type ProductCategory =
  | "boxes"
  | "mailers"
  | "tape_labels"
  | "void_fill"
  | "inserts"
  | "kits"
  | "eco";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price_cents: number;
  compare_at_price_cents: number | null;
  sku: string;
  images: string[];
  inventory_count: number;
  is_active: boolean;
  is_featured: boolean;
  is_subscription_eligible: boolean;
  is_eco: boolean;
  tags: string[];
  dimensions: { l?: number; w?: number; h?: number; unit?: "in" | "cm" } | null;
  pack_quantity: number;
  created_at?: string;
  updated_at?: string;
};

export type KitItem = {
  kit_product_id: string;
  item_product_id: string;
  quantity: number;
  item?: Product;
};

export type CartLine = {
  product_id: string;
  slug: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  image?: string;
  subscribe?: boolean;
  is_subscription_eligible?: boolean;
};

export type DeliveryMethod = "local_delivery" | "shipping" | "pickup";

export type OrderStatus =
  | "pending"
  | "paid"
  | "fulfilled"
  | "cancelled"
  | "refunded";

export type QuoteStatus =
  | "new"
  | "contacted"
  | "quoted"
  | "won"
  | "lost";

export type SubscriptionCadence = "weekly" | "biweekly" | "monthly";
