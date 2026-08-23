"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import Link from "next/link";

type ProductRow = {
  id: string;
  title: string;
  price: number;
  discountPercentage: number;
  unit: string | null;
  isAvailable: boolean;
  isBestDeal?: boolean;
  isPopular?: boolean;
  isCombo?: boolean;
  isTopSelling?: boolean;
  category: { id: string; name: string };
  image: string | null;
  slug: string;
  priority: number;
};

export function ProductsTable({
  products,
  isLoading,
}: {
  products: ProductRow[];
  isLoading: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 pl-4">Image</TableHead>
            <TableHead className="min-w-50">Product</TableHead>
            <TableHead className="w-44">Category</TableHead>
            <TableHead className="w-24 text-center">Priority</TableHead>
            <TableHead className="w-36 text-right">Price</TableHead>
            <TableHead className="w-32 text-center pr-4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && products.length === 0 && <TableSkeletonRows />}

          {!isLoading && products.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="h-32 text-center text-muted-foreground"
              >
                No products match these filters.
              </TableCell>
            </TableRow>
          )}

          {products.map((product) => {
            const finalPrice =
              product.discountPercentage > 0
                ? product.price * (1 - product.discountPercentage / 100)
                : product.price;

            return (
              <TableRow
                key={product.id}
                className="group relative hover:bg-muted/50 transition-colors"
              >
                {/* Image Cell */}
                <TableCell className="pl-4">
                  <div className="size-10 overflow-hidden rounded-md bg-muted border">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={40}
                        height={40}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        N/A
                      </div>
                    )}
                  </div>
                </TableCell>

                {/* Product Title Cell with Stretched Link & Feature Badges */}
                <TableCell>
                  <Link
                    href={`/admin/products/${product.slug}`}
                    className="font-medium text-foreground group-hover:text-primary transition-colors focus:outline-none after:absolute after:inset-0"
                  >
                    {product.title}
                  </Link>
                  {product.unit && (
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {product.unit}
                    </p>
                  )}

                  {/* Feature Badges */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {product.isBestDeal && (
                      <Badge className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 text-[10px] px-1.5 py-0 h-4 hover:bg-amber-500/20 pointer-events-none">
                        Best Deal
                      </Badge>
                    )}
                    {product.isPopular && (
                      <Badge className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800 text-[10px] px-1.5 py-0 h-4 hover:bg-purple-500/20 pointer-events-none">
                        Popular
                      </Badge>
                    )}
                    {product.isCombo && (
                      <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 text-[10px] px-1.5 py-0 h-4 hover:bg-blue-500/20 pointer-events-none">
                        Combo
                      </Badge>
                    )}
                    {product.isTopSelling && (
                      <Badge className="bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800 text-[10px] px-1.5 py-0 h-4 hover:bg-rose-500/20 pointer-events-none">
                        Top Selling
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Category Cell */}
                <TableCell className="text-muted-foreground">
                  {product.category.name}
                </TableCell>

                {/* Priority Cell */}
                <TableCell className="text-center">
                  <Badge variant="outline" className="font-mono text-xs">
                    {product.priority ?? 0}
                  </Badge>
                </TableCell>

                {/* Price Cell */}
                <TableCell className="text-right whitespace-nowrap">
                  {product.discountPercentage > 0 ? (
                    <div className="flex flex-col items-end">
                      <span className="font-semibold text-foreground">
                        ৳ {Math.round(finalPrice).toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        ৳ {Math.round(product.price).toLocaleString()}
                      </span>
                    </div>
                  ) : (
                    <span className="font-semibold text-foreground">
                      ৳ {Math.round(product.price).toLocaleString()}
                    </span>
                  )}
                </TableCell>

                {/* Status Cell */}
                <TableCell className="text-center pr-4">
                  <Badge
                    variant={product.isAvailable ? "default" : "secondary"}
                    className={
                      product.isAvailable
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : ""
                    }
                  >
                    {product.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function TableSkeletonRows() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell className="pl-4">
            <Skeleton className="size-10 rounded-md" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-44 mb-1" />
            <Skeleton className="h-3 w-16 mb-1.5" />
            <div className="flex gap-1">
              <Skeleton className="h-4 w-16 rounded-full" />
              <Skeleton className="h-4 w-12 rounded-full" />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell className="text-center">
            <Skeleton className="mx-auto h-5 w-10 rounded-md" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="ml-auto h-4 w-20" />
          </TableCell>
          <TableCell className="pr-4">
            <Skeleton className="mx-auto h-6 w-20 rounded-full" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
