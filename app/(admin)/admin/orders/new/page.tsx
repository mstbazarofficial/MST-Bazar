// app/admin/products/new/page.tsx
import { searchProductsForOrder } from "@/actions/admin/order-actions";
import { OrderFormPage } from "@/components/admin/orders/order-form-page";
export default async function NewOrderPage() {
  return <OrderFormPage searchProducts={searchProductsForOrder} />;
}
