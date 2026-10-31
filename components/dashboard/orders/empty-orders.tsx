import { buttonVariants } from "@/components/ui/button";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

export function EmptyOrders() {
  return (
    <div className="flex flex-col items-center px-5 py-14 text-center">
      <PackageOpen className="size-8 text-muted-foreground" />
      <p className="mt-3 text-sm font-semibold text-foreground">
        No orders yet
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your orders will show up here once you place one.
      </p>
      <Link
        href="/products"
        className={`${buttonVariants({ size: "sm" })} mt-4`}
      >
        Browse products
      </Link>
    </div>
  );
}
