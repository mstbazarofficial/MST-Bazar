"use client";

import { deleteNote } from "@/actions/admin/note-mutations";
import { deleteOrder, deleteOrderItem } from "@/actions/admin/order-mutations";
import { deletePayment, markOrderPaid } from "@/actions/admin/payment-mutations";
import { OrderWithDetails } from "@/actions/admin/order-actions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModalParam } from "@/hooks/use-modal-param";
import { calculateOrderTotal } from "@/utils/calculate-order-total";
import { useQueryClient } from "@tanstack/react-query";
import { CreditCard, LayoutGrid, NotebookText, Package } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type ReactNode } from "react";
import { AddItemFormModal } from "./edit-order/add-item-form";
import { AddPaymentFormModal } from "./edit-order/add-payment-form";
import { EditItemFormModal } from "./edit-order/edit-item-form";
import { EditOrderInfoModal } from "./edit-order/edit-order-info-form";
import { EditOrderSummaryModal } from "./edit-order/edit-order-summary";
import { EditPaymentFormModal } from "./edit-order/edit-payment-form";
import { NotesCard } from "./order-info/notes-card";
import { OrderDetailHeader } from "./order-info/order-detail-header";
import { OrderItemsCard } from "./order-info/order-items-card";
import { OrderOverview } from "./order-info/order-overview";
import { OrderSidebar } from "./order-info/order-sidebar";
import { PaymentHistoryCard } from "./order-info/payment-history-card";

export type EditSectionType = "customer" | "summary" | "status";

const ORDER_TABS = ["overview", "products", "payments", "notes"] as const;
type OrderTab = (typeof ORDER_TABS)[number];

function isOrderTab(value: string | null): value is OrderTab {
  return ORDER_TABS.includes(value as OrderTab);
}

function TabPanel({ value, children }: { value: OrderTab; children: ReactNode }) {
  return (
    <TabsContent
      value={value}
      className="scrollbar-slim min-h-0 pt-4 lg:overflow-y-auto lg:pr-1"
    >
      {children}
    </TabsContent>
  );
}

export function OrderDetailsClient({
  order,
  duplicateTrxCount,
}: {
  order: OrderWithDetails;
  duplicateTrxCount: number;
}) {
  // Modal URL parameters
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [addItemOpen, setAddItemOpen] = useModalParam("add-item");
  const [editItem, setEditItem] = useModalParam("edit-item");
  const [addPaymentOpen, setAddPaymentOpen] = useModalParam("add-payment");
  const [editPayment, setEditPayment] = useModalParam("edit-payment");
  const [editOrderInfo, setEditOrderInfo] = useModalParam("edit-order-info");
  const [editOrderSummary, setEditOrderSummary] =
    useModalParam("edit-order-summary");

  const [activeTab, setActiveTab] = useState<OrderTab>(() => {
    const tab = searchParams.get("tab");
    return isOrderTab(tab) ? tab : "overview";
  });

  // Replaced, not pushed, so the back button leaves the page, not the tab.
  const handleTabChange = (tab: OrderTab) => {
    setActiveTab(tab);

    const url = new URL(window.location.href);
    if (tab === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", tab);
    window.history.replaceState(window.history.state, "", url.toString());
  };

  const { finalTotal } = calculateOrderTotal(order);
  const paidAmount = order.payments.reduce((sum, p) => sum + p.amount, 0);

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
    <div className="flex min-h-full flex-col lg:h-svh lg:min-h-0">
      <OrderDetailHeader orderId={order.orderId} onDelete={handleDelete} />

      {/* On large screens each pane scrolls on its own */}
      <main className="flex flex-1 flex-col gap-4 p-4 lg:min-h-0 lg:flex-row lg:gap-5 lg:p-5">
        <OrderSidebar
          order={order}
          finalTotal={finalTotal}
          paidAmount={paidAmount}
          duplicateTrxCount={duplicateTrxCount}
          onEditClick={() => setEditOrderInfo("true")}
          onAddNote={() => handleTabChange("notes")}
          onAddPayment={() => setAddPaymentOpen("true")}
          onMarkPaid={() => markOrderPaid({ orderId: order.id })}
        />

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="min-w-0 flex-1 gap-0 lg:min-h-0"
        >
          <div className="sticky top-14 z-4 shrink-0 bg-dashboard-background py-1 lg:static lg:py-0">
            <TabsList className="w-full flex-wrap justify-start rounded-xl border border-border p-1 group-data-horizontal/tabs:h-auto">
              {[
                { value: "overview", label: "Overview", icon: LayoutGrid },
                {
                  value: "products",
                  label: "Products",
                  icon: Package,
                  count: order.orderItems.length,
                },
                {
                  value: "payments",
                  label: "Payments",
                  icon: CreditCard,
                  count: order.payments.length,
                },
                {
                  value: "notes",
                  label: "Notes",
                  icon: NotebookText,
                  count: order.notes.length,
                },
              ].map(({ value, label, icon: Icon, count }) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="h-9.5 min-w-fit rounded-lg px-3 data-active:text-primary"
                >
                  <Icon />
                  {label}
                  {count !== undefined && (
                    <span className="rounded-full bg-primary/10 px-1.5 text-[11px] font-medium text-primary tabular-nums">
                      {count}
                    </span>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabPanel value="overview">
            <OrderOverview
              order={order}
              finalTotal={finalTotal}
              paidAmount={paidAmount}
              onEditSummary={() => setEditOrderSummary("true")}
            />
          </TabPanel>

          <TabPanel value="products">
            <OrderItemsCard
              items={order.orderItems}
              onEdit={(id) => setEditItem(id)}
              onAdd={() => setAddItemOpen("true")}
              onDelete={(id) =>
                deleteOrderItem({ orderId: order.id, itemId: id })
              }
            />
          </TabPanel>

          <TabPanel value="payments">
            <PaymentHistoryCard
              payments={order.payments}
              finalTotal={finalTotal}
              orderStatus={order.status}
              orderPaymentMethod={order.orderPaymentMethod}
              onMarkPaid={() => markOrderPaid({ orderId: order.id })}
              onAdd={() => setAddPaymentOpen("true")}
              onEdit={(id) => setEditPayment(id)}
              onDelete={(id) =>
                deletePayment({ orderId: order.id, paymentId: id })
              }
            />
          </TabPanel>

          <TabPanel value="notes">
            <NotesCard
              orderId={order.id}
              notes={order.notes}
              onDelete={(id) => deleteNote({ orderId: order.id, noteId: id })}
            />
          </TabPanel>
        </Tabs>
      </main>

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

      <EditOrderInfoModal
        open={!!editOrderInfo}
        onOpenChange={(open) => !open && setEditOrderInfo(null)}
        orderId={order.id}
        initialData={{ ...order, emailAddress: order.emailAddress ?? "" }}
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
    </div>
  );
}
