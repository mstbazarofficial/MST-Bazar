import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden text-primary-foreground site-container section-y ">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10 rounded-md bg-linear-to-r from-primary via-primary-dark to-primary p-6 pl-10 shadow-lg overflow-hidden">
        {/* Left Side: Call to Action Text & Button */}
        <div className="lg:col-span-6 space-y-4 text-left z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
            Join Thousands of Happy Families
          </h2>

          <p className="text-xs sm:text-sm text-emerald-100 font-medium">
            Choose pure, stay healthy with MST Bazar.
          </p>

          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-[#FFC700] hover:bg-[#E6B400] text-gray-900 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-4 h-4 stroke-3" />
            </Link>
          </div>
        </div>

        {/* Right Side: Organic Products Image Banner */}
        <div className="absolute inset-0 w-full">
          <Image
            src="/assets/CTRbanner.png"
            alt="MST Bazar Organic Products Jars and Bottles"
            fill
            className="object-cover object-center lg:object-right"
          />
        </div>
      </div>
    </section>
  );
}
