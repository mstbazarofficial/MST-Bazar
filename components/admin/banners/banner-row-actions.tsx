"use client";

import { deleteBanner } from "@/actions/admin/banner-mutations";
import { DeleteDialog } from "@/components/my-ui/delete-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

export function BannerRowActions({
  bannerId,
  bannerTitle,
}: {
  bannerId: string;
  bannerTitle: string | null;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <Link
        href={`/admin/banners/${bannerId}/edit`}
        aria-label="Edit banner"
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon" }),
          "size-8 text-muted-foreground hover:text-foreground",
        )}
      >
        <Pencil className="size-4" />
      </Link>

      <DeleteDialog
        title="Delete banner?"
        description={`This will permanently delete "${bannerTitle || "this banner"}". This action cannot be undone.`}
        action={() => deleteBanner(bannerId)}
        successMessage="Banner deleted successfully!"
      >
        <Button
          variant="destructive"
          size="icon"
          className="size-8 text-muted-foreground hover:text-destructive"
          aria-label="Delete banner"
        >
          <Trash2 className="size-4" />
        </Button>
      </DeleteDialog>
    </div>
  );
}
