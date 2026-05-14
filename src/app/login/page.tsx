import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container py-16 text-ink-500">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
