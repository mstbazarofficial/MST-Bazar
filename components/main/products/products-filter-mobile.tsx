"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import FilterContent from "./products-filter-content";
import { FilterState } from "./products-page-client";

interface ProductsFilterMobileProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

export default function ProductsFilterMobile({
  filters,
  setFilters,
}: ProductsFilterMobileProps) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer swipeDirection="down" open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={
          <Button
            variant="secondary"
            className="flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-md border-border/70 bg-card px-4 text-xs font-extrabold text-foreground shadow-2xs active:scale-98"
          >
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            <span>Filter</span>
          </Button>
        }
      />

      <DrawerContent className="flex max-h-[85vh] flex-col gap-0 rounded-t-3xl p-0">
        <div className="mx-auto mt-2.5 h-1.5 w-10 shrink-0 rounded-full bg-muted-foreground/25" />

        <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-5 py-4">
          <DrawerTitle className="text-base font-extrabold text-foreground">
            Filter Products
          </DrawerTitle>
          <DrawerClose
            render={
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            }
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <FilterContent
            filters={filters}
            setFilters={setFilters}
            onNavigate={() => setOpen(false)}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
