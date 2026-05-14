import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

const IMG = {
  box: "https://images.unsplash.com/photo-1607344645866-009c320b63e0?auto=format&fit=crop&w=1200&q=80",
  mailer: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80",
  tape: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  honeycomb: "https://images.unsplash.com/photo-1606166187734-a4cb74079037?auto=format&fit=crop&w=1200&q=80",
  insert: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=1200&q=80",
  kit: "https://images.unsplash.com/photo-1620421680010-0766ff230392?auto=format&fit=crop&w=1200&q=80",
};

type Seed = {
  name: string; slug: string; description: string; category: string;
  price_cents: number; compare_at_price_cents?: number | null; sku: string;
  images: string[]; inventory_count: number; is_featured?: boolean;
  is_subscription_eligible?: boolean; is_eco?: boolean; tags?: string[];
  dimensions?: Record<string, unknown> | null; pack_quantity: number;
};

const products: Seed[] = [
  // boxes
  { name: "Kraft Shipping Box 6×6×6", slug: "kraft-box-6", description: "Single-wall corrugated kraft. Sturdy for apparel, small goods, gift sets.", category: "boxes", price_cents: 2200, sku: "BOX-K-6", images: [IMG.box], inventory_count: 420, is_featured: true, tags: ["bestseller","bulk"], dimensions: { l:6,w:6,h:6,unit:"in" }, pack_quantity: 25 },
  { name: "Kraft Shipping Box 8×6×4", slug: "kraft-box-8x6x4", description: "Right-sized for paperback books, jewelry sets, small electronics.", category: "boxes", price_cents: 2600, sku: "BOX-K-864", images: [IMG.box], inventory_count: 260, tags: ["bulk"], dimensions: {l:8,w:6,h:4,unit:"in"}, pack_quantity: 25 },
  { name: "Kraft Shipping Box 10×8×6", slug: "kraft-box-10x8x6", description: "Workhorse mid-size box for boutique apparel and homegoods.", category: "boxes", price_cents: 3400, sku: "BOX-K-1086", images: [IMG.box], inventory_count: 180, is_featured: true, tags: ["bestseller"], dimensions: {l:10,w:8,h:6,unit:"in"}, pack_quantity: 25 },
  { name: "Kraft Shipping Box 12×9×4", slug: "kraft-box-12x9x4", description: "Flat-pack friendly for prints, frames, and apparel.", category: "boxes", price_cents: 3800, sku: "BOX-K-1294", images: [IMG.box], inventory_count: 140, dimensions: {l:12,w:9,h:4,unit:"in"}, pack_quantity: 25 },
  { name: "Double-Wall Box 14×10×10", slug: "double-wall-14x10x10", description: "Double-wall corrugated for fragile or heavier items up to 65 lb.", category: "boxes", price_cents: 5400, sku: "BOX-DW-141010", images: [IMG.box], inventory_count: 90, tags: ["fragile"], dimensions: {l:14,w:10,h:10,unit:"in"}, pack_quantity: 15 },

  // mailers
  { name: "Poly Mailer 6×9", slug: "poly-6x9", description: "Tear-resistant 2.5 mil poly mailer with self-seal strip.", category: "mailers", price_cents: 1800, compare_at_price_cents: 2200, sku: "PM-69", images: [IMG.mailer], inventory_count: 1800, is_featured: true, tags: ["bestseller","bulk"], pack_quantity: 100 },
  { name: "Poly Mailer 10×13", slug: "poly-10x13", description: "Workhorse apparel mailer in our charcoal house color.", category: "mailers", price_cents: 2400, sku: "PM-1013", images: [IMG.mailer], inventory_count: 1400, tags: ["bestseller"], pack_quantity: 100 },
  { name: "Poly Mailer 12×15", slug: "poly-12x15", description: "Sized for outerwear and small homegoods.", category: "mailers", price_cents: 2900, sku: "PM-1215", images: [IMG.mailer], inventory_count: 900, pack_quantity: 100 },
  { name: "Kraft Bubble Mailer #2 8.5×12", slug: "kraft-bubble-2", description: "Padded kraft mailer with kiss-cut self-seal.", category: "mailers", price_cents: 3200, sku: "KBM-2", images: [IMG.mailer], inventory_count: 700, pack_quantity: 50 },
  { name: "Recycled Paper Mailer 10×13", slug: "paper-mailer-1013", description: "100% recycled fiber, curbside recyclable.", category: "mailers", price_cents: 3400, sku: "RPM-1013", images: [IMG.mailer], inventory_count: 600, is_eco: true, tags: ["eco"], pack_quantity: 50 },

  // tape & labels
  { name: "Kraft Paper Tape 2\" × 60yd", slug: "paper-tape-2in", description: "Curbside recyclable, water-activated style finish — sticks once and stays.", category: "tape_labels", price_cents: 900, sku: "TP-K-2", images: [IMG.tape], inventory_count: 800, is_eco: true, tags: ["eco"], pack_quantity: 1 },
  { name: "Clear Packing Tape 2\" × 110yd", slug: "clear-tape-2in", description: "Heavy-duty acrylic adhesive, low-noise unroll.", category: "tape_labels", price_cents: 700, sku: "TP-C-2", images: [IMG.tape], inventory_count: 1200, is_featured: true, pack_quantity: 6 },
  { name: "Thermal Shipping Labels 4×6", slug: "thermal-4x6", description: "Direct thermal, fan-fold stack of 500. Works with all major label printers.", category: "tape_labels", price_cents: 2400, sku: "LBL-T-46", images: [IMG.tape], inventory_count: 500, pack_quantity: 500 },
  { name: "Fragile Stickers 2×3", slug: "fragile-stickers", description: "High-visibility 'Fragile — Handle With Care' labels.", category: "tape_labels", price_cents: 1200, sku: "LBL-FR", images: [IMG.tape], inventory_count: 1000, pack_quantity: 100 },

  // void fill
  { name: "Honeycomb Kraft Wrap 15\" × 250'", slug: "honeycomb-15", description: "Curbside-recyclable cushion roll. Replaces bubble for most goods.", category: "void_fill", price_cents: 4900, sku: "HC-15-250", images: [IMG.honeycomb], inventory_count: 240, is_featured: true, is_eco: true, tags: ["eco","bestseller"], pack_quantity: 1 },
  { name: "Honeycomb Kraft Wrap 12\" × 100'", slug: "honeycomb-12", description: "Smaller roll for small-batch shippers.", category: "void_fill", price_cents: 2400, sku: "HC-12-100", images: [IMG.honeycomb], inventory_count: 320, is_eco: true, tags: ["eco"], pack_quantity: 1 },
  { name: "Crinkle Paper Fill 10 lb", slug: "crinkle-10lb", description: "Natural kraft crinkle-cut shred for gift presentation.", category: "void_fill", price_cents: 3800, sku: "CR-10", images: [IMG.honeycomb], inventory_count: 180, is_eco: true, pack_quantity: 1 },
  { name: "Air Pillows 8×4 (Box of 1000)", slug: "air-pillows-1000", description: "Pre-inflated polyethylene void fill, lightweight and protective.", category: "void_fill", price_cents: 5200, sku: "AP-1000", images: [IMG.honeycomb], inventory_count: 95, pack_quantity: 1000 },

  // inserts
  { name: "Kraft Thank-You Cards 3.5×2", slug: "thank-you-cards", description: "Minimal 'Thank you for your order' cards on uncoated kraft.", category: "inserts", price_cents: 1800, sku: "TY-K-100", images: [IMG.insert], inventory_count: 700, tags: ["branding"], pack_quantity: 100 },
  { name: "Tissue Paper — Cream", slug: "tissue-cream", description: "Acid-free 17gsm tissue for boutique presentation.", category: "inserts", price_cents: 1400, sku: "TS-CR-100", images: [IMG.insert], inventory_count: 600, pack_quantity: 100 },
  { name: "Custom QR Insert Cards", slug: "qr-inserts", description: "Pre-printed QR insert cards — link to reviews, IG, or care guides.", category: "inserts", price_cents: 2200, sku: "QR-100", images: [IMG.insert], inventory_count: 320, tags: ["branding"], pack_quantity: 100 },
  { name: "Branded Sticker Sheet", slug: "branded-stickers", description: "Add your logo (admin sets art) — die-cut vinyl, weatherproof.", category: "inserts", price_cents: 3000, sku: "ST-BR-50", images: [IMG.insert], inventory_count: 400, tags: ["branding"], pack_quantity: 50 },
  { name: "Shoe Box Tissue Bundle", slug: "shoe-tissue", description: "Pre-folded tissue paper sized for sneaker boxes.", category: "inserts", price_cents: 1600, sku: "ST-SH-100", images: [IMG.insert], inventory_count: 500, pack_quantity: 100 },

  // standalone eco
  { name: "Compostable Mailer 10×13", slug: "compostable-1013", description: "Home-compostable mailer — TUV OK Home certified.", category: "eco", price_cents: 4200, sku: "CM-1013", images: [IMG.mailer], inventory_count: 280, is_eco: true, is_featured: true, tags: ["eco","bestseller"], pack_quantity: 50 },
];

