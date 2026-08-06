// app/admin/products/new/page.tsx
import { searchProductsForOrder } from "@/actions/admin/order-actions";
import { OrderFormPage } from "@/components/admin/orders/order-form-page";
import { requireAdmin } from "@/lib/admin-auth";
export default async function NewOrderPage() {
  await requireAdmin();

  return <OrderFormPage searchProducts={searchProductsForOrder} />;
}
