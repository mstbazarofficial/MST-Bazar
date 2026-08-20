"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { useCategories } from "@/context/catalog-provider";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FilterState } from "./products-page-client";

interface FilterContentProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onNavigate?: () => void;
}

const PRICE_MIN = 50;
const PRICE_MAX = 2500;

const DISCOUNTS = [
  { id: "10-or-more", label: "10% or more" },
  { id: "20-or-more", label: "20% or more" },
  { id: "30-or-more", label: "30% or more" },
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block pb-2 text-xs font-extrabold tracking-wide text-foreground uppercase after:absolute after:bottom-0 after:left-0 after:h-0.75 after:w-8 after:rounded-full after:bg-primary">
      {children}
    </span>
  );
}

export default function FilterContent({
  filters,
  setFilters,
  onNavigate,
}: FilterContentProps) {
  const params = useParams<{ slug?: string[] }>();

  const currentCategory = params.slug?.[0] ?? "";
  const categories = useCategories();
  const [priceDraft, setPriceDraft] = useState<[number, number]>(
    filters.priceRange,
  );

  const handleDiscountChange = (id: string) => {
    setFilters((prev) => ({
      ...prev,
      discounts: prev.discounts.includes(id)
        ? prev.discounts.filter((d) => d !== id)
        : [...prev.discounts, id],
    }));
    onNavigate?.();
  };

  const categoryLinkClass = (isActive: boolean) =>
    `group flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold transition-all duration-200 ${
      isActive
        ? "bg-accent font-bold text-accent-foreground"
        : "text-foreground/80 hover:bg-muted hover:text-primary"
    }`;

  const chevronClass = (isActive: boolean) =>
    `h-3.5 w-3.5 transition-transform ${
      isActive
        ? "translate-x-0.5 text-accent-foreground"
        : "text-muted-foreground group-hover:translate-x-0.5 group-hover:text-primary"
    }`;

  return (
    <Accordion
      multiple
      defaultValue={["category", "price", "discount"]}
      className="w-full space-y-5"
    >
      {/* Category */}
      <AccordionItem value="category" className="border-b-0">
        <AccordionTrigger className="py-0 pb-3 hover:no-underline [&>svg]:text-muted-foreground">
          <SectionHeading>Filter by Category</SectionHeading>
        </AccordionTrigger>
        <AccordionContent className="space-y-1 pt-1 [&_a]:no-underline">
          <Link
            href="/products"
            onClick={onNavigate}
            className={categoryLinkClass(currentCategory === "")}
          >
            <span className="flex items-center gap-2">
              <ChevronRight className={chevronClass(currentCategory === "")} />
              All Products
            </span>
          </Link>

          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/products/${cat.slug}`}
                onClick={onNavigate}
                className={categoryLinkClass(isActive)}
              >
                <span className="flex items-center gap-2">
                  <ChevronRight className={chevronClass(isActive)} />
                  {cat.name}
                </span>
                <span
                  className={`text-[11px] font-medium ${
                    isActive
                      ? "font-bold text-accent-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  ({cat.productCount})
                </span>
              </Link>
            );
          })}
        </AccordionContent>
      </AccordionItem>

      {/* Price Range */}
      <AccordionItem value="price" className="border-b-0">
        <AccordionTrigger className="py-0 pb-3 hover:no-underline [&>svg]:text-muted-foreground">
          <SectionHeading>Price Range</SectionHeading>
        </AccordionTrigger>
        <AccordionContent className="pt-3 pb-6">
          <div className="mb-3 flex items-center justify-between text-xs font-bold text-foreground">
            <span>৳ {priceDraft[0]}</span>
            <span>৳ {priceDraft[1]}</span>
          </div>
          <Slider
            value={priceDraft}
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            onValueChange={(val) => setPriceDraft(val as [number, number])}
            onValueCommitted={(val) => {
              setFilters((prev) => ({
                ...prev,
                priceRange: val as [number, number],
              }));
              onNavigate?.();
            }}
            className="cursor-pointer py-1"
          />
        </AccordionContent>
      </AccordionItem>

      {/* Discount */}
      <AccordionItem value="discount" className="border-b-0">
        <AccordionTrigger className="py-0 pb-3 hover:no-underline [&>svg]:text-muted-foreground">
          <SectionHeading>Discount</SectionHeading>
        </AccordionTrigger>
        <AccordionContent className="space-y-2.5 pt-1 pb-2">
          {DISCOUNTS.map((disc) => (
            <div
              key={disc.id}
              className="flex items-center justify-between text-xs"
            >
              <label className="flex cursor-pointer items-center gap-2.5 font-medium text-foreground/80 hover:text-foreground">
                <Checkbox
                  checked={filters.discounts.includes(disc.id)}
                  onCheckedChange={() => handleDiscountChange(disc.id)}
                  className="h-4 w-4 rounded-xs border-muted-foreground/40 data-[state=checked]:border-primary data-[state=checked]:bg-primary"
                />
                <span>{disc.label}</span>
              </label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
