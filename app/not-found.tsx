import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home, ShoppingBag, Headphones, Tag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const helpFeatures = [
    {
      icon: Headphones,
      title: "Customer Support",
      desc: "24/7 Support",
      href: "/contact",
    },
    {
      icon: ShoppingBag,
      title: "Browse Products",
      desc: "Find your needs",
      href: "/categories",
    },
    {
      icon: Tag,
      title: "Latest Offers",
      desc: "Grab best deals",
      href: "/offers",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Across Bangladesh",
      href: "/shipping-info",
    },
  ];

  return (
    <div className="relative min-h-screen w-full bg-white flex flex-col justify-between overflow-x-hidden text-slate-800 antialiased">
      {/* ----------------- Top Header Bar ----------------- */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between z-20">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 group"></Link>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#25732D] transition-colors duration-200"
        >
          <Home className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* ----------------- Main Hero Section ----------------- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 z-10">
        <div className="w-full max-w-5xl flex flex-col items-center text-center">
          {/* If using static 3D basket graphic: */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src="/assets/404.png"
              alt="404 Basket"
              width={600}
              height={600}
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center mb-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Oops! Page Not Found
            </h1>
            <div className="w-8 h-1 bg-[#25732D] rounded-full mt-2" />
          </div>

          {/* Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full max-w-xs sm:max-w-none justify-center mb-12">
            <Button className="w-full sm:w-auto min-w-47.5 h-11 bg-[#25732D] hover:bg-[#1E5D24] text-white font-medium shadow-sm transition-all rounded-lg">
              <Link href="/" className="flex items-center justify-center gap-2">
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="w-full sm:w-auto min-w-47.5 h-11 border-[#25732D] text-[#25732D] hover:bg-[#F2F8F1] hover:text-[#1E5D24] font-medium transition-all rounded-lg"
            >
              <Link
                href="/shop"
                className="flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </Button>
          </div>

          {/* ----------------- Need Help? Card ----------------- */}
          <div className="w-full max-w-5xl bg-[#F4F8F3] border border-[#E3EDE1] rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-0.5">
              Need Help?
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              We&apos;re here to assist you!
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4">
              {helpFeatures.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="flex flex-col items-center text-center group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-full flex items-center justify-center mb-2.5 text-[#25732D] group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="w-7 h-7" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-xs sm:text-sm font-semibold text-slate-800 mb-0.5 group-hover:text-[#25732D] transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-[11px] sm:text-xs text-slate-500">
                    {item.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ----------------- Bottom Curved Decorative Wave ----------------- */}
      <footer className="w-full pointer-events-none -mt-4 leading-none">
        <svg
          className="w-full h-12 sm:h-20 text-[#25732D]"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,40 C320,110 420,10 720,60 C1020,110 1140,20 1440,50 L1440,120 L0,120 Z"
            fill="currentColor"
            opacity="0.25"
          />
          <path
            d="M0,70 C360,130 500,40 800,80 C1100,120 1220,50 1440,80 L1440,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </footer>
    </div>
  );
}
