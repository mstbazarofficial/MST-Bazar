import { NavigationProgressBar } from "@/components/my-ui/navigation-progress-bar";
import { Toaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

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
        <Suspense fallback={null}>
          <NavigationProgressBar />
        </Suspense>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
