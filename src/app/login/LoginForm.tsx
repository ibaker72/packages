"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Label } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const next = useSearchParams().get("next") || "/account";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const sb = createSupabaseBrowserClient();
    const fn = mode === "signin"
      ? sb.auth.signInWithPassword({ email, password })
      : sb.auth.signUp({ email, password });
    const { error } = await fn;
    setLoading(false);
    if (error) { setMsg(error.message); return; }
    if (mode === "signup") {
      setMsg("Check your email to confirm, then sign in.");
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="container py-16 max-w-md">
      <h1 className="text-3xl font-semibold tracking-tight">
        {mode === "signin" ? "Welcome back." : "Create your account."}
      </h1>
      <p className="text-ink-500 mt-2">
        {mode === "signin" ? "Sign in to manage orders and subscriptions." : "Start ordering supplies in minutes."}
      </p>
      <form onSubmit={submit} className="mt-8 space-y-4 surface p-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {msg && <div className="text-sm text-amber-700">{msg}</div>}
        <button disabled={loading} className="btn-primary w-full">
          {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
        <button type="button" onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-xs text-ink-500 hover:text-ink-900 w-full text-center">
          {mode === "signin" ? "No account yet? Sign up" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
}
