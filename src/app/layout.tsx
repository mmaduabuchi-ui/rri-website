import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.realise-reality.org"),
  title: {
    default: "Realise Reality Initiative | RRI",
    template: "%s | Realise Reality Initiative",
  },
  description:
    "Helping you see life through the lens of truth. A global community committed to critical thinking, personal growth, conscious living, and humanitarian support.",
  keywords: [
    "Realise Reality Initiative",
    "RRI",
    "critical thinking",
    "personal growth",
    "humanitarian",
    "conscious living",
    "truth",
    "philosophy",
  ],
  authors: [{ name: "Realise Reality Initiative" }],
  creator: "Realise Reality Initiative",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.realise-reality.org",
    title: "Realise Reality Initiative | RRI",
    description:
      "Helping you see life through the lens of truth. A global community committed to critical thinking, personal growth, conscious living, and humanitarian support.",
    siteName: "Realise Reality Initiative",
  },
  twitter: {
    card: "summary_large_image",
    title: "Realise Reality Initiative | RRI",
    description:
      "Helping you see life through the lens of truth. A global community committed to critical thinking, personal growth, conscious living, and humanitarian support.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Organization Schema (JSON-LD) helps Google link your social profiles to your site
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Realise Reality Initiative",
    alternateName: "RRI",
    url: "https://www.realise-reality.org",
    logo: "https://www.realise-reality.org/images/logo.png", // Update this path if your logo has a different filename
    description:
      "Helping you see life through the lens of truth. A global community committed to critical thinking, personal growth, conscious living, and humanitarian support.",
    sameAs: [
      "https://www.facebook.com/share/1QANYQ1r6k/",
      "https://www.instagram.com/realiserealityinitiative",
      "https://www.tiktok.com/@realiserealityinitiative",
      "https://youtube.com/@realiserealityinitiativerri",
    ],
  };

  return (
    <html lang="en">
      <body className={`${inter.className} flex min-h-screen flex-col bg-white text-gray-900`}>
        {/* Inject JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}