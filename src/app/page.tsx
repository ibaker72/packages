import Link from "next/link";
import { ArrowRight, BoxIcon, Leaf, Repeat, Sparkles, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES } from "@/lib/constants";
import { getFeaturedKits, getFeaturedProducts } from "@/lib/data";
import { ZipChecker } from "@/components/site/ZipChecker";

export default async function Home() {
  const [kits, featured] = await Promise.all([getFeaturedKits(6), getFeaturedProducts(8)]);

  return (
    <>
      {/* Hero */}
      <section className="relative gradient-hero text-ink-50 overflow-hidden">
        <div className="grain absolute inset-0" />
        <div className="container relative py-20 md:py-28">
          <Badge tone="local" className="mb-6 bg-white/10 text-white border border-white/15">
            <Sparkles className="h-3 w-3 mr-1" /> Same-day delivery across North Jersey
          </Badge>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight max-w-3xl leading-[1.05]">
            Packaging supplies for businesses that ship every day.
          </h1>
          <p className="mt-6 text-ink-200 max-w-xl text-base md:text-lg leading-relaxed">
            Boxes, mailers, tape, honeycomb wrap, branded inserts, and monthly
            restock kits — delivered locally or shipped nationwide.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kits" className="btn-accent">
              Shop Packaging Kits <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/custom-packaging" className="btn-outline bg-white/5 border-white/15 text-white hover:bg-white/10">
              Request Custom Quote
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            {[
              { icon: Truck, label: "Local NJ delivery" },
              { icon: BoxIcon, label: "Bulk pricing" },
              { icon: Leaf, label: "Eco options" },
              { icon: Sparkles, label: "Custom branding" },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-ink-200">
                <t.icon className="h-4 w-4 text-amber-400" />
                {t.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container py-16">
        <SectionHeader
          eyebrow="Catalog"
          title="Popular categories"
          link={{ href: "/products", label: "Browse all products" }}
        />
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              href={c.key === "kits" ? "/kits" : `/products?category=${c.key}`}
              className="surface p-5 hover:border-ink-300 transition flex items-start justify-between"
            >
              <div>
                <div className="font-medium">{c.label}</div>
                <div className="text-sm text-ink-500 mt-1">{c.blurb}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-ink-400 mt-1" />
            </Link>
          ))}
        </div>
      </section>

      {/* Best-selling kits */}
      <section className="container py-8">
        <SectionHeader
          eyebrow="Curated"
          title="Best-selling kits"
          subtitle="Everything you need to start shipping, in one box."
          link={{ href: "/kits", label: "All kits" }}
        />
        {kits.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {kits.map((k) => <ProductCard key={k.id} p={k} />)}
          </div>
        ) : (
          <EmptyShelf label="Connect Supabase and run the seed script to populate kits." />
        )}
      </section>

      {/* Subscriptions pitch */}
      <section className="container py-16">
        <div className="surface-dark relative overflow-hidden grid md:grid-cols-2">
          <div className="grain absolute inset-0" />
          <div className="relative p-10 md:p-14">
            <Badge tone="local" className="mb-5 bg-white/10 text-white border border-white/15">
              <Repeat className="h-3 w-3 mr-1" /> Restock subscriptions
            </Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Never run out of shipping supplies again.
            </h2>
            <p className="mt-4 text-ink-200 max-w-md">
              Set a cadence — weekly, biweekly, or monthly — and we'll deliver your
              kit before your shelf hits zero. Pause, edit, or cancel anytime.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/subscriptions" className="btn-accent">
                Set up a restock <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/kits" className="btn-outline bg-transparent border-white/20 text-white hover:bg-white/5">
                Browse kits
              </Link>
            </div>
          </div>
          <div className="relative p-10 md:p-14 hidden md:flex items-center">
            <ul className="space-y-4 text-ink-100">
              {[
                "Pause or change cadence with one click",
                "Save 10% on every subscribed line",
                "Auto-reminders before each delivery",
                "Same kit, every time — or swap it",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container py-8">
        <SectionHeader
          eyebrow="Top sellers"
          title="What ships out the door most"
          link={{ href: "/products", label: "All products" }}
        />
        {featured.length > 0 ? (
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        ) : (
          <EmptyShelf label="No products yet — run `pnpm seed` after configuring Supabase." />
        )}
      </section>

      {/* Custom packaging CTA */}
      <section className="container py-16">
        <div className="surface p-8 md:p-12 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center">
          <div>
            <Badge tone="best" className="mb-3">Custom</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Branded packaging that looks like a brand, not a label maker.
            </h2>
            <p className="mt-4 text-ink-600 max-w-lg">
              Logo stickers, branded mailers, custom boxes, thank-you cards,
              tissue paper, QR inserts. Send us your assets — we'll send samples and pricing.
            </p>
            <div className="mt-6 flex gap-3">
              <Link href="/custom-packaging" className="btn-primary">
                Request a quote <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {["Logo stickers","Branded mailers","Custom boxes","Thank-you cards","Tissue paper","QR inserts"].map((t) => (
              <div key={t} className="rounded-xl border border-ink-100 bg-ink-50 px-3 py-2 font-medium">{t}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Local delivery */}
      <section className="container py-8">
        <div className="surface p-8 md:p-12 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <Badge tone="local" className="mb-3">Local</Badge>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Serving North Jersey businesses first.
            </h2>
            <p className="mt-4 text-ink-600 max-w-md">
              Order by 2pm for same-day delivery in Essex, Hudson, Bergen, Union,
              and Passaic counties. Everywhere else ships in 2–4 business days.
            </p>
          </div>
          <ZipChecker />
        </div>
      </section>

      {/* Final CTA */}
      <section className="container py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Stop running out of boxes.
          </h2>
          <p className="mt-4 text-ink-600">
            Set up a restock in 90 seconds, or order one-off for tomorrow's pickup.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/subscriptions" className="btn-primary">Start a restock</Link>
            <Link href="/products" className="btn-outline">Shop supplies</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({
  eyebrow, title, subtitle, link,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
      <div>
        <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">{eyebrow}</div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">{title}</h2>
        {subtitle && <p className="text-ink-500 mt-1.5">{subtitle}</p>}
      </div>
      {link && (
        <Link href={link.href} className="text-sm font-medium text-ink-700 hover:text-ink-900 inline-flex items-center gap-1">
          {link.label} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function EmptyShelf({ label }: { label: string }) {
  return (
    <div className="mt-8 surface p-10 text-center text-ink-500 text-sm">
      {label}
    </div>
  );
}
