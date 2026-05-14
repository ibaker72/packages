import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { ClearCartOnMount } from "@/components/site/ClearCartOnMount";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="container py-20 text-center max-w-xl mx-auto">
      <ClearCartOnMount />
      <CheckCircle2 className="h-12 w-12 mx-auto text-emerald-600" />
      <h1 className="text-3xl md:text-4xl font-semibold tracking-tight mt-4">Order confirmed.</h1>
      <p className="text-ink-500 mt-3">
        We'll email a receipt and tracking link as soon as it ships.
        {sp.session_id && (
          <span className="block mt-2 text-xs text-ink-400">Ref: {sp.session_id.slice(-12)}</span>
        )}
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/account/orders" className="btn-primary">View your orders</Link>
        <Link href="/products" className="btn-outline">Keep shopping</Link>
      </div>
    </div>
  );
}
