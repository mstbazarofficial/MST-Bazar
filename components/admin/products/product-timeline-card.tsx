// components/admin/products/product-timeline-card.tsx
import { CirclePlus, RefreshCw } from "lucide-react";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Dhaka",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}
export function ProductTimelineCard({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date;
}) {
  const items = [
    { label: "Created", date: createdAt, icon: CirclePlus },
    { label: "Last updated", date: updatedAt, icon: RefreshCw },
  ];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Timeline
      </h2>
      <div className="space-y-4">
        {items.map(({ label, date, icon: Icon }, i) => (
          <div key={label} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#00a652]/10 text-[#00a652]">
                <Icon className="size-3.5" />
              </span>
              {i === 0 && <span className="mt-1 h-full w-px bg-border" />}
            </div>
            <div className="pb-1">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(date)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
