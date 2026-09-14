"use client";

// ─────────────────────────────────────────────────────────────────────────────
// site-header.tsx
// Consolidates: Navbar, CategoryNav, CartSheet, DesktopSearchBar,
//               MobileMenu, MobileSearchOverlay, UserMenu, Logo
// + scroll-triggered sticky category bar (desktop only)
//
// Responsive behavior:
// - Mobile (<lg): header row (logo, search, cart, menu) is ALWAYS sticky.
//   The CategoryNav row and the scroll-triggered sticky category bar are
//   both hidden — mobile stays simple, with categories reachable through
//   the hamburger sheet.
// - Desktop (lg+): header scrolls normally (not sticky). Once it scrolls
//   out of view, a compact sticky category bar (categories + a menu
//   trigger) fades in from the top. The "All Categories" trigger (in the
//   normal bar) and the menu trigger (in the sticky bar) both open a
//   *simple* sheet containing only nav links + categories — no logo, no
//   account/profile section.
// ─────────────────────────────────────────────────────────────────────────────

import type { PopulatedCartItem } from "@/actions/main/cart-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { useCart, useCartItemError } from "@/context/cart-provider";
import { useCategories } from "@/context/catalog-provider";
import { useProductSearch } from "@/hooks/use-product-search";
import { authClient } from "@/lib/auth-client";
import type { ProductDTO } from "@/lib/data/catalog";
import { formatPrice } from "@/utils/format-price";
import {
  ArrowRight,
  Flame,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  Minus,
  PackageSearch,
  Percent,
  Plus,
  Search,
  ShieldAlert,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Trash2,
  Truck,
  UserCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Products", href: "/products" },
] as const;

const staticShopLinks = [
  { label: "All Products", href: "/products", icon: Store },
  { label: "Top Selling", href: "/products/top-selling", icon: Flame },
  { label: "Best Deals", href: "/products/best-deals", icon: Percent },
  {
    label: "Popular Products",
    href: "/products/popular-products",
    icon: Sparkles,
  },
  { label: "Combo Deals", href: "/products/combo-deals", icon: ShoppingBag },
];

const supportLinks = [
  { label: "Track Order", href: "/track-order", icon: PackageSearch },
  { label: "About Us", href: "/about", icon: Info },
  { label: "Contact Us", href: "/contact", icon: HelpCircle },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

interface LogoProps {
  href?: string;
  src?: string;
  alt?: string;
}

function Logo({
  href = "/",
  src = "/assets/logo-vertical.png",
  alt = "Logo",
}: LogoProps) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center"
      aria-label="Go to homepage"
    >
      <Image
        src={src}
        alt={alt}
        width={120}
        height={48}
        priority
        className="w-auto h-6 sm:h-8 object-contain"
      />
    </Link>
  );
}

// ─── Search Results Dropdown ──────────────────────────────────────────────────

function getFeaturedImage(product: ProductDTO): string {
  const featured = product.images.find((img) => img.isFeatured);
  return (featured ?? product.images[0])?.url ?? "/placeholder.svg";
}

function calcPrice(price: number, discountPercentage: number) {
  if (!discountPercentage) return { final: price, original: null };
  const final = Math.round(price - (price * discountPercentage) / 100);
  return { final, original: price };
}

interface SearchResultsDropdownProps {
  query: string;
  onNavigate?: () => void;
  searchResults?: ProductDTO[];
}

