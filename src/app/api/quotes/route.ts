import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServiceClient } from "@/lib/supabase/server";
import { email } from "@/lib/resend";

const schema = z.object({
  business_name: z.string().min(1).max(200),
  contact_name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(60).optional().nullable(),
  website: z.string().max(300).optional().nullable(),
  packaging_type: z.string().max(120).optional().nullable(),
  quantity_needed: z.string().max(120).optional().nullable(),
  branding_needed: z.boolean().optional(),
  delivery_location: z.string().max(200).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill out the required fields." }, { status: 400 });
  }
  const sb = createSupabaseServiceClient();
  const { error } = await sb.from("quote_requests").insert({
    ...parsed.data,
    branding_needed: parsed.data.branding_needed ?? false,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Fire-and-forget emails
  email.quoteReceived(parsed.data.email, parsed.data.contact_name);
  if (process.env.ADMIN_EMAIL) email.quoteAdminAlert(process.env.ADMIN_EMAIL, parsed.data);

  return NextResponse.json({ ok: true });
}
