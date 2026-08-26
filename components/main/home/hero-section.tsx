"use client";

import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-fade";

const slides = [
  "/assets/banner.png",
  "/assets/banner2.png",
  "/assets/banner3.png",
];

export function HeroSection() {
  return (
    <section className="site-container section-y max-sm:pb-4 max-sm:pt-1.5 w-full ">
      {/* Card Container */}
      <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-[linear-gradient(110deg,#fcfde3_0%,#dcf1df_50%,#c8eacc_100%)]">
        <div className="flex md:items-start items-center flex-col gap-6 pb-6 md:px-7 md:py-6 lg:12 xl:py-16 relative w-full">
          {/* Swiper & Backdrop Column */}
          <div className="order-first flex w-full items-center justify-center lg:order-last relative md:absolute md:inset-0">
            {/* Responsive Organic Backdrop Shapes */}
            {/* <div className="absolute hidden sm:block w-48 h-48 lg:w-60 lg:h-60 bg-[#bce3c4] rounded-full right-4 bottom-8 -z-10 pointer-events-none" />
            <div className="absolute hidden sm:block w-32 h-32 lg:w-40 lg:h-40 bg-[#bce3c4] rounded-full left-4 bottom-8 -z-10 pointer-events-none" />
            <div className="absolute hidden sm:block w-64 h-64 lg:w-80 lg:h-80 bg-[#bce3c4] rounded-full left-1/2 -translate-x-1/2 bottom-8 -z-10 pointer-events-none" /> */}

            {/* Soft Shadow Base */}
            <div className="absolute w-44 sm:w-full max-w-xs sm:max-w-md h-10 sm:h-24 bg-black/10 rounded-full blur-lg sm:blur-2xl -bottom-2 sm:-bottom-6 -z-10 pointer-events-none" />

            {/* Constrained Swiper Container Width for Mobile */}
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
              className="heroSwiper w-full"
            >
              {slides.map((image, index) => (
                <SwiperSlide key={index}>
                  <Link
                    href="/products"
                    className="relative aspect-video w-full overflow-hidden block"
                  >
                    <Image
                      src={image}
                      alt="Daily Fresh Organic Vegetables Basket"
                      fill
                      sizes="(max-width: 1024px) 80vw, 60vw"
                      preload={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      loading="eager"
                      quality={60}
                      className="object- object-center drop-shadow-md sm:drop-shadow-xl"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Text & Content Column */}
          <div className="order-last flex flex-col items-center text-center lg:order-first md:items-start md:text-left relative z-10 md:max-w-100 xl:max-w-150 lg:max-w-102 max-sm:px-4">
            <span className="inline-flex items-center rounded-md border border-primary/20 bg-white px-3 py-1 text-xs font-medium text-primary shadow-sm">
              Fresh & Healthy
            </span>

            <h1 className="mt-3 sm:mt-4 text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl xl:text-5xl">
              <span className="text-foreground">
                Fresh Grocery Products, Honey & Combo Deals
              </span>
              <br />
              <span className="text-primary">Delivered Across Bangladesh</span>
            </h1>

            <p className="mt-2 sm:mt-3 max-w-md text-xs md:text-base text-muted-foreground">
              Quality grocery essentials, black seed, and oils delivered to your
              doorstep at affordable prices.{""}
            </p>

            <div className="mt-5 lg:mt-6 flex w-full max-w-xs flex-col gap-2.5 sm:gap-3 sm:max-w-none sm:w-auto sm:flex-row">
              <Link
                href="/products"
                className={cn(
                  "inline-flex items-center justify-center gap-2.5 bg-primary-dark hover:bg-[#084820] text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-md transition-all shadow-sm active:scale-95",
                )}
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <Link
                href="/about"
                prefetch={false}
                className={cn(
                  "inline-flex items-center justify-center gap-2 bg-[#FFC700] hover:bg-[#E6B400] text-foreground text-xs sm:text-sm font-semibold px-5 sm:px-6 py-3 sm:py-3.5 rounded-md transition-all active:scale-95",
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
