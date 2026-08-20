"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageOff, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type ProductImage = {
  id: string;
  url: string;
  isFeatured: boolean;
};

export function ProductImageGallery({ images }: { images: ProductImage[] }) {
  const featured = images.find((img) => img.isFeatured) ?? images[0];
  const [activeId, setActiveId] = useState(featured?.id);
  const active = images.find((img) => img.id === activeId) ?? featured;

  if (!images.length) {
    return (
      <div className="flex aspect-square w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-4 text-center text-muted-foreground shadow-2xs">
        <ImageOff className="size-8 stroke-[1.5]" />
        <span className="mt-2 text-xs font-medium">No product images</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main Display Area */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl border bg-background shadow-2xs">
        <Image
          src={active.url}
          alt="Product image preview"
          fill
          className="object-contain p-2"
          sizes="(min-width: 1024px) 280px, 50vw"
          priority
        />
        {active.isFeatured && (
          <Badge
            variant="secondary"
            className="absolute top-2.5 left-2.5 gap-1 bg-background/80 backdrop-blur-xs text-[10px] font-semibold"
          >
            <Star className="size-3 fill-amber-400 text-amber-400" />
            Featured
          </Badge>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-lg border bg-background transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                img.id === active.id
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-border opacity-70 hover:opacity-100",
              )}
            >
              <Image
                src={img.url}
                alt=""
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
