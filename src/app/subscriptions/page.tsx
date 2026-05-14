import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/site/ProductCard";
import { getProducts } from "@/lib/data";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Restock Subscriptions" };

export default async function SubscriptionsPage() {
  const eligible = await getProducts({ subscriptionOnly: true });
  return (
    <div className="container py-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <Badge tone="best" className="mb-3">Restock subscriptions</Badge>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Set it once. Never run out of supplies again.
          </h1>
          <p className="mt-5 text-ink-600 max-w-md leading-relaxed">
            Pick the items you go through every week. Choose your cadence.
            We'll deliver before your shelf hits zero — pause or cancel any time.
          </p>
          <div className="mt-8 space-y-2 text-sm">
            {[
              "Save 10% on every subscribed line",
              "Weekly, biweekly, or monthly cadence",
              "Auto-reminders 48 hours before each delivery",
              "Swap items or pause from your account",
            ].map((b) => (
              <div key={b} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>{b}</span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/login?next=/subscriptions" className="btn-primary">
              Sign in to start
            </Link>
          </div>
        </div>

        <div className="surface p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-ink-700 mb-2">How it works</div>
          <ol className="space-y-4 text-sm">
            <Step n={1} title="Pick items">Add any subscription-eligible product to your cart and toggle "Subscribe & save."</Step>
            <Step n={2} title="Pick cadence">Choose weekly, biweekly, or monthly at checkout.</Step>
            <Step n={3} title="Get restocked">Each cycle, we ship a fresh kit. Pause or edit from your account.</Step>
          </ol>
        </div>
      </div>

      <div className="mt-16">
        <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">Eligible</div>
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mt-1">Subscribe to any of these</h2>
        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {eligible.slice(0, 12).map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="h-6 w-6 rounded-full bg-ink-900 text-white text-xs grid place-items-center font-semibold flex-shrink-0">{n}</span>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-ink-500">{children}</div>
      </div>
    </li>
  );
}
