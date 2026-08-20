"use client";

import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  ShoppingBag,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Profile Information", href: "/dashboard/profile", icon: UserIcon },
  { title: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
  {
    title: "Security Settings",
    href: "/dashboard/security",
    icon: ShieldCheck,
  },
];

export function DashboardHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [openSheet, setOpenSheet] = useState(false);

  // Better Auth session hook
  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Extract initials for Avatar Fallback
  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile menu + Responsive Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Sheet open={openSheet} onOpenChange={setOpenSheet}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              }
            />

            <SheetContent
              side="left"
              className="w-72 p-0 bg-background border-r border-border flex flex-col"
            >
              {/* Sheet Header */}
              <div className="flex items-center px-5 h-16 border-b border-border shrink-0">
                <Link
                  href="/"
                  onClick={() => setOpenSheet(false)}
                  className="flex items-center"
                >
                  <Image
                    src="/assets/logo-vertical.png"
                    alt="MST Bazar Logo"
                    width={180}
                    height={48}
                    priority
                    className="h-8 w-auto object-contain"
                  />
                </Link>
              </div>

              {/* User Info Block */}
              <div className="px-5 py-4 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage
                      src={user?.image || ""}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col truncate">
                    <span className="text-sm font-semibold text-foreground leading-tight truncate">
                      {user?.name || "Guest User"}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5 truncate">
                      {user?.email || ""}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 pb-2">
                  Navigation
                </p>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpenSheet(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Logout at bottom */}
              <div className="px-3 py-4 border-t border-border">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Log out</span>
                </button>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/assets/logo-vertical.png"
              alt="MST Bazar Logo"
              width={180}
              height={48}
              priority
              className="h-8  w-auto object-contain transition-all"
            />
          </Link>
        </div>

        {/* Right: Account dropdown (Only Logout option) */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex items-center gap-2.5 h-auto py-1.5 px-2 hover:bg-accent rounded-full transition-colors"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={user?.image || ""}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="hidden sm:flex flex-col text-left leading-tight max-w-30">
                  <span className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase">
                    My Account
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {user?.name?.split(" ")[0] || "User"}
                  </span>
                </div>

                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground ml-0.5" />
              </Button>
            }
          />

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold leading-none text-foreground truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1 truncate">
                    {user?.email || ""}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
