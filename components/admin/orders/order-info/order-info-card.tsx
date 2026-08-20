import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PaymentMethod } from "@/generated/prisma/enums";
import {
  BadgeCheck,
  CreditCard,
  ExternalLink,
  Hash,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  Receipt,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type OrderInfo = {
  userId?: string | null;
  user?: {
    image?: string | null;
  } | null;
  customerName: string;
  emailAddress: string;
  phoneNumber: string;
  whatsappNumber: string | null;
  fullAddress: string;
  orderPaymentMethod: PaymentMethod;
  TrxNumber?: string | null;
  TrxID?: string | null;
};

const formatPaymentMethod = (method: PaymentMethod) => {
  const map: Record<PaymentMethod, string> = {
    CASH_ON_DELIVERY: "Cash on Delivery",
    BKASH: "bKash",
    ROCKET: "Rocket",
    NAGAD: "Nagad",
    BANK_TRANSFER: "Bank Transfer",
    CARD: "Card Payment",
    OTHER: "Other",
  };
  return map[method] || method;
};

export function OrderInfoCard({
  order,
  onEditClick,
}: {
  order: OrderInfo;
  onEditClick: () => void;
}) {
  const isRegistered = Boolean(order.userId);
  const avatarUrl = order.user?.image;

  // Render the customer header details (avatar + name)
  const renderCustomerHeader = () => {
    const content = (
      <>
        {avatarUrl ? (
          <div
            className={`relative size-9 shrink-0 overflow-hidden rounded-full border bg-muted transition-transform ${
              isRegistered
                ? "border-emerald-500/50 group-hover:scale-105"
                : "border-border"
            }`}
          >
            <Image
              src={avatarUrl}
              alt={order.customerName}
              fill
              sizes="36px"
              className="object-cover"
            />
          </div>
        ) : (
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-transform ${
              isRegistered
                ? "bg-emerald-500/15 text-emerald-600 group-hover:scale-105 dark:bg-emerald-500/20 dark:text-emerald-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {isRegistered ? (
              <UserCheck className="size-4" />
            ) : (
              <User className="size-4" />
            )}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-muted-foreground">Customer Name</p>
            {isRegistered && (
              <ExternalLink className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            )}
          </div>
          <p
            className={`text-sm font-semibold truncate ${
              isRegistered
                ? "text-emerald-950 dark:text-emerald-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:underline"
                : "text-foreground"
            }`}
          >
            {order.customerName}
          </p>
        </div>
      </>
    );

    if (isRegistered && order.userId) {
      return (
        <Link
          href={`/admin/users/${order.userId}`}
          className="group flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2.5 transition-colors hover:border-emerald-500/40 hover:bg-emerald-500/10 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20"
        >
          {content}
        </Link>
      );
    }

    return <div className="flex items-start gap-3 p-1">{content}</div>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-4" />
            Customer & Order Info
          </CardTitle>

          <div className="flex items-center gap-2">
            {isRegistered ? (
              <Badge
                variant="secondary"
                className="gap-1 border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
              >
                <BadgeCheck className="size-3" />
                Registered
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="px-2 py-0.5 text-[11px] font-normal text-muted-foreground"
              >
                Guest
              </Badge>
            )}

            <Button size="sm" variant="outline" onClick={onEditClick}>
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3.5">
        {/* Customer Name & Avatar (Clickable if linked) */}
        {renderCustomerHeader()}

        {/* Email */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Mail className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm text-foreground">{order.emailAddress}</p>
          </div>
        </div>

        {/* Phone */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Phone className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Phone</p>
            <p className="text-sm text-foreground">{order.phoneNumber}</p>
          </div>
        </div>

        {/* WhatsApp */}
        {order.whatsappNumber && order.whatsappNumber !== order.phoneNumber && (
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MessageCircle className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
              <p className="text-sm text-foreground">{order.whatsappNumber}</p>
            </div>
          </div>
        )}

        {/* Shipping Address */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <MapPin className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Shipping Address</p>
            <p className="text-sm leading-relaxed text-foreground">
              {order.fullAddress}
            </p>
          </div>
        </div>

        <div className="my-2 border-t border-border/60" />

        {/* Payment Method */}
        <div className="flex items-start gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <CreditCard className="size-4" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Payment Method</p>
            <p className="text-sm font-medium text-foreground">
              {formatPaymentMethod(order.orderPaymentMethod)}
            </p>
          </div>
        </div>

        {/* Transaction Number */}
        {order.TrxNumber && (
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Hash className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Transaction Number
              </p>
              <p className="font-mono text-sm text-foreground">
                {order.TrxNumber}
              </p>
            </div>
          </div>
        )}

        {/* Transaction ID / Ref */}
        {order.TrxID && (
          <div className="flex items-start gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <Receipt className="size-4" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Transaction ID / Reference
              </p>
              <p className="font-mono text-sm text-foreground">{order.TrxID}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
