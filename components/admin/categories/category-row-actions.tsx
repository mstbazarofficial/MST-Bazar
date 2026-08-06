// src/components/admin/categories/category-row-actions.tsx
"use client";

import { deleteCategory } from "@/actions/admin/category-mutations";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export function CategoryRowActions({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/categories/${categoryId}/edit`}
        aria-label="Edit category"
        className={cn(
          buttonVariants({
            variant: "secondary",
            size: "icon",
          }),
          "size-8 text-muted-foreground hover:text-foreground",
        )}
      >
        <Pencil className="size-4" />
      </Link>

      <DeleteDialog
        title="Delete category?"
        description={`This will permanently delete "${categoryName}". This action cannot be undone.`}
        action={() => deleteCategory(categoryId)}
        successMessage="Category deleted successfully!"
      >
        <Button
          variant="destructive"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label="Delete category"
        >
          <Trash2 className="size-4" />
        </Button>
      </DeleteDialog>
    </div>
  );
}
