import { PageHeader } from "@/components/admin/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const INPUT = "h-9";
const SWITCH_ROW = "h-16";

export function FiltersBarSkeleton({
  stackUntil = "lg",
  selectWidths = ["sm:w-44", "sm:w-44"],
}: {
  stackUntil?: "sm" | "lg";
  selectWidths?: string[];
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        stackUntil === "sm"
          ? "sm:flex-row sm:items-center"
          : "lg:flex-row lg:items-center",
      )}
    >
      <Skeleton
        className={cn(
          "h-10 w-full",
          stackUntil === "sm" ? "sm:flex-1" : "lg:flex-1",
        )}
      />
      <div className="flex w-full gap-3 sm:w-auto">
        {selectWidths.map((width, i) => (
          <Skeleton key={i} className={cn("h-10 w-1/2", width)} />
        ))}
      </div>
    </div>
  );
}

export type SkeletonColumn = {
  head: string;
  headClassName?: string;
  cellClassName?: string;
  cell: React.ReactNode;
};

export function TableSkeleton({
  columns,
  rows = 6,
}: {
  columns: SkeletonColumn[];
  rows?: number;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.head} className={column.headClassName}>
              {column.head}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, row) => (
          <TableRow key={row}>
            {columns.map((column) => (
              <TableCell key={column.head} className={column.cellClassName}>
                {column.cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type FormSection = {
  title: string;
  /** Grid columns for the labelled fields. */
  grid?: string;
  /** Height class of each labelled field's control. */
  fields?: string[];
  /** Unlabelled blocks under the fields, such as switch rows. */
  blocks?: string[];
};

function FormSectionSkeleton({ title, grid, fields, blocks }: FormSection) {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold tracking-tight">{title}</h2>

      {fields && (
        <div className={cn("grid grid-cols-1 gap-4", grid)}>
          {fields.map((height, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className={cn("w-full", height)} />
            </div>
          ))}
        </div>
      )}

      {blocks && (
        <div className={cn("space-y-4", fields && "mt-4")}>
          {blocks.map((block, i) => (
            <Skeleton key={i} className={cn("w-full", block)} />
          ))}
        </div>
      )}
    </section>
  );
}

function FormPageSkeleton({
  title,
  backHref,
  actionWidths = ["w-32"],
  maxWidth = "max-w-4xl",
  sections,
}: {
  title: string;
  backHref: string;
  actionWidths?: string[];
  maxWidth?: string;
  sections: FormSection[];
}) {
  return (
    <>
      <PageHeader
        title={title}
        backHref={backHref}
        actions={actionWidths.map((width, i) => (
          <Skeleton key={i} className={cn("h-9", width)} />
        ))}
      />

      <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">
        <div className={cn("mx-auto flex flex-col gap-8", maxWidth)}>
          {sections.map((section) => (
            <FormSectionSkeleton key={section.title} {...section} />
          ))}
        </div>
      </main>
    </>
  );
}

export function ProductFormSkeleton({
  title,
  actionWidths,
}: {
  title: string;
  actionWidths?: string[];
}) {
  return (
    <FormPageSkeleton
      title={title}
      backHref="/admin/products"
      actionWidths={actionWidths}
      sections={[
        {
          title: "1. Basic Information",
          grid: "sm:grid-cols-2",
          fields: [INPUT, INPUT, INPUT, INPUT],
        },
        {
          title: "2. Pricing & Inventory",
          grid: "sm:grid-cols-2 lg:grid-cols-4",
          fields: [INPUT, INPUT, INPUT, INPUT],
          blocks: ["h-16"],
        },
        { title: "3. Media", fields: ["h-40"] },
        { title: "4. Product Details", fields: ["h-24", "h-64"] },
        {
          title: "5. Visibility & Settings",
          fields: [INPUT, INPUT],
          blocks: [SWITCH_ROW, SWITCH_ROW, SWITCH_ROW, SWITCH_ROW],
        },
      ]}
    />
  );
}

export function CategoryFormSkeleton({ title }: { title: string }) {
  return (
    <FormPageSkeleton
      title={title}
      backHref="/admin/categories"
      sections={[
        {
          title: "1. Basic Information",
          grid: "sm:grid-cols-2",
          fields: [INPUT, INPUT, INPUT],
        },
        { title: "2. Category Image", fields: ["h-48"] },
      ]}
    />
  );
}

export function BannerFormSkeleton({ title }: { title: string }) {
  return (
    <FormPageSkeleton
      title={title}
      backHref="/admin/banners"
      maxWidth="max-w-3xl"
      sections={[
        { title: "1. Placement", fields: [INPUT] },
        { title: "2. Image", fields: ["h-48"] },
        {
          title: "3. Details",
          grid: "sm:grid-cols-2",
          fields: [INPUT, INPUT],
        },
        {
          title: "4. Visibility & Settings",
          fields: [INPUT],
          blocks: [SWITCH_ROW],
        },
      ]}
    />
  );
}

export function PromoCodeFormSkeleton({ title }: { title: string }) {
  return (
    <FormPageSkeleton
      title={title}
      backHref="/admin/promo-codes"
      maxWidth="max-w-3xl"
      sections={[
        { title: "1. Code", grid: "sm:grid-cols-2", fields: [INPUT, INPUT] },
        {
          title: "2. Discount",
          grid: "sm:grid-cols-2",
          fields: [INPUT, INPUT, INPUT, INPUT],
        },
        { title: "3. Dates", grid: "sm:grid-cols-2", fields: [INPUT, INPUT] },
        {
          title: "4. Limits & Settings",
          grid: "sm:grid-cols-2",
          fields: [INPUT, INPUT],
          blocks: [SWITCH_ROW],
        },
      ]}
    />
  );
}

export function OrderFormSkeleton() {
  return (
    <FormPageSkeleton
      title="Add New Order"
      backHref="/admin/orders"
      sections={[
        {
          title: "1. Customer Details",
          grid: "sm:grid-cols-2",
          fields: [INPUT, INPUT, INPUT, INPUT],
          blocks: ["h-20"],
        },
        { title: "2. Order Items", blocks: ["h-72"] },
        {
          title: "3. Summary, Payment & Status",
          grid: "sm:grid-cols-2",
          fields: ["h-80", "h-80"],
        },
      ]}
    />
  );
}
