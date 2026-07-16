import type { Metadata } from "next";
import { Cinzel, Source_Sans_3 } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getSiteSettings } from "@/lib/sanity.client";
import "./globals.css";

const display = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sans = Source_Sans_3({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: {
    default: "Bilgewater Market",
    template: "%s · Bilgewater Market",
  },
  description:
    "Premium Riftbound TCG. Browse inventory, express interest, and join the weekly list.",
  openGraph: {
    title: "Bilgewater Market",
    description: "Premium Riftbound TCG — verified cards, dockside.",
    images: ["/brand/bilgewater-market-hero.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="grain bg-bilgewater flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
