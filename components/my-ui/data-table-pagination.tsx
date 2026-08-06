// src/components/ui/data-table-pagination.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useMemo } from "react";

export interface DataTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  /** Name of the items being paginated (e.g., "orders", "products"). Defaults to "entries". */
  itemName?: string;
  /** How many pages to show on each side of the current page. Defaults to 1. */
  siblingCount?: number;
}

export function DataTablePagination({
  currentPage,
  pageSize,
  totalItems,
  onPageChange,
  itemName = "entries",
  siblingCount = 1,
}: DataTablePaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Generate the pagination range with ellipses
  const paginationRange = useMemo(() => {
    // 1 (first) + 1 (last) + current + 2 * siblingCount + 2 (ellipses)
    const totalPageNumbersToShow = siblingCount + 5;

    // If total pages is less than the numbers we want to show, return all pages
    if (totalPages <= totalPageNumbersToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Case 1: No left dots, but show right dots
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, "...", totalPages];
    }

    // Case 2: Show left dots, but no right dots
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, "...", ...rightRange];
    }

    // Case 3: Show both left and right dots
    if (showLeftDots && showRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      );
      return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
    }

    return [];
  }, [currentPage, totalPages, siblingCount]);

  // If there are no items or only 1 page, we can either hide the component or just show the info.
  if (totalItems === 0) return null;

  // Calculate the "Showing X to Y of Z" values
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages < 2) {
    return null;
  }
  return (
    <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
      {/* Left side text */}
      <div className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}</span>{" "}
        to <span className="font-medium text-foreground">{endItem}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems}</span>{" "}
        {itemName}
      </div>

      {/* Right side pagination controls */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <span className="sr-only">Previous page</span>
          <ChevronLeft className="size-4" />
        </Button>

        {paginationRange.map((pageNumber, index) => {
          // Render Ellipsis
          if (pageNumber === "...") {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex size-8 items-center justify-center"
              >
                <MoreHorizontal className="size-4 text-muted-foreground" />
              </div>
            );
          }

          // Render Page Number
          const isCurrent = pageNumber === currentPage;
          return (
            <Button
              key={`page-${pageNumber}`}
              variant={isCurrent ? "default" : "outline"}
              size="icon"
              className="size-8 text-xs sm:text-sm"
              onClick={() => onPageChange(pageNumber as number)}
            >
              {pageNumber}
            </Button>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          className="size-8"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <span className="sr-only">Next page</span>
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
