"use client";

import type { getAdminUserDetail } from "@/actions/admin/user-actions";
import {
  getInitials,
  getWhatsAppUrl,
  Property,
  QuickAction,
  RailSection,
} from "@/components/admin/orders/order-info/order-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Role } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { formatDate, formatDateTime } from "@/utils/format-date";
import {
  AlertTriangle,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

export type AdminUser = NonNullable<
  Awaited<ReturnType<typeof getAdminUserDetail>>
>;

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Admin",
  MODERATOR: "Moderator",
  CUSTOMER: "Customer",
};

const ROLE_STYLES: Record<Role, string> = {
  ADMIN: "bg-violet-500/15 text-violet-700 dark:text-violet-400",
  MODERATOR: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  CUSTOMER: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

export function UserSidebar({
  user,
  onEdit,
}: {
  user: AdminUser;
  onEdit: () => void;
}) {
  const whatsappNumber = user.whatsappNumber || user.phoneNumber;

  return (
    <aside className="scrollbar-slim shrink-0 overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:w-88 lg:overflow-y-auto xl:w-96">
      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
              <UserRound className="size-3.5" />
              User
            </p>
            <div className="flex items-center gap-1.5">
              {user.banned && <Badge variant="destructive">Banned</Badge>}
              <Badge
                variant="outline"
                className={cn("border-transparent", ROLE_STYLES[user.role])}
              >
                {ROLE_LABELS[user.role]}
              </Badge>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <Avatar className="size-14">
              <AvatarImage src={user.image ?? ""} alt={user.name} />
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold wrap-break-word text-foreground">
                {user.name}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Joined {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start justify-between gap-1 px-1">
          <QuickAction
            icon={Phone}
            label="Call"
            href={user.phoneNumber ? `tel:${user.phoneNumber}` : undefined}
          />
          <QuickAction icon={Mail} label="Email" href={`mailto:${user.email}`} />
          <QuickAction
            icon={MessageCircle}
            label="WhatsApp"
            href={whatsappNumber ? getWhatsAppUrl(whatsappNumber) : undefined}
          />
          <span className="mt-2 h-7 w-px shrink-0 bg-border" />
          <QuickAction icon={Pencil} label="Edit" onClick={onEdit} />
        </div>

        {user.banned && (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            <p>
              {user.banExpires
                ? `Banned until ${formatDate(user.banExpires)}.`
                : "Banned permanently."}
              {user.banReason && ` Reason: ${user.banReason}`}
            </p>
          </div>
        )}
      </div>

      <RailSection
        title="Contact"
        action={
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs"
            onClick={onEdit}
          >
            <Pencil className="size-3" />
            Edit
          </Button>
        }
      >
        <dl className="space-y-3">
          <Property
            label="Phone"
            value={user.phoneNumber || "Not provided"}
            copyLabel={user.phoneNumber ? "phone number" : undefined}
          />
          {user.whatsappNumber && user.whatsappNumber !== user.phoneNumber && (
            <Property
              label="WhatsApp"
              value={user.whatsappNumber}
              copyLabel="WhatsApp number"
            />
          )}
          <Property label="Email" value={user.email} copyLabel="email" />
          <Property
            label="Address"
            value={user.fullAddress || "Not provided"}
            copyLabel={user.fullAddress ? "address" : undefined}
          />
        </dl>
      </RailSection>

      <RailSection title="Account">
        <dl className="grid grid-cols-2 gap-3">
          <Property label="Role" value={ROLE_LABELS[user.role]} />
          <div>
            <dt className="text-xs text-muted-foreground">Email status</dt>
            <dd className="flex items-center gap-1 text-sm leading-relaxed text-foreground">
              {user.emailVerified && (
                <ShieldCheck className="size-3.5 text-emerald-700 dark:text-emerald-400" />
              )}
              {user.emailVerified ? "Verified" : "Not verified"}
            </dd>
          </div>
          <div className="col-span-2">
            <Property
              label="User ID"
              value={user.id}
              copyLabel="user ID"
              mono
            />
          </div>
        </dl>
      </RailSection>

      <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
        Last updated {formatDateTime(user.updatedAt)}
      </p>
    </aside>
  );
}
