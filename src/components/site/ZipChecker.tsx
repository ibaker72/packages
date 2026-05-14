"use client";

import { useState } from "react";
import { Input, Label } from "@/components/ui/input";
import { LOCAL_DELIVERY_ZIPS } from "@/lib/constants";

export function ZipChecker() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<"local" | "shipping" | null>(null);

  function check(e: React.FormEvent) {
    e.preventDefault();
    const clean = zip.trim().slice(0, 5);
    if (!/^\d{5}$/.test(clean)) {
      setResult(null);
      return;
    }
    setResult(LOCAL_DELIVERY_ZIPS.has(clean) ? "local" : "shipping");
  }

  return (
    <form onSubmit={check} className="surface p-5">
      <Label htmlFor="zip">Check your ZIP</Label>
      <div className="flex gap-2">
        <Input
          id="zip"
          inputMode="numeric"
          placeholder="e.g. 07030"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
          maxLength={5}
        />
        <button className="btn-primary" type="submit">Check</button>
      </div>
      {result === "local" && (
        <div className="mt-3 text-sm text-emerald-700">
          Yes — same-day if you order by 2pm, next-day otherwise.
        </div>
      )}
      {result === "shipping" && (
        <div className="mt-3 text-sm text-ink-600">
          We can ship to your ZIP — 2–4 business days, $9 flat.
        </div>
      )}
    </form>
  );
}
