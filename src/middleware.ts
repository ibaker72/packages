import { NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({ request: req });
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return res;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll(toSet: { name: string; value: string; options: CookieOptions }[]) {
          toSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    },
  );
  await supabase.auth.getUser();
  return res;
}

export const config = {
  matcher: ["/((?!_next/|api/stripe/webhook|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|gif|webp|ico)).*)"],
};
