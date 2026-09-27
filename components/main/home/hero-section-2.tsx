"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

type HeroBanner = {
  id: string;
  title: string | null;
  imageUrl: string;
  linkUrl: string | null;
};

interface HeroSectionProps {
  sliderBanners: HeroBanner[];
  sideBanner: HeroBanner | null;
}

export function HeroSection2({ sliderBanners, sideBanner }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const hasSlider = sliderBanners.length > 0;
  const canLoop = sliderBanners.length > 1;

  if (!hasSlider && !sideBanner) return null;

  return (
    <section className="site-container section-y w-full max-sm:pb-4 max-sm:pt-1.5">
      {/* 
        Grid setup:
        - Mobile/Tablet: 1 column
        - Large screens (lg): 5fr (Left Slider) to 2fr (Right Square Banner)
        This math (5:2 ratio + square side) ensures perfect equal height with ZERO image clipping.
      */}
      <div
        className={cn(
          "grid gap-3 sm:gap-4 lg:gap-5",
          sideBanner ? "grid-cols-1 lg:grid-cols-[5fr_2fr]" : "grid-cols-1",
        )}
      >
        {/* Left Slider Column */}
        {hasSlider && (
          <div className="group relative aspect-[5/2] w-full overflow-hidden rounded-2xl bg-muted lg:rounded-3xl">
            <Swiper
              modules={[Autoplay]}
              speed={600}
              loop={canLoop}
              autoplay={
                canLoop ? { delay: 4200, disableOnInteraction: false } : false
              }
              onSwiper={(s) => (swiperRef.current = s)}
              onSlideChange={(s) => setActiveIndex(s.realIndex)}
              className="h-full w-full"
            >
              {sliderBanners.map((banner, index) => {
                const image = (
                  <div className="relative h-full w-full">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title || "Promotional banner"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      quality={90}
                      className="object-cover"
                    />
                  </div>
                );

                return (
                  <SwiperSlide key={banner.id}>
                    {banner.linkUrl ? (
                      <Link
                        href={banner.linkUrl}
                        className="block h-full w-full"
                      >
                        {image}
                      </Link>
                    ) : (
                      image
                    )}
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Navigation Arrows */}
            {canLoop && (
              <>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous slide"
                  className="absolute left-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white sm:left-3 sm:size-9 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronLeft className="size-4 sm:size-5" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next slide"
                  className="absolute right-2 top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white sm:right-3 sm:size-9 sm:opacity-0 sm:group-hover:opacity-100"
                >
                  <ChevronRight className="size-4 sm:size-5" />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {canLoop && (
              <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-4">
                {sliderBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => swiperRef.current?.slideToLoop(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500 ease-out",
                      index === activeIndex
                        ? "w-6 bg-white shadow-sm"
                        : "w-1.5 bg-white/50 hover:bg-white/75",
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Right Standalone Banner (Hidden on Mobile/Tablet, visible on lg) */}
        {sideBanner && (
          <div className="relative hidden aspect-square w-full overflow-hidden rounded-2xl bg-muted lg:block lg:rounded-3xl">
            {sideBanner.linkUrl ? (
              <Link
                href={sideBanner.linkUrl}
                className="group block h-full w-full"
              >
                <Image
                  src={sideBanner.imageUrl}
                  alt={sideBanner.title || "Promotional banner"}
                  fill
                  sizes="30vw"
                  quality={90}
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </Link>
            ) : (
              <Image
                src={sideBanner.imageUrl}
                alt={sideBanner.title || "Promotional banner"}
                fill
                sizes="30vw"
                quality={90}
                className="object-cover"
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}
