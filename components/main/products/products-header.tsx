import { ChevronRight, Heading } from "lucide-react";
import Link from "next/link";
import HeadingStyle2 from "../common/HeadingStyle2";

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

  const titleArray = pageTitle.split(" ");
  const title1st = titleArray.slice(0, -1).join(" ") ?? "";
  const title2nd = titleArray[titleArray.length - 1] ?? "";

  return (
    <div className="site-container flex  gap-2 pt-3  items-center justify-between ">
      {/* Title */}
      <HeadingStyle2
        firstTitle={title1st}
        secondTitle={title2nd}
        isUnderLine={false}
        className="mb-5"
        position={2}
      />

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
