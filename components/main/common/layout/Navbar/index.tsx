"use client";
import { Search, Truck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CartSheet } from "./cart-sheet";
import { CategoryNav } from "./category-nav";
import { DesktopSearchBar } from "./desktop-search-bar";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { MobileSearchOverlay } from "./mobile-search-overlay";
import { UserMenu } from "./user-menu";

export function Navbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40  bg-background">
      {/* `relative` here is what lets the mobile search overlay cover this row */}
      <div className="site-container relative flex h-16 items-center gap-4">
        {!mobileSearchOpen && (
          <>
            <MobileMenu />
            <Logo />
            <div className="flex flex-1 justify-center">
              <DesktopSearchBar />
            </div>

            <div className="ml-auto flex items-center gap-2 md:gap-3">
              <button
                type="button"
                aria-label="Open search"
                onClick={() => setMobileSearchOpen(true)}
                className="flex sm:hidden flex-col cursor-pointer items-center gap-0.5 px-1 text-foreground transition-colors hover:text-primary"
              >
                <Search className="size-4 " />
                <span className="text-xs font-medium">Search</span>
              </button>

              <Link
                href="/track-order"
                className="hidden md:flex flex-col items-center gap-0.5 px-1 text-foreground transition-colors hover:text-primary"
              >
                <Truck className="h-5 w-5" />
                <span className="text-xs font-medium whitespace-nowrap">
                  Track Order
                </span>
              </Link>

              <CartSheet />

              {/* Only show */}
              <UserMenu />
            </div>
          </>
        )}

        {mobileSearchOpen && (
          <MobileSearchOverlay onClose={() => setMobileSearchOpen(false)} />
        )}
      </div>

      <CategoryNav />
    </header>
  );
}
