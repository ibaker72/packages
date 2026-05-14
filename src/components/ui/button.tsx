import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "accent" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-ink-900 text-white hover:bg-ink-800",
  accent: "bg-amber-600 text-white hover:bg-amber-700",
  ghost: "text-ink-900 hover:bg-ink-100",
  outline: "border border-ink-200 text-ink-900 hover:bg-ink-50 bg-white",
};
const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition select-none disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
