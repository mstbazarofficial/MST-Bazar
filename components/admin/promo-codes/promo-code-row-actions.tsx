"use client";

import {
  deletePromoCode,
  togglePromoCodeActive,
} from "@/actions/admin/promo-code-mutations";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export function PromoCodeRowActions({
  promoCodeId,
  code,
  isActive,
}: {
  promoCodeId: string;
  code: string;
  isActive: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  function handleToggle(checked: boolean) {
    startTransition(async () => {
      try {
        await togglePromoCodeActive(promoCodeId, checked);
        await queryClient.invalidateQueries();
      } catch {
        toast.add({
          type: "error",
          description: "Couldn't update the promo code.",
          priority: "high",
        });
      }
    });
  }

  return (
    <div className="flex shrink-0 items-center justify-end gap-2">
      <Switch
        checked={isActive}
        disabled={isPending}
        onCheckedChange={handleToggle}
        aria-label={isActive ? `Pause ${code}` : `Resume ${code}`}
      />

      <Link
        href={`/admin/promo-codes/${promoCodeId}/edit`}
        aria-label={`Edit ${code}`}
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon" }),
          "size-8 text-muted-foreground hover:text-foreground",
        )}
      >
        <Pencil className="size-4" />
      </Link>

      <DeleteDialog
        title="Delete promo code?"
        description={`This will permanently delete "${code}". Past orders keep the code and their discount. To stop new orders only, pause it instead.`}
        action={() => deletePromoCode(promoCodeId)}
        successMessage="Promo code deleted successfully!"
      >
        <Button
          variant="destructive"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${code}`}
        >
          <Trash2 className="size-4" />
        </Button>
      </DeleteDialog>
    </div>
  );
}