const kits = [
  {
    slug: "etsy-starter-kit",
    name: "Etsy Starter Kit",
    description: "Everything you need to ship your first 50 Etsy orders.",
    price_cents: 6900, compare_at_price_cents: 8400, sku: "KIT-ETSY",
    images: [IMG.kit],
    inventory_count: 60,
    is_featured: true, is_subscription_eligible: true,
    items: [
      { slug: "kraft-bubble-2", qty: 1 },
      { slug: "thank-you-cards", qty: 1 },
      { slug: "clear-tape-2in", qty: 1 },
      { slug: "fragile-stickers", qty: 1 },
    ],
  },
  {
    slug: "tiktok-seller-kit",
    name: "TikTok Seller Kit",
    description: "High-volume mailers, thermal labels, and inserts for live sellers.",
    price_cents: 8900, sku: "KIT-TT",
    images: [IMG.kit], inventory_count: 80,
    is_featured: true, is_subscription_eligible: true,
    items: [
      { slug: "poly-10x13", qty: 1 },
      { slug: "thermal-4x6", qty: 1 },
      { slug: "thank-you-cards", qty: 1 },
    ],
  },
  {
    slug: "boutique-shipping-kit",
    name: "Boutique Shipping Kit",
    description: "Curated for fashion + lifestyle: tissue, kraft boxes, branded inserts.",
    price_cents: 11900, sku: "KIT-BTQ",
    images: [IMG.kit], inventory_count: 45,
    is_featured: true, is_subscription_eligible: true,
    items: [
      { slug: "kraft-box-10x8x6", qty: 1 },
      { slug: "tissue-cream", qty: 1 },
      { slug: "thank-you-cards", qty: 1 },
      { slug: "paper-tape-2in", qty: 1 },
    ],
  },
  {
    slug: "sneaker-reseller-kit",
    name: "Sneaker Reseller Kit",
    description: "Sized for boxed sneakers, with tissue + thermal labels.",
    price_cents: 9900, sku: "KIT-SNK",
    images: [IMG.kit], inventory_count: 35,
    is_featured: true, is_subscription_eligible: false,
    items: [
      { slug: "double-wall-14x10x10", qty: 1 },
      { slug: "shoe-tissue", qty: 1 },
      { slug: "thermal-4x6", qty: 1 },
    ],
  },
  {
    slug: "fragile-goods-kit",
    name: "Fragile Goods Kit",
    description: "Double-wall box, honeycomb cushion, fragile labels.",
    price_cents: 10900, sku: "KIT-FRG",
    images: [IMG.kit], inventory_count: 50,
    is_featured: true, is_subscription_eligible: true,
    items: [
      { slug: "double-wall-14x10x10", qty: 1 },
      { slug: "honeycomb-15", qty: 1 },
      { slug: "fragile-stickers", qty: 1 },
      { slug: "clear-tape-2in", qty: 1 },
    ],
  },
  {
    slug: "eco-brand-kit",
    name: "Eco Brand Kit",
    description: "Compostable mailers, paper tape, kraft boxes, honeycomb wrap.",
    price_cents: 12900, sku: "KIT-ECO",
    images: [IMG.kit], inventory_count: 40,
    is_featured: true, is_subscription_eligible: true,
    items: [
      { slug: "compostable-1013", qty: 1 },
      { slug: "paper-tape-2in", qty: 1 },
      { slug: "kraft-box-10x8x6", qty: 1 },
      { slug: "honeycomb-12", qty: 1 },
    ],
  },
];

