"use client";

import { deleteNote } from "@/actions/admin/note-mutations";
import { deleteOrder, deleteOrderItem } from "@/actions/admin/order-mutations";
import { deletePayment } from "@/actions/admin/payment-mutations";
import { OrderWithDetails } from "@/app/(admin)/admin/orders/[orderId]/page";
import { useModalParam } from "@/hooks/use-modal-param";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AddItemFormModal } from "./edit-order/add-item-form";
import { AddNoteFormModal } from "./edit-order/add-note-form";
import { AddPaymentFormModal } from "./edit-order/add-payment-form";
import { EditItemFormModal } from "./edit-order/edit-item-form";
import { EditOrderCostsModal } from "./edit-order/edit-order-costs-form";
import { EditOrderInfoModal } from "./edit-order/edit-order-info-form";
import { EditOrderSummaryModal } from "./edit-order/edit-order-summary";
import { EditPaymentFormModal } from "./edit-order/edit-payment-form";
import { CostManagementCard } from "./order-info/cost-management-card";
import { NotesCard } from "./order-info/notes-card";
import { OrderDetailHeader } from "./order-info/order-detail-header";
import { OrderInfoCard } from "./order-info/order-info-card";
import { OrderItemsCard } from "./order-info/order-items-card";
import { OrderStatusCard } from "./order-info/order-status-card";
import { OrderSummaryCard } from "./order-info/order-summary-card";
import { PaymentHistoryCard } from "./order-info/payment-history-card";

export type EditSectionType = "customer" | "summary" | "cost" | "status";

export function OrderDetailsClient({ order }: { order: OrderWithDetails }) {
  // Modal URL parameters
  const queryClient = useQueryClient();
  const router = useRouter();
  const [addItemOpen, setAddItemOpen] = useModalParam("add-item");
  const [editItem, setEditItem] = useModalParam("edit-item");
  const [addPaymentOpen, setAddPaymentOpen] = useModalParam("add-payment");
  const [editPayment, setEditPayment] = useModalParam("edit-payment");
  const [addNoteOpen, setAddNoteOpen] = useModalParam("add-note");
  const [editOrderInfo, setEditOrderInfo] = useModalParam("edit-order-info");
  const [editOrderSummary, setEditOrderSummary] =
    useModalParam("edit-order-summary");
  const [editOrderCosts, setEditOrderCosts] = useModalParam("edit-order-costs");

  const selectedItem =
    order.orderItems?.find((item) => item.id === editItem) ?? null;

  const selectedPayment =
    order.payments?.find((payment) => payment.id === editPayment) ?? null;

  const handleDelete = async () => {
    await deleteOrder({ orderId: order.id });
    await queryClient.resetQueries({ queryKey: ["admin-orders"] });
    await queryClient.resetQueries({ queryKey: ["admin-order-stats"] });
    router.push("/admin/orders");
  };
  return (
    <>
      <OrderDetailHeader
        order={{
          id: order.id,
          orderId: order.orderId,
          status: order.status,
        }}
        onDelete={handleDelete}
      />

      <main className="flex-1 space-y-6 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <OrderInfoCard
              order={order}
              onEditClick={() => setEditOrderInfo("true")}
            />
            <OrderItemsCard
              items={order.orderItems}
              onEdit={(id) => setEditItem(id)}
              onAdd={() => setAddItemOpen("true")}
              onDelete={(id) =>
                deleteOrderItem({ orderId: order.id, itemId: id })
              }
            />

            <PaymentHistoryCard
              payments={order.payments}
              finalTotal={calculateOrderTotal(order).finalTotal}
              onAdd={() => setAddPaymentOpen("true")}
              onEdit={(id) => setEditPayment(id)}
              onDelete={(id) =>
                deletePayment({ orderId: order.id, paymentId: id })
              }
            />

            <NotesCard
              notes={order.notes}
              onAdd={() => setAddNoteOpen("true")}
              onDelete={(id) => deleteNote({ orderId: order.id, noteId: id })}
            />
          </div>

          <div className="space-y-6 lg:col-span-4">
            <OrderStatusCard order={order} />
            <OrderSummaryCard
              order={order}
              onEditClick={() => setEditOrderSummary("true")}
            />

            <CostManagementCard
              order={order}
              onEditClick={() => setEditOrderCosts("true")}
            />
          </div>
        </div>

        {/* Item Modals */}
        <AddItemFormModal
          open={addItemOpen === "true"}
          onOpenChange={(open) => setAddItemOpen(open ? "true" : null)}
          orderId={order.id}
          onSuccess={() => setAddItemOpen(null)}
        />

        <EditItemFormModal
          open={!!editItem}
          onOpenChange={(open) => !open && setEditItem(null)}
          orderId={order.id}
          item={selectedItem}
          onSuccess={() => setEditItem(null)}
        />

        {/* Payment Modals */}
        <AddPaymentFormModal
          open={addPaymentOpen === "true"}
          onOpenChange={(open) => setAddPaymentOpen(open ? "true" : null)}
          orderId={order.id}
          onSuccess={() => setAddPaymentOpen(null)}
        />

        <EditPaymentFormModal
          open={!!editPayment}
          onOpenChange={(open) => !open && setEditPayment(null)}
          orderId={order.id}
          payment={selectedPayment}
          onSuccess={() => setEditPayment(null)}
        />

        <AddNoteFormModal
          open={addNoteOpen === "true"}
          onOpenChange={(open) => setAddNoteOpen(open ? "true" : null)}
          orderId={order.id}
          onSuccess={() => setAddNoteOpen(null)}
        />

        <EditOrderInfoModal
          open={!!editOrderInfo}
          onOpenChange={(open) => !open && setEditOrderInfo(null)}
          orderId={order.id}
          initialData={order}
          onSuccess={() => setEditOrderInfo(null)}
        />
        <EditOrderSummaryModal
          open={!!editOrderSummary}
          onOpenChange={(open) => !open && setEditOrderSummary(null)}
          orderId={order.id}
          orderItems={order.orderItems}
          initialData={order}
          onSuccess={() => setEditOrderSummary(null)}
        />
        <EditOrderCostsModal
          open={!!editOrderCosts}
          onOpenChange={(open) => !open && setEditOrderCosts(null)}
          orderId={order.id}
          orderRevenue={calculateOrderTotal(order).finalTotal}
          initialData={order}
          onSuccess={() => setEditOrderCosts(null)}
        />
      </main>
    </>
  );
}
