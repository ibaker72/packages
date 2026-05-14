"use client";

import { useState } from "react";
import { Input, Label, Select, Textarea } from "@/components/ui/input";

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErr(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      business_name: fd.get("business_name"),
      contact_name: fd.get("contact_name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      website: fd.get("website"),
      packaging_type: fd.get("packaging_type"),
      quantity_needed: fd.get("quantity_needed"),
      branding_needed: fd.get("branding_needed") === "on",
      delivery_location: fd.get("delivery_location"),
      notes: fd.get("notes"),
    };
    const res = await fetch("/api/quotes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setStatus("err"); setErr(json.error || "Something went wrong"); return; }
    setStatus("ok");
    form.reset();
  }

  if (status === "ok") {
    return (
      <div className="surface p-8">
        <div className="text-xl font-semibold">Got it — we'll be in touch.</div>
        <p className="text-ink-500 mt-2">
          Look for an email from our team within one business day with samples and pricing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="surface p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="business_name">Business name *</Label>
          <Input id="business_name" name="business_name" required />
        </div>
        <div>
          <Label htmlFor="contact_name">Your name *</Label>
          <Input id="contact_name" name="contact_name" required />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="website">Website / IG</Label>
          <Input id="website" name="website" placeholder="https://" />
        </div>
        <div>
          <Label htmlFor="packaging_type">Packaging type</Label>
          <Select id="packaging_type" name="packaging_type" defaultValue="">
            <option value="">Select…</option>
            <option>Custom mailers</option>
            <option>Custom boxes</option>
            <option>Branded inserts / thank-you cards</option>
            <option>Tissue / void fill</option>
            <option>Stickers / labels</option>
            <option>Other</option>
          </Select>
        </div>
        <div>
          <Label htmlFor="quantity_needed">Approx. quantity</Label>
          <Input id="quantity_needed" name="quantity_needed" placeholder="e.g. 500 mailers" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="delivery_location">Delivery location</Label>
          <Input id="delivery_location" name="delivery_location" placeholder="City, State, ZIP" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="notes">Anything else</Label>
          <Textarea id="notes" name="notes" rows={4} placeholder="Brand colors, deadlines, references…" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="branding_needed" defaultChecked className="h-4 w-4 accent-amber-600" />
        I need full brand printing
      </label>

      {err && <div className="text-sm text-red-700">{err}</div>}

      <button disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? "Sending…" : "Request quote"}
      </button>
      <p className="text-xs text-ink-500 text-center">
        We never share your info. Typical response within 1 business day.
      </p>
    </form>
  );
}
