import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { StickyCartBar } from "@/components/site/StickyCartBar";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants";

export const metadata: Metadata = {
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s · ${SITE_NAME}` },
  description:
    "Boxes, mailers, tape, honeycomb wrap, branded inserts, and monthly restock kits — delivered locally in North Jersey or shipped nationwide.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
};

export const viewport: Viewport = {
  themeColor: "#0A0A07",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="min-h-[calc(100dvh-4rem)]">{children}</main>
        <Footer />
        <StickyCartBar />
      </body>
    </html>
  );
}
