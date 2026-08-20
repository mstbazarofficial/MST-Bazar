"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
  { label: "Checkout", href: "/checkout" },
] as const;

export function CategoryNav() {
  const pathname = usePathname();

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `whitespace-nowrap transition-colors hover:text-primary-yellow ${
      isActive ? "text-primary-yellow font-semibold" : ""
    }`;
  };

  return (
    <nav className="hidden bg-primary-dark text-primary-foreground lg:block">
      <div className="site-container grid grid-cols-3 items-center py-2 text-sm">
        {/* Left: All Categories Trigger */}
        <div className="justify-self-start">
          <MobileMenu
            trigger={
              <button
                type="button"
                className="flex cursor-pointer items-center gap-2 whitespace-nowrap transition-opacity hover:text-primary-yellow"
              >
                <Menu className="h-4 w-4" />
                <span>All Categories</span>
              </button>
            }
          />
        </div>

        {/* Center: Navigation Links */}
        <ul className="flex items-center justify-center gap-6 overflow-x-auto">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link href={link.href} className={getLinkClasses(link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right: Empty spacer to balance grid centering */}
        <div />
      </div>
    </nav>
  );
}
