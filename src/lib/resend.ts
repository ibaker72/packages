import { Resend } from "resend";

let _resend: Resend | null = null;
function client() {
  if (_resend) return _resend;
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  _resend = new Resend(key);
  return _resend;
}

const FROM = "PackFlow Supply <orders@packflow.supply>";

async function send(to: string, subject: string, html: string) {
  const r = client();
  if (!r) {
    console.warn("[resend] skipped (no key)", { to, subject });
    return;
  }
  try {
    await r.emails.send({ from: FROM, to, subject, html });
  } catch (e) {
    console.error("[resend] send failed", e);
  }
}

const wrap = (inner: string) => `
  <div style="font-family:ui-sans-serif,system-ui,Inter,Arial,sans-serif;background:#F7F7F6;padding:32px;color:#17160F;">
    <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid #EDEDEB;border-radius:16px;padding:32px;">
      <div style="font-weight:700;font-size:18px;letter-spacing:-0.01em;margin-bottom:24px;">PackFlow Supply</div>
      ${inner}
      <hr style="border:none;border-top:1px solid #EDEDEB;margin:24px 0;"/>
      <div style="font-size:12px;color:#86857D;">PackFlow Supply · North Jersey · packflow.supply</div>
    </div>
  </div>`;

export const email = {
  quoteReceived: (to: string, name: string) =>
    send(
      to,
      "We got your custom packaging request",
      wrap(`<p>Hi ${name || "there"},</p>
            <p>Thanks for reaching out — we've received your custom packaging request and a member of our team will follow up within one business day with samples and pricing.</p>
            <p>— The PackFlow team</p>`),
    ),
  quoteAdminAlert: (to: string, payload: Record<string, unknown>) =>
    send(
      to,
      "New quote request",
      wrap(`<p><strong>New quote request</strong></p>
            <pre style="background:#F7F7F6;border-radius:8px;padding:12px;font-size:12px;overflow:auto;">${escapeHtml(
              JSON.stringify(payload, null, 2),
            )}</pre>`),
    ),
  orderConfirmation: (to: string, orderId: string, totalCents: number) =>
    send(
      to,
      `Order confirmed — ${orderId.slice(0, 8).toUpperCase()}`,
      wrap(`<p>Thanks for your order.</p>
            <p>Order ID: <strong>${orderId.slice(0, 8).toUpperCase()}</strong><br/>
            Total: <strong>$${(totalCents / 100).toFixed(2)}</strong></p>
            <p>We'll email you a tracking link as soon as your shipment is on the way.</p>`),
    ),
  subscriptionStarted: (to: string, cadence: string) =>
    send(
      to,
      "Your PackFlow restock subscription is live",
      wrap(`<p>Your <strong>${cadence}</strong> restock is set up. You can pause or change cadence anytime from your account.</p>`),
    ),
};

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
