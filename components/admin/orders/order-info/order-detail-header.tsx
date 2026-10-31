"use client";

import { PageHeader } from "@/components/admin/layout/page-header";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2 } from "lucide-react";

interface ActionResult {
  success: boolean;
  error?: string;
}
export function OrderDetailHeader({
  orderId,
  onDelete,
}: {
  orderId: string;
  onDelete: () => Promise<ActionResult | boolean | void>;
}) {
  return (
    <PageHeader
      backHref="/admin/orders"
      className="max-w-none"
      title="Orders"
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
              title={`Delete ${orderId}?`}
              description="This will permanently delete this order along with its items, payments, and notes. This action cannot be undone."
              action={onDelete}
              refreshData={false}
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
