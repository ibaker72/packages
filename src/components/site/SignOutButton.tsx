"use client";

import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const sb = createSupabaseBrowserClient();
    await sb.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return <button onClick={signOut} className="btn-outline">Sign out</button>;
}
