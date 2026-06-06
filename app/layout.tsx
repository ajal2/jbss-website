import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

const SITE_TITLE = "JBSS LLP — Waste infrastructure, built and operated";
const SITE_DESC =
  "Jalota Business Support Services LLP. Construction & Demolition processing plants and municipal sanitation systems — delivered turnkey, then run for up to 15 years.";
const SITE_URL = "https://jbssgroup.com";

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESC,
  // metadataBase makes any relative URLs (e.g., og-image.jpg below) resolve
  // against the production domain when Next builds OG tags.
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    type: "website",
    locale: "en_IN",
    siteName: "JBSS LLP",
    url: SITE_URL,
    // Drop a 1200x630 image at /public/og-image.jpg when ready and this
    // will pick it up automatically. Until then, link previews fall back
    // to title + description only — still a clean unfurl.
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "JBSS LLP — waste infrastructure",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${spaceMono.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <Nav />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