function SearchResultsDropdown({
  query,
  onNavigate,
  searchResults,
}: SearchResultsDropdownProps) {
  if (!query.trim()) return null;

  return (
    <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
      {searchResults?.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          No products found for &ldquo;{query}&rdquo;
        </p>
      ) : (
        <ul className="max-h-80 divide-y divide-border overflow-y-auto">
          {searchResults?.map((product) => {
            const { final, original } = calcPrice(
              product.price,
              product.discountPercentage,
            );
            const imageUrl = getFeaturedImage(product);
            return (
              <li key={product.id}>
                <Link
                  href={`/product/${product.slug}`}
                  onClick={onNavigate}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
                >
                  <span className="relative shrink-0">
                    <Image
                      src={imageUrl}
                      alt={product.title}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-md border border-border bg-muted object-cover"
                    />
                    {product.discountPercentage > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 rounded-full bg-destructive px-1 py-0.5 text-[9px] font-semibold leading-none text-primary-foreground">
                        -{product.discountPercentage}%
                      </span>
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="block truncate text-sm font-medium text-foreground">
                        {product.title}
                      </span>
                      {product.isBestDeal && (
                        <span className="shrink-0 rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold text-accent-foreground">
                          Best deal
                        </span>
                      )}
                      {product.isPopular && !product.isBestDeal && (
                        <span className="shrink-0 rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-secondary-foreground">
                          Popular
                        </span>
                      )}
                    </span>
                    {product.unit && (
                      <span className="text-xs text-muted-foreground">
                        {product.unit}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-sm font-semibold text-primary">
                      ৳{final}
                    </span>
                    {original !== null && (
                      <span className="block text-xs text-muted-foreground line-through">
                        ৳{original}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─── Desktop Search Bar ───────────────────────────────────────────────────────

function DesktopSearchBar() {
  const { query, setQuery, results, isOpen, setIsOpen, containerRef } =
    useProductSearch();

  return (
    <div
      ref={containerRef}
      className="relative hidden w-full max-w-xl sm:block"
    >
      <input
        type="search"
        placeholder="Search for products..."
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
        }}
        className="flex h-10 w-full rounded-md border-0 bg-muted px-5 pr-14 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary"
      />
      <button
        type="button"
        aria-label="Search"
        className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Search className="h-4 w-4" strokeWidth={2.5} />
      </button>
      {isOpen && (
        <SearchResultsDropdown
          onNavigate={() => setIsOpen(false)}
          query={query}
          searchResults={results}
        />
      )}
    </div>
  );
}

// ─── Mobile Search Overlay ────────────────────────────────────────────────────

interface MobileSearchOverlayProps {
  onClose: () => void;
}

function MobileSearchOverlay({ onClose }: MobileSearchOverlayProps) {
  const { query, setQuery, results, isOpen, setIsOpen, containerRef } =
    useProductSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsOpen(true);
    inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNavigate = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-50 flex items-center bg-background px-4 sm:hidden"
    >
      <div className="relative w-full">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search for products..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
          }}
          className="flex h-10 w-full rounded-md border-0 bg-muted px-5 pr-12 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary [&::-webkit-search-cancel-button]:appearance-none"
        />
        <button
          type="button"
          onClick={onClose}
          aria-label="Close search"
          className="absolute right-1 top-1/2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted-foreground/10 hover:text-foreground"
        >
          <X className="h-5 w-5" strokeWidth={2} />
        </button>
        {isOpen && (
          <SearchResultsDropdown
            onNavigate={handleNavigate}
            query={query}
            searchResults={results}
          />
        )}
      </div>
    </div>
  );
}

// ─── Mobile Menu ──────────────────────────────────────────────────────────────
//
// `simple`: when true, renders a stripped-down sheet with just the nav
// links + categories — no logo header, no account/profile block, no
// shop/support sections, no sign-out. Used by the desktop "All Categories"
// trigger and the desktop sticky-bar menu trigger.
// When false (default), renders the full sheet used by the mobile
// hamburger — logo, account block, shop links, categories, support, sign out.

interface MobileMenuProps {
  trigger?: React.ReactElement;
  triggerClassName?: string;
  simple?: boolean;
}

function MobileMenu({
  trigger,
  triggerClassName = "",
  simple = false,
}: MobileMenuProps) {
  const { data: session } = authClient.useSession();
  const categories = useCategories();
  const pathname = usePathname();
  const user = session?.user;
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const defaultTrigger = (
    <button
      type="button"
      className={`flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-accent lg:hidden ${triggerClassName}`}
      aria-label="Open menu"
    >
      <Menu className="size-5" />
    </button>
  );

  if (simple) {
    return (
      <Sheet>
        <SheetTrigger render={trigger ?? defaultTrigger} />

        <SheetContent
          side="left"
          className="flex w-75 flex-col gap-0 p-0 sm:w-85"
        >
          <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
            <SheetTitle>Browse</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Menu
              </p>
              <ul className="space-y-0.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            href={link.href}
                            className={`block rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                              isActive
                                ? "bg-primary/10 font-semibold text-primary"
                                : "text-foreground/80 hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            {link.label}
                          </Link>
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {categories.length > 0 && (
              <div>
                <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Categories
                </p>
                <ul className="space-y-0.5">
                  {categories.map((category) => {
                    const href = `/products/${category.slug}`;
                    const isActive = pathname === href;
                    return (
                      <li key={category.id}>
                        <SheetClose
                          nativeButton={false}
                          render={
                            <Link
                              href={href}
                              className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                                isActive
                                  ? "bg-primary/10 font-semibold text-primary"
                                  : "text-foreground/80 hover:bg-accent hover:text-foreground"
                              }`}
                            >
                              <span>{category.name}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                            </Link>
                          }
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger render={trigger ?? defaultTrigger} />

      <SheetContent
        side="left"
        className="flex w-75 flex-col gap-0 p-0 sm:w-85"
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
          <SheetTitle render={<Logo />} />
        </SheetHeader>

        <div className="border-b border-border/60 bg-muted/30 px-4 py-3.5">
          {user ? (
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/80">
                  <AvatarImage src={user.image ?? undefined} alt={user.name} />
                  <AvatarFallback className="bg-primary/10 text-xs font-bold text-primary">
                    {user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-sm font-bold text-foreground">
                      {user.name}
                    </p>
                    {isAdmin && (
                      <Badge className="bg-amber-500/15 text-[9px] font-semibold text-amber-600 hover:bg-amber-500/15 dark:text-amber-400">
                        ADMIN
                      </Badge>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {isAdmin && (
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href="/admin"
                        className={`flex items-center gap-2 rounded-md bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-500/20 dark:text-amber-400 ${
                          pathname.startsWith("/admin")
                            ? "ring-1 ring-amber-500/50"
                            : ""
                        }`}
                      >
                        <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                        <span>Admin Panel</span>
                      </Link>
                    }
                  />
                )}
                <SheetClose
                  nativeButton={false}
                  render={
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 rounded-md border border-border/60 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent ${
                        pathname.startsWith("/dashboard")
                          ? "border-primary font-semibold text-primary"
                          : ""
                      }`}
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                      <span>Customer Dashboard</span>
                    </Link>
                  }
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Welcome Guest
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Manage orders & profile
                  </p>
                </div>
              </div>
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/login"
                    className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground shadow-xs transition-opacity hover:opacity-90"
                  >
                    Login
                  </Link>
                }
              />
            </div>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          <div>
            <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Explore Store
            </p>
            <ul className="space-y-0.5">
              {staticShopLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-primary/10 font-semibold text-primary"
                              : "text-foreground/80 hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <Icon
                            className={`h-4 w-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span>{link.label}</span>
                        </Link>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>

          {categories.length > 0 && (
            <div>
              <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Categories
              </p>
              <ul className="space-y-0.5">
                {categories.map((category) => {
                  const href = `/products/${category.slug}`;
                  const isActive = pathname === href;
                  return (
                    <li key={category.id}>
                      <SheetClose
                        nativeButton={false}
                        render={
                          <Link
                            href={href}
                            className={`flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors ${
                              isActive
                                ? "bg-primary/10 font-semibold text-primary"
                                : "text-foreground/80 hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            <span>{category.name}</span>
                            <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
                          </Link>
                        }
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="border-t border-border/50 pt-3">
            <p className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Support & Help
            </p>
            <ul className="space-y-0.5">
              {supportLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors ${
                            isActive
                              ? "bg-primary/10 font-semibold text-primary"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{link.label}</span>
                        </Link>
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        {user && (
          <div className="border-t border-border/60 p-3">
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Cart Sheet ───────────────────────────────────────────────────────────────

function CartRow({ item }: { item: PopulatedCartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const { error, clearError } = useCartItemError(item.productId);

  useEffect(() => {
    if (error) {
      toast.add({
        title: "Couldn't update cart",
        description: error,
        type: "error",
      });
      clearError();
    }
  }, [error, clearError]);

  const hasDiscount = item.product.discountPercentage > 0;
  const unitPrice = hasDiscount
    ? item.product.price * (1 - item.product.discountPercentage / 100)
    : item.product.price;
  const lineTotal = unitPrice * item.quantity;

  return (
    <li className="flex gap-3 py-4">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted">
        {item.product.image ? (
          <Image
            src={item.product.image}
            alt={item.product.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/products/${item.product.slug}`}
            className="line-clamp-2 text-sm font-medium leading-tight hover:text-primary"
          >
            {item.product.title}
          </Link>
          <button
            type="button"
            aria-label="Remove item"
            onClick={() => removeItem(item.productId)}
            className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          {item.product.unit && (
            <span className="text-xs text-muted-foreground">
              {item.product.unit}
            </span>
          )}
          {item.product.unit && hasDiscount && (
            <span className="text-xs text-muted-foreground">·</span>
          )}
          {hasDiscount && (
            <span className="text-xs text-muted-foreground">
              {formatPrice(unitPrice)} each
            </span>
          )}
        </div>

        <div className="mt-1.5 flex items-end justify-between">
          <div className="flex items-center rounded-full border">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-6 text-center text-sm tabular-nums">
              {item.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
              disabled={item.quantity >= 10}
              className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="text-right">
            {hasDiscount && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(item.product.price * item.quantity)}
              </div>
            )}
            <div className="text-sm font-semibold">
              {formatPrice(lineTotal)}
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function EmptyCart() {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-2 text-center">
      <ShoppingCart
        className="h-10 w-10 text-muted-foreground"
        strokeWidth={1.5}
      />
      <h3 className="text-sm font-medium">Your cart is empty</h3>
      <p className="text-xs text-muted-foreground">
        Add some groceries to get started
      </p>
    </div>
  );
}

function CartSheet() {
  const { items, isLoading, totalItems, totalPrice } = useCart();

  return (
    <Sheet>
      <SheetTrigger
        render={
          <button
            type="button"
            aria-label="Open cart"
            className="flex cursor-pointer flex-col items-center gap-0.5 px-1 text-foreground transition-colors hover:text-primary"
          >
            <span className="relative">
              <ShoppingCart className="size-4 md:size-5" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </span>
            <span className="text-xs font-medium">Cart</span>
          </button>
        }
      />

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md *:data-[slot=sheet-close]:hidden"
      >
        <SheetHeader className="flex-row items-center justify-between border-b py-4 pl-5 pr-4">
          <SheetTitle>
            Your Cart{totalItems > 0 && ` (${totalItems})`}
          </SheetTitle>
          <SheetClose
            render={
              <button
                type="button"
                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Close
                <ArrowRight className="h-4 w-4" />
              </button>
            }
          />
        </SheetHeader>

        <ScrollArea className="flex-1 px-5">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <CartRow key={item.id} item={item} />
              ))}
            </ul>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <div className="space-y-3 border-t bg-background px-5 py-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <SheetClose
              nativeButton={false}
              render={
                <Link href="/checkout" className="block w-full">
                  <Button className="w-full" size="lg">
                    Checkout
                  </Button>
                </Link>
              }
            />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── User Menu ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function UserMenu() {
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
  };

  if (isPending) {
    return <Skeleton className="hidden h-8 w-8 rounded-full sm:block" />;
  }

  const user = session?.user;

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden flex-col items-center gap-0.5 px-1 text-foreground transition-colors hover:text-primary sm:flex"
      >
        <UserCheck className="h-5 w-5" />
        <span className="text-xs font-medium">Sign In</span>
      </Link>
    );
  }

  const initials = getInitials(user.name ?? user.email ?? "U");
  const role = user.role?.toUpperCase();
  const isAdminOrModerator = role === "ADMIN" || role === "MODERATOR";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Open account menu"
            className="hidden flex-col items-center gap-0.5 px-1 text-foreground transition-colors hover:text-primary sm:flex"
          >
            <Avatar className="h-8 w-8 cursor-pointer transition-all hover:ring-1 hover:ring-primary">
              <AvatarImage src={user.image ?? undefined} alt={user.name} />
              <AvatarFallback className="bg-accent text-[9px] text-accent-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="font-normal">
            <p className="truncate text-sm font-medium text-foreground">
              {user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={
              <Link href="/dashboard" className="cursor-pointer">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            }
          />
        </DropdownMenuGroup>
        {isAdminOrModerator && (
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={
                <Link href="/admin" className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Admin Panel
                </Link>
              }
            />
          </DropdownMenuGroup>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={handleSignOut}
            className="cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Category Nav (inline, used in both full and sticky bars) ─────────────────

interface CategoryNavLinksProps {
  /** When true renders a compact sticky bar; false renders the original full bar */
  compact?: boolean;
}

function CategoryNavLinks({ compact = false }: CategoryNavLinksProps) {
  const pathname = usePathname();
  const categories = useCategories();

  const linkCls = (href: string) => {
    const isActive = pathname === href;
    if (compact) {
      return `whitespace-nowrap text-sm px-3 py-1 rounded-full transition-colors ${
        isActive
          ? "bg-primary/15 text-primary font-semibold"
          : "text-foreground/80 hover:text-primary hover:bg-primary/10"
      }`;
    }
    return `whitespace-nowrap transition-colors hover:text-primary-yellow ${
      isActive ? "text-primary-yellow  h-full " : ""
    }`;
  };

  const items = [
    ...NAV_LINKS,
    ...categories.slice(0, 5).map((c) => ({
      label: c.name,
      href: `/products/${c.slug}`,
    })),
  ];

  return (
    <>
      {items.map((link) => (
        <li key={link.href} className="shrink-0">
          <Link href={link.href} className={linkCls(link.href)}>
            {link.label}
          </Link>
        </li>
      ))}
    </>
  );
}

// ─── Full Category Nav bar (inside the main header, not sticky, desktop only) ─

function CategoryNav() {
  return (
    <nav className="hidden bg-primary-dark text-primary-foreground lg:block">
      <div className="site-container flex items-center py-2 text-sm">
        {/* All Categories trigger — opens a simple sheet: nav links + categories only */}
        <div className="justify-self-start">
          <MobileMenu
            simple
            trigger={
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap transition-opacity hover:text-primary-yellow"
              >
                <Menu className="h-4 w-4" />
                <span className="hidden xl:inline">All Categories</span>
              </button>
            }
          />
        </div>

        {/* Nav links */}
        <ul className="flex items-center w-full justify-center gap-6">
          <CategoryNavLinks />
        </ul>
      </div>
    </nav>
  );
}

// ─── Sticky Category Bar (desktop only — appears after the main header scrolls
// out of view) ──────────────────────────────────────────────────────────────

function StickyCategoryBar({ visible }: { visible: boolean }) {
  const categories = useCategories();
  const pathname = usePathname();

  const linkCls = (href: string) => {
    const isActive = pathname === href;
    return `whitespace-nowrap shrink-0 text-sm px-3.5 py-1 rounded-full font-medium transition-colors ${
      isActive
        ? "bg-white text-primary-dark font-semibold"
        : "text-white/85 hover:text-white hover:bg-white/15"
    }`;
  };

  const categoryItems = categories.map((c) => ({
    label: c.name,
    href: `/products/${c.slug}`,
  }));

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 hidden bg-primary-dark shadow-md transition-transform duration-300 lg:block ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* overflow-hidden on the row prevents the ul from ever causing horizontal page scroll */}
      <div className="site-container flex items-center gap-2 py-2 overflow-hidden">
        {/* Menu trigger — opens the same simple sheet as "All Categories" */}
        <div className="shrink-0">
          <MobileMenu
            simple
            trigger={
              <button
                type="button"
                className="flex cursor-pointer items-center justify-center rounded-full p-1 px-2 text-white transition-colors hover:bg-white/15"
                aria-label="Open menu"
              >
                <Menu className="h-4 w-4" />
                <span className="text-sm ml-2">All Categories</span>
              </button>
            }
          />
        </div>

        {/* Scrollable list — constrained to available width, never overflows viewport */}
        <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] scrollbar-none [&::-webkit-scrollbar]:hidden">
          <ul className="flex items-center gap-1 py-0.5 w-max lg:w-full lg:justify-center">
            {categoryItems.map((link) => (
              <li key={link.href} className="shrink-0">
                <Link href={link.href} className={linkCls(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────

function MainNavbar({
  headerRef,
}: {
  headerRef: React.RefObject<HTMLElement | null>;
}) {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    // Sticky on mobile (always pinned) — normal flow on lg+ (scrolls away,
    // replaced by StickyCategoryBar once it's out of view).
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-40 bg-background lg:static lg:z-auto"
    >
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
                <Search className="size-4" />
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

// ─── SiteHeader (root export) ─────────────────────────────────────────────────

export function SiteHeader() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      const { bottom } = headerRef.current.getBoundingClientRect();
      // Show sticky bar once the full header (incl. CategoryNav) scrolls out of view.
      // On mobile the header is sticky so `bottom` never goes negative — the
      // sticky bar stays hidden there anyway via its own `lg:block` guard.
      setShowStickyBar(bottom < 0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <MainNavbar headerRef={headerRef} />
      <div className="py-8 lg:py-0" />
      <StickyCategoryBar visible={showStickyBar} />
    </>
  );
}
