import type { Metadata } from "next";
import { Silkscreen, Space_Mono } from "next/font/google";
import { Scenery } from "@/components/pixel/Scenery";
import { ImageGuard } from "@/components/ui/ImageGuard";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const pixel = Silkscreen({
  variable: "--font-silkscreen",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const mono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

const DESCRIPTION =
  "Portfolio of Muhammad Iqbal, an electrical engineer from Bandung working on IoT, microcontrollers and project management.";

export const metadata: Metadata = {
  // Lets Next turn relative paths ("/", "/opengraph-image.png") into full https:// links.
  metadataBase: new URL(SITE_URL),
  // Other pages set their own title, e.g. "Art gallery" becomes "Art gallery · Muhammad Iqbal".
  title: {
    default: "Iqbal.exe",
    template: "%s · Muhammad Iqbal",
  },
  description: DESCRIPTION,
  // The one official address of this page (avoids duplicates like /?ref=... in Google).
  alternates: { canonical: "/" },
  // The preview card when the link is shared on LinkedIn, WhatsApp, Facebook, X...
  // The image itself is src/app/opengraph-image.png (Next adds it automatically).
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Muhammad Iqbal",
    title: "Muhammad Iqbal · IoT & Project Control",
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
  // Keep the pages in Google, but ask search engines not to list the pictures in image search.
  robots: { index: true, follow: true, noimageindex: true },
  // Proves to Google Search Console that this site is mine. Don't remove it later.
  verification: { google: "-0mrVU6BbBnlqD3Otw-_jELtKyheAITzcHWhXB-aPlo" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: page changes jump instantly; same-page links keep the smooth scroll from theme.css.
    <html lang="en" data-scroll-behavior="smooth" className={`${pixel.variable} ${mono.variable} antialiased`}>
      <body>
        <Scenery />
        <ImageGuard />
        {children}
      </body>
    </html>
  );
}