"use client";

import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
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
      <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-border bg-muted/40 text-muted-foreground">
        <ImageOff className="size-8" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted/30">
        <Image
          src={active.url}
          alt="Product image"
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 280px, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveId(img.id)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-md border transition",
                img.id === active.id
                  ? "border-primary ring-1 ring-primary"
                  : "border-border hover:border-foreground/30",
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
