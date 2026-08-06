import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Campaign = {
  slug: string;
  headline: string;
  campaignPrice: number;
  deliveryCharge: number;
  endDate: Date | null;
  isActive: boolean;
};

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function ProductCampaignCard({
  campaign,
}: {
  campaign: Campaign | null;
}) {
  if (!campaign) return null;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Campaign</h2>
        <Badge
          variant="outline"
          className={cn(
            "border-transparent",
            campaign.isActive
              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
              : "bg-muted text-muted-foreground",
          )}
        >
          {campaign.isActive ? "Active" : "Inactive"}
        </Badge>
      </div>

      <p className="mb-3 text-sm font-medium text-foreground">
        {campaign.headline}
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Campaign Price</dt>
          <dd className="font-medium text-foreground">
            {formatCurrency(campaign.campaignPrice)}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-muted-foreground">Delivery Charge</dt>
          <dd className="font-medium text-foreground">
            {campaign.deliveryCharge > 0
              ? formatCurrency(campaign.deliveryCharge)
              : "৳0 (Free)"}
          </dd>
        </div>
        {campaign.endDate && (
          <div className="flex items-center justify-between">
            <dt className="text-muted-foreground">End Date</dt>
            <dd className="font-medium text-foreground">
              {formatDate(campaign.endDate)}
            </dd>
          </div>
        )}
      </dl>

      <Link
        href={`/admin/campaigns/${campaign.slug}`}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "mt-4 w-full",
        )}
      >
        View Campaign
      </Link>
    </div>
  );
}
