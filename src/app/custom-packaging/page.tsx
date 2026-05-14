import { QuoteForm } from "@/components/site/QuoteForm";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Custom Packaging" };

export default function CustomPackagingPage() {
  return (
    <div className="container py-10 grid lg:grid-cols-[1.1fr_1fr] gap-10">
      <div>
        <Badge tone="best" className="mb-3">Custom</Badge>
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          Branded packaging, sourced and printed for operators.
        </h1>
        <p className="mt-5 text-ink-600 max-w-md leading-relaxed">
          Tell us what you ship, what you want printed, and how fast you need it.
          Within one business day we'll send samples and pricing — at MOQs that
          actually work for small brands.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-3 max-w-sm">
          {[
            "Logo stickers",
            "Branded mailers",
            "Custom kraft boxes",
            "Thank-you cards",
            "Tissue paper",
            "QR insert cards",
          ].map((t) => (
            <div key={t} className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-sm font-medium">
              {t}
            </div>
          ))}
        </div>

        <div className="mt-10 hairline pt-6 text-sm text-ink-500 space-y-2">
          <div>• MOQs from 100 units</div>
          <div>• 7–14 day production for most projects</div>
          <div>• Free design review on uploaded assets</div>
        </div>
      </div>

      <QuoteForm />
    </div>
  );
}
