export const SITE_NAME = "PackFlow Supply";
export const SITE_TAGLINE =
  "Packaging supplies for businesses that ship every day.";

// North Jersey ZIPs eligible for same/next-day local delivery.
// Trimmed selection across Essex, Hudson, Bergen, Union, Passaic counties.
export const LOCAL_DELIVERY_ZIPS = new Set<string>([
  // Essex
  "07102", "07103", "07104", "07105", "07106", "07107", "07108", "07109",
  "07042", "07043",
  // Hudson
  "07030", "07086", "07087", "07302", "07304", "07305", "07306", "07307",
  // Bergen
  "07601", "07603", "07604", "07605", "07631", "07650", "07652", "07666",
  // Union
  "07016", "07060", "07083", "07088", "07090", "07201", "07202", "07205",
  // Passaic
  "07011", "07013", "07014", "07055", "07501", "07502", "07503", "07522",
]);

export const SUBSCRIPTION_DISCOUNT = 0.1; // 10% off on subscribed lines
export const LOW_STOCK_THRESHOLD = 20;

export const CATEGORIES: { key: string; label: string; blurb: string }[] = [
  { key: "boxes", label: "Shipping Boxes", blurb: "Single & double wall, kraft + white." },
  { key: "mailers", label: "Poly & Kraft Mailers", blurb: "Durable mailers in every size." },
  { key: "void_fill", label: "Honeycomb Wrap & Void Fill", blurb: "Eco-friendly cushion options." },
  { key: "tape_labels", label: "Tape & Labels", blurb: "Paper, water-activated, thermal." },
  { key: "inserts", label: "Branded Inserts", blurb: "Thank-you cards, tissue, stickers." },
  { key: "kits", label: "Starter Kits", blurb: "Everything to ship, in one box." },
];
