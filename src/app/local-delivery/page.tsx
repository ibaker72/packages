import { Badge } from "@/components/ui/badge";
import { ZipChecker } from "@/components/site/ZipChecker";
import { Truck, Clock, MapPin } from "lucide-react";

export const metadata = { title: "Local Delivery — North Jersey" };

export default function LocalDeliveryPage() {
  return (
    <div className="container py-10">
      <div className="grid lg:grid-cols-2 gap-10 items-start">
        <div>
          <Badge tone="local" className="mb-3">North Jersey</Badge>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
            Same-day delivery for businesses that ship today.
          </h1>
          <p className="mt-5 text-ink-600 max-w-md leading-relaxed">
            Order by 2pm and we deliver same day to Essex, Hudson, Bergen,
            Union, and Passaic. After 2pm? It's on your doorstep next morning.
          </p>

          <div className="mt-8 space-y-4 text-sm">
            <Row icon={<Clock className="h-4 w-4" />} title="Order by 2pm">Same-day local delivery, M–F.</Row>
            <Row icon={<MapPin className="h-4 w-4" />} title="Free over $75">In eligible NJ ZIPs.</Row>
            <Row icon={<Truck className="h-4 w-4" />} title="Nationwide too">Everywhere else: $9 flat, 2–4 business days.</Row>
          </div>
        </div>

        <ZipChecker />
      </div>
    </div>
  );
}

function Row({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="h-8 w-8 rounded-full bg-ink-900 text-white grid place-items-center">{icon}</div>
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-ink-500">{children}</div>
      </div>
    </div>
  );
}
