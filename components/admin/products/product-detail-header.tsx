// src/app/admin/products/[slug]/_components/product-detail-header.tsx
"use client";

import { deleteProduct } from "@/actions/admin/product-mutations"; // Replace with your server action
import { PageHeader } from "@/components/admin/layout/page-header";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

type ProductDetailHeaderProps = {
  product: {
    id: string;
    title: string;
    slug: string;
    isAvailable: boolean;
  };
};

export function ProductDetailHeader({ product }: ProductDetailHeaderProps) {
  return (
    <PageHeader
      title={product.title}
      backHref="/admin/products"
      actions={
        <div className="flex items-center ">
          {/* More Actions Dropdown */}

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="outline" size="icon" className="size-8">
                  <MoreVertical className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent
              align="end"
              className="w-44 p-1.5 flex flex-col gap-1"
            >
              {/* Edit Button */}
              <Link
                href={`/admin/products/${product.slug}/edit`}
                className={buttonVariants({
                  size: "sm",
                  className: "w-full justify-start gap-2",
                })}
              >
                <Pencil className="size-4" />
                Edit Product
              </Link>

              {/* Delete Dialog Wrapper */}
              <DeleteDialog
                title="Delete product?"
                description={`Are you sure you want to delete "${product.title}"? This action cannot be undone.`}
                action={() => deleteProduct(product.id)}
                successMessage="Product deleted successfully."
              >
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full justify-start gap-2"
                  aria-label="Delete category"
                >
                  <Trash2 className="size-4" />
                  Delete Product
                </Button>
              </DeleteDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      }
    />
  );
}