async function main() {
  console.log("Seeding products…");
  for (const p of products) {
    const { error } = await sb.from("products").upsert(
      {
        ...p,
        is_subscription_eligible: p.is_subscription_eligible ?? true,
        is_eco: p.is_eco ?? false,
        tags: p.tags ?? [],
      },
      { onConflict: "slug" },
    );
    if (error) throw error;
  }

  console.log("Seeding kits…");
  for (const k of kits) {
    const { data: kitProd, error: e1 } = await sb
      .from("products")
      .upsert(
        {
          name: k.name, slug: k.slug, description: k.description,
          category: "kits", price_cents: k.price_cents,
          compare_at_price_cents: k.compare_at_price_cents ?? null,
          sku: k.sku, images: k.images, inventory_count: k.inventory_count,
          is_active: true, is_featured: k.is_featured ?? false,
          is_subscription_eligible: k.is_subscription_eligible ?? true,
          is_eco: false, tags: ["kit"], pack_quantity: 1,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (e1) throw e1;

    await sb.from("kit_items").delete().eq("kit_product_id", kitProd!.id);

    for (const it of k.items) {
      const { data: itemProd, error: e2 } = await sb
        .from("products").select("id").eq("slug", it.slug).single();
      if (e2 || !itemProd) throw e2 || new Error(`missing ${it.slug}`);
      const { error: e3 } = await sb.from("kit_items").insert({
        kit_product_id: kitProd!.id,
        item_product_id: itemProd.id,
        quantity: it.qty,
      });
      if (e3) throw e3;
    }
  }

  console.log("✓ Seed complete");
}

main().catch((e) => { console.error(e); process.exit(1); });
