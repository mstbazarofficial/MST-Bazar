function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function ProductTimelineCard({
  createdAt,
  updatedAt,
}: {
  createdAt: Date;
  updatedAt: Date;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 text-sm font-semibold text-foreground">Timeline</h2>
      <div className="space-y-3 text-sm">
        <div>
          <p className="text-muted-foreground">Created At</p>
          <p className="font-medium text-foreground">
            {formatDateTime(createdAt)}
          </p>
        </div>
        <div>
          <p className="text-muted-foreground">Updated At</p>
          <p className="font-medium text-foreground">
            {formatDateTime(updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
