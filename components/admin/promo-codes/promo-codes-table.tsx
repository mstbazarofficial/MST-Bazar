import type { getAdminPromoCodes } from "@/actions/admin/promo-code-actions";
import { TableEmptyRow } from "@/components/admin/layout/empty-state";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PromoStatus } from "@/utils/calculate-promo-discount";
import { formatDate } from "@/utils/format-date";
import { formatPrice } from "@/utils/format-price";
import { TicketPercent } from "lucide-react";
import { PromoCodeRowActions } from "./promo-code-row-actions";

type PromoCodeRow = Awaited<ReturnType<typeof getAdminPromoCodes>>[number];

const STATUS_BADGES: Record<PromoStatus, { label: string; className: string }> =
  {
    ACTIVE: {
      label: "Active",
      className: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
    },
    PAUSED: {
      label: "Paused",
      className: "bg-gray-500/15 text-gray-700 dark:text-gray-400",
    },
    SCHEDULED: {
      label: "Scheduled",
      className: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    },
    EXPIRED: {
      label: "Expired",
      className: "bg-red-500/15 text-red-700 dark:text-red-400",
    },
    USED_UP: {
      label: "Used up",
      className: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    },
  };

function formatDiscount(promo: PromoCodeRow) {
  if (promo.discountType === "FIXED") return formatPrice(promo.discountValue);

  return promo.maxDiscount === null
    ? `${promo.discountValue}%`
    : `${promo.discountValue}%, up to ${formatPrice(promo.maxDiscount)}`;
}

function formatSchedule({ startsAt, endsAt }: PromoCodeRow) {
  if (!startsAt && !endsAt) return "Always";

  // endsAt is exclusive, so the last valid day is the one before it.
  const lastDay = endsAt && new Date(endsAt.getTime() - 1);

  return `${startsAt ? formatDate(startsAt) : "Now"} – ${
    lastDay ? formatDate(lastDay) : "No end"
  }`;
}

export function PromoCodesTable({
  promoCodes,
}: {
  promoCodes: PromoCodeRow[];
}) {
  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-48 pl-4">Code</TableHead>
            <TableHead className="min-w-36">Discount</TableHead>
            <TableHead className="w-32">Min. Order</TableHead>
            <TableHead className="min-w-52">Valid</TableHead>
            <TableHead className="w-28 text-center">Used</TableHead>
            <TableHead className="w-28 text-center">Status</TableHead>
            <TableHead className="w-36 pr-4 text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promoCodes.length === 0 && (
            <TableEmptyRow
              colSpan={7}
              icon={TicketPercent}
              title="No promo codes yet."
            />
          )}

          {promoCodes.map((promo) => {
            const badge = STATUS_BADGES[promo.status];

            return (
              <TableRow key={promo.id}>
                <TableCell className="pl-4">
                  <p className="font-mono text-sm font-semibold text-foreground">
                    {promo.code}
                  </p>
                  {promo.description && (
                    <p className="text-xs text-muted-foreground">
                      {promo.description}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-sm">
                  {formatDiscount(promo)}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {promo.minOrderAmount > 0
                    ? formatPrice(promo.minOrderAmount)
                    : "None"}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatSchedule(promo)}
                </TableCell>
                <TableCell className="text-center text-sm font-medium">
                  {promo.usedCount}
                  {promo.usageLimit !== null && ` / ${promo.usageLimit}`}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant="outline"
                    className={`border-transparent ${badge.className}`}
                  >
                    {badge.label}
                  </Badge>
                </TableCell>
                <TableCell className="pr-4">
                  <PromoCodeRowActions
                    promoCodeId={promo.id}
                    code={promo.code}
                    isActive={promo.isActive}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
