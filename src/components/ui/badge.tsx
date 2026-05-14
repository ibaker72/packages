import * as React from "react";
import { cn } from "@/lib/utils";

type Tone = "default" | "eco" | "best" | "bulk" | "local" | "danger";

const tones: Record<Tone, string> = {
  default: "bg-ink-100 text-ink-700",
  eco: "bg-emerald-100 text-emerald-800",
  best: "bg-amber-100 text-amber-800",
  bulk: "bg-sky-100 text-sky-800",
  local: "bg-ink-900 text-white",
  danger: "bg-red-100 text-red-800",
};

export function Badge({
  tone = "default",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
