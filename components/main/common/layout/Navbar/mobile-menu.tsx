"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ChevronRight, Menu, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

interface MobileMenuProps {
  trigger?: React.ReactElement;
  triggerClassName?: string;
}

const staticLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function MobileMenu({
  trigger,
  triggerClassName = "",
}: MobileMenuProps) {
  const { data: session } = authClient.useSession();
  const categories = useCategories();
  const pathname = usePathname();
  const user = session?.user;

  return (
    <Sheet>
      <SheetTrigger
        render={
          trigger ?? (
            <button
              type="button"
              className={`cursor-pointer lg:hidden ${triggerClassName}`}
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
          )
        }
      />

      <SheetContent
        side="left"
        className="flex w-72 flex-col gap-0 p-0 sm:w-80"
      >
        <SheetHeader className="border-b border-border px-4 py-4">
          <SheetTitle render={<Logo />} />
        </SheetHeader>

        {/* User section */}
        <div className="border-b border-border px-4 py-4">
          {user ? (
            <SheetClose
              nativeButton={false}
              render={
                <Link
                  href="/account"
                  className={`flex items-center gap-3 rounded-md p-1 transition-colors hover:bg-accent ${
                    pathname === "/account" ? "bg-accent font-semibold" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                      {user.name?.charAt(0).toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      View profile
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              }
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Guest</p>
                <p className="text-xs text-muted-foreground">
                  Sign in for a faster checkout
                </p>
              </div>
              <SheetClose
                nativeButton={false}
                render={
                  <Link
                    href="/login"
                    className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Login
                  </Link>
                }
              />
            </div>
          )}
        </div>

        {/* Scrollable nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3">
          {/* General links */}
          <ul className="mb-2 flex flex-col gap-0.5">
            {staticLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <SheetClose
                    nativeButton={false}
                    render={
                      <Link
                        href={link.href}
                        className={`block rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                          isActive
                            ? "bg-accent text-accent-foreground font-semibold"
                            : "text-foreground"
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

          {/* Categories */}
          {categories.length > 0 && (
            <div className="mt-2">
              <p className="px-3 pb-1.5 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Shop by Category
              </p>
              <ul className="flex flex-col gap-0.5">
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
                            className={`flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground ${
                              isActive
                                ? "bg-accent text-accent-foreground font-semibold"
                                : "text-foreground"
                            }`}
                          >
                            <span>{category.name}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
