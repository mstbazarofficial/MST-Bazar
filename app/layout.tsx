import { NavigationProgressBar } from "@/components/my-ui/navigation-progress-bar";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mstbazar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  keywords: [
    "MST Bazar",
    "Fresh Grocery Products",
    "Honey in Bangladesh",
    "Organic Products",
    "Combo Deals",
    "Quality Essentials",
    "Online Grocery Shopping",
    "Nationwide Delivery",
  ],
  openGraph: {
    title: "MST Bazar | Fresh Grocery Products & Honey in Bangladesh",
    description:
      "Shop fresh grocery products, honey, black seed, oils, and combo deals from MST Bazar. Quality essentials delivered across Bangladesh.",
    url: siteUrl,
    siteName: "MST Bazar",
    type: "website",
    locale: "en_BD",
    images: [
      {
        url: "/assets/banner2.png",
        width: 1536,
        height: 1024,
        alt: "Fresh grocery products delivered by MST Bazar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MST Bazar | Fresh Grocery Products & Honey in Bangladesh",
    description:
      "Shop fresh grocery products, honey, black seed, oils, and combo deals from MST Bazar. Quality essentials delivered across Bangladesh.",
    images: ["/assets/banner.png"],
    site: "@mstbazar",
    creator: "@mstbazar",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "./",
    languages: {
      "en-BD": "./",
      "x-default": "./",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "MST Bazar",
      url: siteUrl,
      logo: `${siteUrl}/assets/logo-vertical.png`,
      email: "mstbazarofficial@gmail.com",
      telephone: "+8801581172773",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Aftab nagar, Dhaka",
        addressLocality: "Dhaka",
        postalCode: "1205",
        addressCountry: "BD",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "MST Bazar",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-BD",
    },
  ],
};

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col bg-background">
        {" "}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
