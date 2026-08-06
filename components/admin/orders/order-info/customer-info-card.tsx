import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BadgeCheck,
  Mail,
  MapPin,
  MessageCircle,
  Pencil,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import Image from "next/image";

type CustomerInfo = {
  userId?: string | null;
  user?: {
    image?: string | null;
  } | null;
  customerName: string;
  emailAddress: string;
  phoneNumber: string;
  whatsappNumber: string | null;
  fullAddress: string;
};

export function CustomerInfoCard({
  order,
  onEditClick,
}: {
  order: CustomerInfo;
  onEditClick: () => void;
}) {
  const isRegistered = Boolean(order.userId);
  const avatarUrl = order.user?.image;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <User className="size-4" />
            Customer Info
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
        {/* Customer Name & Avatar */}
        <div className="flex items-start gap-3">
          {avatarUrl ? (
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-emerald-500/30 bg-muted">
              <Image
                src={avatarUrl}
                alt={order.customerName}
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
          ) : (
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
                isRegistered
                  ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
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

          <div>
            <p className="text-xs text-muted-foreground">Customer Name</p>
            <p className="text-sm font-semibold text-foreground">
              {order.customerName}
            </p>
          </div>
        </div>

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
      </CardContent>
    </Card>
  );
}
