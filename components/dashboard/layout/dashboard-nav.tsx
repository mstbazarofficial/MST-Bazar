"use client";

import {
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  ShoppingBag,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useLogout } from "@/hooks/use-logout";
import { authClient } from "@/lib/auth-client";

// Single source of truth for the desktop sidebar and the mobile tabs
export const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Orders", href: "/dashboard/orders", icon: ShoppingBag },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Security", href: "/dashboard/security", icon: ShieldCheck },
];

function isItemActive(pathname: string, href: string) {
  return href === "/dashboard"
    ? pathname === href
    : pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardNav() {
  const pathname = usePathname();
  const logout = useLogout();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <div className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-3 bg-brand-gradient p-4 text-white">
        <Avatar className="size-11 border-2 border-white/40">
          <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
          <AvatarFallback className="bg-white/20 text-sm font-semibold text-white">
            {user?.name?.trim()[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {user?.name || "My account"}
          </p>
          <p className="truncate text-xs text-white/80">{user?.email}</p>
        </div>
      </div>

      <nav aria-label="Account navigation" className="space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = isItemActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-dark text-white shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="size-4 shrink-0" />
          Log out
        </button>
      </div>
    </div>
  );
}

export function DashboardTabs() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Account navigation"
      className="flex flex-wrap gap-x-5 px-4 sm:px-6 lg:hidden"
    >
      {navItems.map((item) => {
        const isActive = isItemActive(pathname, item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`-mb-px shrink-0 border-b-2 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
