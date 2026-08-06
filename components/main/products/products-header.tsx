import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface ProductsHeaderProps {
  /** e.g. "Honey", "Ghee" — omit or pass null for the root /products page */
  category?: string | null;
  /** Optional override if you want a custom H1 (defaults to category or "All Products") */
  title?: string;
}

export default function ProductsHeader({
  category,
  title,
}: ProductsHeaderProps) {
  const pageTitle = title ?? category ?? "All Products";

  return (
    <div className="site-container flex  gap-2 pt-3  items-center justify-between ">
      {/* Title */}
      <h1 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl lg:text-2xl">
        {pageTitle}
      </h1>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground sm:text-sm"
      >
        <Link href="/" className="transition-colors hover:text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
        {category ? (
          <>
            <Link
              href="/categories/products"
              className="transition-colors hover:text-primary"
            >
              Products
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="font-semibold text-foreground">{category}</span>
          </>
        ) : (
          <span className="font-semibold text-foreground">Products</span>
        )}
      </nav>
    </div>
  );
}
