"use client";

import { OrderStatusSelect } from "@/components/admin/orders/order-quick-actions";
import type { DeleteDialogActionType } from "@/components/my-ui/delete-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import type { OrderStatus, PaymentMethod } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/utils/format-date";
import { formatPaymentMethod } from "@/utils/format-payment-method";
import { formatPrice } from "@/utils/format-price";
import { canMarkOrderPaid } from "@/utils/order-status";
import {
  AlertTriangle,
  ChevronRight,
  CircleDollarSign,
  Mail,
  MessageCircle,
  NotebookText,
  Pencil,
  Phone,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";
import { MarkPaidButton } from "./mark-paid-button";

type SidebarOrder = {
  id: string;
  orderId: string;
  status: OrderStatus;
  userId?: string | null;
  user?: { image?: string | null } | null;
  customerName: string;
  emailAddress: string | null;
  phoneNumber: string;
  whatsappNumber: string | null;
  fullAddress: string;
  orderPaymentMethod: PaymentMethod;
  TrxNumber?: string | null;
  TrxID?: string | null;
  orderDate: Date;
  updatedAt: Date;
};

// Numbers are stored in the local 01XXXXXXXXX form; wa.me needs the country code.
export function getWhatsAppUrl(number: string) {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits.startsWith("0") ? `88${digits}` : digits}`;
}

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function QuickAction({
  icon: Icon,
  label,
  href,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: () => void;
}) {
  const labelClass =
    "flex flex-col items-center gap-1.5 text-xs font-medium text-foreground";

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={labelClass}>
        <span
          className={buttonVariants({
            variant: "outline",
            size: "icon",
            className: "size-11 rounded-full",
          })}
        >
          <Icon className="size-4.5" />
        </span>
        {label}
      </button>
    );
  }

  const iconClass = buttonVariants({
    size: "icon",
    className: "size-11 rounded-full",
  });

  if (!href) {
    return (
      <span className={cn(labelClass, "text-muted-foreground")}>
        <span className={cn(iconClass, "pointer-events-none opacity-40")}>
          <Icon className="size-4.5" />
        </span>
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={labelClass}
    >
      <span className={iconClass}>
        <Icon className="size-4.5" />
      </span>
      {label}
    </a>
  );
}

function CustomerChip({ order }: { order: SidebarOrder }) {
  const avatarUrl = order.user?.image;

  const content = (
    <>
      <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={order.customerName}
            fill
            sizes="36px"
            className="object-cover"
          />
        ) : (
          getInitials(order.customerName)
        )}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
        {order.customerName}
      </span>
      <span className="shrink-0 text-xs text-muted-foreground">
        {order.userId ? "Registered" : "Guest"}
      </span>
      {order.userId && (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </>
  );

  const className = "flex items-center gap-3 rounded-xl border border-border p-2.5";

  if (order.userId) {
    return (
      <Link
        href={`/admin/users/${order.userId}`}
        className={cn(className, "transition-colors hover:bg-muted/60")}
      >
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}

export function RailSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 border-t border-border px-5 py-4">
      <div className="flex min-h-7 items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Property({
  label,
  value,
  copyLabel,
  mono,
}: {
  label: string;
  value: string;
  copyLabel?: string;
  mono?: boolean;
}) {
  return (
    <div className="group/property">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="flex items-start justify-between gap-2">
        <span
          className={cn(
            "min-w-0 text-sm leading-relaxed wrap-break-word text-foreground",
            mono && "font-mono",
          )}
        >
          {value}
        </span>
        {copyLabel && (
          <CopyButton
            value={value}
            label={copyLabel}
            className="shrink-0 focus-visible:opacity-100 lg:opacity-0 lg:group-hover/property:opacity-100"
          />
        )}
      </dd>
    </div>
  );
}

export function OrderSidebar({
  order,
  finalTotal,
  paidAmount,
  duplicateTrxCount,
  onEditClick,
  onAddNote,
  onAddPayment,
  onMarkPaid,
}: {
  order: SidebarOrder;
  finalTotal: number;
  paidAmount: number;
  duplicateTrxCount: number;
  onEditClick: () => void;
  onAddNote: () => void;
  onAddPayment: () => void;
  onMarkPaid: () => DeleteDialogActionType;
}) {
  const whatsappNumber = order.whatsappNumber || order.phoneNumber;
  const due = finalTotal - paidAmount;
  const paidPercent =
    finalTotal > 0 ? Math.min((paidAmount / finalTotal) * 100, 100) : 0;
  const isClosed = order.status === "CANCELLED" || order.status === "RETURNED";

  const editButton = (
    <Button
      size="sm"
      variant="ghost"
      className="h-7 px-2 text-xs"
      onClick={onEditClick}
    >
      <Pencil className="size-3" />
      Edit
    </Button>
  );

  return (
    <aside className="scrollbar-slim shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:w-88 lg:overflow-y-auto xl:w-96">
      <div className="space-y-4 p-5">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <ShoppingBag className="size-3.5" />
            Order
          </p>
          <div className="mt-2 flex items-center gap-1">
            <h1 className="min-w-0 truncate text-xl font-semibold text-foreground">
              {order.orderId}
            </h1>
            <CopyButton value={order.orderId} label="order ID" />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Placed {formatDate(order.orderDate)} ·{" "}
            <span className="font-semibold text-foreground">
              {formatPrice(finalTotal)}
            </span>
          </p>
        </div>

        <CustomerChip order={order} />

        <div className="flex items-start justify-between gap-1 px-1">
          <QuickAction
            icon={Phone}
            label="Call"
            href={`tel:${order.phoneNumber}`}
          />
          <QuickAction
            icon={Mail}
            label="Email"
            href={
              order.emailAddress ? `mailto:${order.emailAddress}` : undefined
            }
          />
          <QuickAction
            icon={MessageCircle}
            label="WhatsApp"
            href={getWhatsAppUrl(whatsappNumber)}
          />
          <span className="mt-2 h-7 w-px shrink-0 bg-border" />
          <QuickAction icon={NotebookText} label="Note" onClick={onAddNote} />
          <QuickAction
            icon={CircleDollarSign}
            label="Payment"
            onClick={onAddPayment}
          />
        </div>
      </div>

      <section className="space-y-4 border-t border-border p-5">
        <div className="space-y-2">
          <div className="flex items-baseline justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Customer paid</span>
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {formatPrice(paidAmount)}
              </span>{" "}
              of {formatPrice(finalTotal)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${paidPercent}%` }}
            />
          </div>
          {!isClosed && (
            <p className="text-xs font-medium text-foreground">
              {due > 0 ? `Due ${formatPrice(due)}` : "Fully paid"}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Status</p>
          <OrderStatusSelect order={order} className="w-full" />
        </div>

        {canMarkOrderPaid({ ...order, due }) && (
          <MarkPaidButton
            amount={due}
            onMarkPaid={onMarkPaid}
            variant="outline"
            className="w-full"
          />
        )}
      </section>

      <RailSection title="Contact" action={editButton}>
        <dl className="space-y-3">
          <Property
            label="Phone"
            value={order.phoneNumber}
            copyLabel="phone number"
          />
          {order.whatsappNumber &&
            order.whatsappNumber !== order.phoneNumber && (
              <Property
                label="WhatsApp"
                value={order.whatsappNumber}
                copyLabel="WhatsApp number"
              />
            )}
          <Property
            label="Email"
            value={order.emailAddress || "No email"}
            copyLabel={order.emailAddress ? "email" : undefined}
          />
          <Property
            label="Shipping address"
            value={order.fullAddress}
            copyLabel="shipping address"
          />
        </dl>
      </RailSection>

      <RailSection title="Payment details" action={editButton}>
        <dl className="space-y-3">
          <Property
            label="Method"
            value={formatPaymentMethod(order.orderPaymentMethod)}
          />
          {order.TrxNumber && (
            <Property
              label="Transaction number"
              value={order.TrxNumber}
              copyLabel="transaction number"
              mono
            />
          )}
          {order.TrxID && (
            <Property
              label="Transaction ID / Reference"
              value={order.TrxID}
              copyLabel="transaction ID"
              mono
            />
          )}
        </dl>

        {duplicateTrxCount > 0 && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <p>
              This TrxID is also used on {duplicateTrxCount} other{" "}
              {duplicateTrxCount === 1 ? "order" : "orders"}. Check before
              accepting this payment.
            </p>
          </div>
        )}
      </RailSection>

      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Last updated {formatDateTime(order.updatedAt)}
      </p>
    </aside>
  );
}
