"use client";

import { useCategories } from "@/context/catalog-provider";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileMenu } from "./mobile-menu";

export function CategoryNav() {
  const categories = useCategories();
  const pathname = usePathname();

  // Helper to apply active text color matching the hover state
  const getLinkClasses = (href: string) => {
    const isActive = pathname === href;
    return `whitespace-nowrap transition-colors hover:text-primary-yellow ${
      isActive ? "text-primary-yellow font-semibold" : ""
    }`;
  };

  return (
    <nav className="hidden bg-primary-dark text-primary-foreground lg:block">
      <div className="site-container flex items-center justify-between gap-6 overflow-x-auto py-2 text-sm">
        <MobileMenu
          trigger={
            <button
              type="button"
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap transition-opacity hover:text-primary-yellow"
            >
              <Menu className="h-4 w-4" />
              All Categories
            </button>
          }
        />
        <ul className="flex items-center gap-6 overflow-x-auto">
          <li className="shrink-0">
            <Link href="/about" className={getLinkClasses("/about")}>
              About
            </Link>
          </li>
          <li className="shrink-0">
            <Link href="/products" className={getLinkClasses("/products")}>
              Products
            </Link>
          </li>
          {categories.slice(0, 5).map((category) => {
            const href = `/products/${category.slug}`;
            return (
              <li key={category.id} className="shrink-0">
                <Link href={href} className={getLinkClasses(href)}>
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
