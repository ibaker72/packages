import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <div className="text-xs uppercase tracking-wider text-amber-700 font-semibold">404</div>
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mt-2">We couldn't find that.</h1>
      <p className="text-ink-500 mt-3">Try browsing the catalog or jumping back home.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="btn-primary">Home</Link>
        <Link href="/products" className="btn-outline">Products</Link>
      </div>
    </div>
  );
}
