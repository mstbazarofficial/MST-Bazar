import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function EmptyState({ icon: Icon, title, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground",
        className,
      )}
    >
      <Icon className="size-6 opacity-50" />
      <p className="text-sm">{title}</p>
    </div>
  );
}

export function TableEmptyRow({
  colSpan,
  ...props
}: EmptyStateProps & { colSpan: number }) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan}>
        <EmptyState {...props} />
      </TableCell>
    </TableRow>
  );
}
