"use client";

import { PageHeader } from "@/components/admin/layout/page-header";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { Copy, MoreVertical, Trash2 } from "lucide-react";
import { useState } from "react";

const statusStyles: Record<OrderStatus, string> = {
  PENDING: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  CONFIRMED: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  PROCESSING: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  SHIPPED: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  DELIVERED: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  RETURNED: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  CANCELLED: "bg-red-500/15 text-red-600 dark:text-red-400",
};
interface ActionResult {
  success: boolean;
  error?: string;
}
export function OrderDetailHeader({
  order,
  onDelete,
}: {
  order: { id: string; orderId: string; status: OrderStatus };
  onDelete: () => Promise<ActionResult | boolean | void>;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageHeader
      backHref="/admin/orders"
      title={
        <div className="flex items-center gap-2">
          <h1 className=" text-base font-semibold text-foreground">
            {order.orderId}
          </h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleCopy}
            className={cn(
              "size-6",
              copied && "text-emerald-600 dark:text-emerald-400",
            )}
          >
            <Copy className="size-3.5" />
          </Button>
          <Badge
            variant="outline"
            className={cn("border-transparent", statusStyles[order.status])}
          >
            {order.status}
          </Badge>
        </div>
      }
      actions={
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
            <DeleteDialog
              title={`Delete ${order.orderId}?`}
              description="This will permanently delete this order along with its items, payments, and notes. This action cannot be undone."
              action={onDelete}
              successMessage="Order deleted successfully."
            >
              <Button
                variant="destructive"
                size="sm"
                className="w-full justify-start gap-2"
                aria-label="Delete order"
              >
                <Trash2 className="size-4" />
                Delete Order
              </Button>
            </DeleteDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    />
  );
}
