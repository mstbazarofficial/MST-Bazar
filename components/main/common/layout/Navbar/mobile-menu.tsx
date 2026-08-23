"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCategories } from "@/context/catalog-provider";
import { authClient } from "@/lib/auth-client";
import {
  Flame,
  HelpCircle,
  Info,
  LayoutDashboard,
  LogOut,
  Menu,
  PackageSearch,
  Percent,
  ShieldAlert,
  ShoppingBag,
  Sparkles,
  Store,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

interface MobileMenuProps {
  trigger?: React.ReactElement;
  triggerClassName?: string;
}

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

export function MobileMenu({
  trigger,
  triggerClassName = "",
}: MobileMenuProps) {
  const { data: session } = authClient.useSession();
  const categories = useCategories();
  const pathname = usePathname();
  const user = session?.user;

  // Role detection (Adjust "ADMIN" to match your auth backend if needed)
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <Sheet>
      <SheetTrigger
        render={
          trigger ?? (
            <button
              type="button"
              className={`flex items-center justify-center rounded-lg p-2 text-foreground transition-colors hover:bg-accent lg:hidden ${triggerClassName}`}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          )
        }
      />

      <SheetContent
        side="left"
        className="flex w-75 flex-col gap-0 p-0 sm:w-85"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
          <SheetTitle render={<Logo />} />
        </SheetHeader>

        {/* User Card Area */}
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

              {/* Navigation Actions for User */}
              <div className="grid grid-cols-1 gap-1.5 pt-1">
                {/* Admin Panel Link (Only visible if ADMIN) */}
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

                {/* Dashboard Link */}
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

        {/* Scrollable Navigation Body */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
          {/* Quick Shop Links */}
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
                            className={`h-4 w-4 shrink-0 ${
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground"
                            }`}
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

          {/* Dynamic Categories */}
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

          {/* Support / Legal Links */}
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

        {/* Optional Logout Footer */}
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
