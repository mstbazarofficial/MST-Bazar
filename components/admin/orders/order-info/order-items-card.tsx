"use client";

import {
  DeleteDialog,
  type DeleteDialogActionType,
} from "@/components/my-ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/format-price";
import { Package, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

type OrderItem = {
  id: string;
  productName: string;
  productImage: string | null;
  quantity: number;
  price: number;
  discountPercentage: number;
};

export function OrderItemsCard({
  items,
  onAdd,
  onEdit,
  onDelete,
}: {
  items: OrderItem[];
  onAdd: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => DeleteDialogActionType;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Package className="size-4" />
            Products
            <Badge variant="secondary" className="ml-1 font-normal">
              {items.length} {items.length === 1 ? "item" : "items"}
            </Badge>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus className="size-3.5" />
            Add Item
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {items.map((item) => {
          const unitPrice = item.price * (1 - item.discountPercentage / 100);
          const total = unitPrice * item.quantity;

          return (
            <div
              key={item.id}
              className="flex items-start gap-3.5 rounded-lg border border-border p-3.5 transition-colors hover:border-border/80"
            >
              {/* Product Image Thumbnail (64px) */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted/50">
                {item.productImage ? (
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground/60">
                    <Package className="size-5" />
                  </div>
                )}
              </div>

              {/* Product Details & Calculations */}
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold leading-tight text-foreground line-clamp-2">
                    {item.productName}
                  </h4>
                  <span className="shrink-0 text-sm font-semibold text-foreground">
                    {formatPrice(total)}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge
                    variant="outline"
                    className="text-[11px] font-normal px-2 py-0 h-5"
                  >
                    Qty: {item.quantity}
                  </Badge>

                  {item.discountPercentage > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-medium px-1.5 py-0 h-5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                    >
                      -{item.discountPercentage}%
                    </Badge>
                  )}

                  <span>
                    {formatPrice(unitPrice)} each
                    {item.discountPercentage > 0 && (
                      <span className="ml-1 text-[11px] line-through text-muted-foreground/70">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5 shrink-0 -mr-1 -mt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(item.id)}
                >
                  <Pencil className="size-3.5" />
                  <span className="sr-only">Edit item</span>
                </Button>

                <DeleteDialog
                  title={`Delete ${item.productName || "item"}?`}
                  description="This will permanently delete this item from the order. This action cannot be undone."
                  action={() => onDelete(item.id)}
                  successMessage="Item deleted successfully."
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="sr-only">Delete item</span>
                  </Button>
                </DeleteDialog>
              </div>
            </div>
          );
        })}

        {items.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No items added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
