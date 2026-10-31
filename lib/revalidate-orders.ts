import { revalidatePath } from "next/cache";

// Order pages are addressed by the public order ID, so the route pattern is
// used to refresh them all rather than a single literal path.
export function revalidateOrderPages() {
  revalidatePath("/admin");
  revalidatePath("/admin/orders");
  revalidatePath("/admin/finance");
  revalidatePath("/(admin)/admin/orders/[orderId]", "page");
}
