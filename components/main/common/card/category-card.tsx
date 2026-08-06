"use client";

import { ArrowRight, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
}

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/products/${category.slug}`}
      className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between overflow-hidden rounded-xl sm:rounded-2xl bg-card border border-border/80 p-2.5 sm:p-5 shadow-2xs hover:shadow-md hover:border-primary/50 transition-all duration-300 hover:-translate-y-0.5"
    >
      {/* Image Container: Full-width square on mobile -> Fixed 80px box on desktop */}
      <div className="relative w-full aspect-square sm:aspect-auto sm:w-20 sm:h-20 shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-muted/40 flex items-center justify-center border border-border/40 order-first sm:order-last mb-2 sm:mb-0">
        {category.image ? (
          <Image
            src={category.image}
            alt={category.name}
            fill
            sizes="(max-width: 640px) 33vw, 96px"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-muted-foreground group-hover:text-primary transition-colors py-4 sm:py-0">
            <ShoppingBag className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5]" />
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="flex flex-col justify-between z-10 text-center sm:text-left pr-0 sm:pr-2">
        <div>
          <h3 className="font-bold text-xs sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1 sm:line-clamp-2">
            {category.name}
          </h3>
          {/* Subtitle hidden on mobile to keep grid clean */}
          <span className="hidden sm:block text-xs text-muted-foreground mt-1">
            Fresh Collection
          </span>
        </div>

        {/* CTA hidden on mobile */}
        <div className="hidden sm:flex items-center gap-1 text-xs font-semibold text-primary mt-4 group-hover:translate-x-1 transition-transform">
          <span>Shop Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
