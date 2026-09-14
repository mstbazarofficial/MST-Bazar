"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const slides = [
  "/assets/banner.webp",
  "/assets/banner-2.webp",
  "/assets/banner-3.webp",
];

export function HeroSection() {
  return (
    <section className="site-container section-y max-sm:pb-4 max-sm:pt-1.5 w-full">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-[linear-gradient(110deg,#fcfde3_0%,#dcf1df_50%,#c8eacc_100%)]">
        <div className="flex md:items-start items-center flex-col gap-6 relative w-full">
          {/* Swiper & Backdrop Column */}
          <div className="order-first flex w-full items-center justify-center lg:order-last relative md:absolute md:inset-0">
            {/* Soft Shadow Base */}
            <div className="absolute w-44 sm:w-full max-w-xs sm:max-w-md h-10 sm:h-24 bg-black/10 rounded-full blur-lg sm:blur-2xl -bottom-2 sm:-bottom-6 -z-10 pointer-events-none" />

            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              fadeEffect={{ crossFade: true }}
              speed={1500}
              loop
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              className="heroSwiper w-full h-full"
            >
              {slides.map((image, index) => (
                <SwiperSlide key={index}>
                  <Link
                    href="/products"
                    className="relative aspect-4/3 md:aspect-1329/570 w-full overflow-hidden block"
                  >
                    <Image
                      src={image}
                      alt="Daily Fresh Organic Vegetables Basket"
                      fill
                      sizes="(max-width: 1040px) 100vw, 1329px"
                      preload={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      loading="eager"
                      quality={75}
                      className="object-cover object-right md:object-center"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Text & Content Column */}
          <div className="order-last flex flex-col items-center text-center lg:order-first md:items-start md:text-left relative z-10 w-full md:max-w-[52%] lg:max-w-[48%] px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10 justify-center">
            <span className="inline-flex items-center rounded-full border border-primary/20 bg-white px-3 py-1 text-xs font-semibold text-primary shadow-xs">
              Fresh & Healthy
            </span>

            <h1 className="mt-3 text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-extrabold tracking-tight text-foreground leading-snug sm:leading-tight max-w-sm sm:max-w-md md:max-w-none">
              Fresh Grocery Products, Honey & Combo Deals{" "}
              <span className="text-primary block sm:inline mt-1 sm:mt-0">
                Delivered Across Bangladesh
              </span>
            </h1>

            <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground max-w-sm sm:max-w-md leading-relaxed">
              Quality grocery essentials, black seed, and oils delivered to your
              doorstep at affordable prices.
            </p>

            {/* Full Width Stacked CTA Buttons for Mobile */}
            <div className="mt-5 flex w-full flex-col gap-2.5 sm:flex-row sm:w-auto justify-center md:justify-start">
              <Link
                href="/products"
                className={cn(
                  "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-dark hover:bg-[#084820] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-sm active:scale-[0.98]",
                )}
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/about"
                prefetch={false}
                className={cn(
                  "w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFC700] hover:bg-[#E6B400] text-foreground text-sm font-semibold px-6 py-3 rounded-xl transition-all active:scale-[0.98]",
                )}
              >
                <span>About Us</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
