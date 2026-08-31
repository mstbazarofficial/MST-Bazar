"use client";

import { useCategories } from "@/context/catalog-provider";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Products", href: "/products" },
] as const;

export function CategoryNav() {
  const pathname = usePathname();
  const categories = useCategories();

  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `whitespace-nowrap transition-colors hover:text-primary-yellow ${
      isActive
        ? "text-primary-yellow border-b-2 border-primary-yellow h-full font-semibold"
        : ""
    }`;
  };

  return (
    <nav className="hidden bg-primary-dark text-primary-foreground lg:block">
      <div className="site-container flex  items-center py-2 text-sm">
        {/* Left: All Categories Trigger */}
        <div className="justify-self-start">
          <MobileMenu
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

        {/* Center: Navigation Links */}
        <ul className="flex items-center w-full justify-center justify-self-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link href={link.href} className={getLinkClasses(link.href)}>
                {link.label}
              </Link>
            </li>
          ))}
          {categories.slice(0, 5).map((category) => (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/products/${category.slug}`}
                className={getLinkClasses(`/products/${category.slug}`)}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
