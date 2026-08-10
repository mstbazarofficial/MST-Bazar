import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    // Outer wrapper for vertical and horizontal padding
    <section className="site-container section-y w-full">
      {/* Inner card with background gradient */}
      <div className="relative overflow-hidden rounded-3xl bg-[linear-gradient(110deg,#fcfde3_0%,#dcf1df_50%,#c8eacc_100%)]">
        <div className="site-container grid items-center gap-8 py-8 sm:py-12 lg:grid-cols-2 lg:gap-12 lg:py-16">
          {/* Right Column: Basket Image & Organic Backdrop (Restored to exact original) */}
          <div className="order-first flex w-full items-center justify-center lg:order-last lg:w-140 lg:justify-end relative top-8 right-5 z-10">
            <div className="absolute max-sm:hidden w-60 h-60 bg-[#bce3c4] rounded-full right-6 bottom-10"></div>
            <div className="absolute max-sm:hidden w-40 h-40 bg-[#bce3c4] rounded-full left-6 bottom-10"></div>
            <div className="absolute max-sm:hidden w-80 h-80 bg-[#bce3c4] rounded-full right-1/2 translate-x-40 bottom-10"></div>

            <div className="absolute w-120 h-120 bg-black/15 rotate-x-70 rounded-full right-1/2 translate-x-60 -bottom-45 blur-2xl"></div>

            <div className="relative w-full aspect-16/10 sm:aspect-video">
              <Image
                src="/assets/banner.png"
                alt="Daily Fresh Organic Vegetables Basket"
                width={600}
                height={600}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
                quality={75}
                className="object-contain drop-shadow-xl"
              />
            </div>
          </div>

          {/* Left Column: Text & Buttons (Restored heading sizes & original structure) */}
          <div className="order-last flex flex-col items-center text-center lg:order-first lg:items-start lg:text-left">
            <span className="inline-flex items-center rounded-md border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary shadow-sm">
              Fresh & Healthy
            </span>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              <span className="text-foreground">Daily Fresh Products</span>
              <br />
              <span className="text-primary">Delivered to Your Doorstep</span>
            </h1>

            <p className="mt-4 max-w-md text-sm text-muted-foreground sm:text-base">
              Best quality grocery items at affordable prices. Fast delivery
              across Bangladesh.
            </p>

            <div className="mt-6 flex w-full max-w-xs flex-col gap-3 sm:max-w-none sm:w-auto sm:flex-row">
              <Link
                href="/products"
                className={cn(
                  "inline-flex items-center gap-2.5 bg-primary-dark hover:bg-[#084820] text-white text-sm font-semibold px-6 py-3.5 rounded-md transition-all shadow-sm active:scale-95",
                )}
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/offers"
                className={cn(
                  "inline-flex items-center gap-2 bg-[#FFC700] hover:bg-[#E6B400] text-foreground text-sm font-semibold px-6 py-3.5 rounded-md transition-all active:scale-95",
                )}
              >
                <span>View Offers</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
