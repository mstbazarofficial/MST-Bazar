import { Panel } from "@/components/dashboard/layout/dashboard-panel";
import Link from "next/link";

interface DeliveryDetailsProps {
  phoneNumber?: string | null;
  fullAddress?: string | null;
}

export default function DeliveryDetails({
  phoneNumber,
  fullAddress,
}: DeliveryDetailsProps) {
  const isComplete = !!phoneNumber && !!fullAddress;

  return (
    <Panel
      title="Delivery details"
      description={
        isComplete ? undefined : "Add these to fill in checkout automatically."
      }
      action={
        <Link
          href="/dashboard/profile?edit-profile=true"
          className="shrink-0 text-sm font-medium text-primary-dark hover:underline"
        >
          {isComplete ? "Edit" : "Add"}
        </Link>
      }
    >
      <dl className="space-y-3 px-5 pb-5 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Phone</dt>
          <dd className="mt-0.5 text-foreground">
            {phoneNumber || "Not added"}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Address</dt>
          <dd className="mt-0.5 wrap-break-word text-foreground">
            {fullAddress || "Not added"}
          </dd>
        </div>
      </dl>
    </Panel>
  );
}
