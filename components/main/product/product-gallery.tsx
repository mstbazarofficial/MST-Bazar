// components/main/product/product-gallery.tsx
"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
};

export function ProductGallery({
  images,
  productTitle,
}: {
  images: GalleryImage[];
  productTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? null;
  const hasMultiple = images.length > 1;

  const goTo = (index: number) => {
    setActiveIndex(((index % images.length) + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row-reverse lg:items-start">
      {/* Featured image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md border border-border/70 bg-card shadow-2xs">
        {activeImage ? (
          <Image
            key={activeImage.id}
            src={activeImage.url}
            alt={productTitle}
            fill
            priority
            quality={85}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-2xs backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border/70 bg-card/90 text-foreground shadow-2xs backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail rail — row below on mobile, column on the left on large screens */}
      {hasMultiple && (
        <div className="flex gap-2 overflow-x-auto pb-1 sm:gap-3 scrollbar-none [-ms-overflow-style:none] lg:w-20 lg:shrink-0 lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden">
          {images.map((image, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={image.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-current={isActive}
                className={cn(
                  "relative h-14 w-14 shrink-0 overflow-hidden rounded-md border-[1.5px] bg-card transition-all sm:h-18 sm:w-18 md:h-20 md:w-20 lg:h-20 lg:w-20",
                  isActive
                    ? "border-primary "
                    : "border-border/60 opacity-75 hover:border-primary/40 hover:opacity-100",
                )}
              >
                <Image
                  src={image.url}
                  alt={`${productTitle} — view ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-contain"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
