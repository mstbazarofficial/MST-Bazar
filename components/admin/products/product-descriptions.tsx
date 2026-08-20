// components/admin/products/product-descriptions.tsx
import { FileText } from "lucide-react";

export function ProductDescriptions({
  productDetails,
}: {
  productDetails: string | null;
}) {
  if (!productDetails) {
    return (
      <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-muted/20 text-center text-muted-foreground">
        <FileText className="size-5" />
        <p className="text-sm">No product details added yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h2 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <FileText className="size-3.5" />
        Product details
      </h2>
      <div
        className="prose prose-sm max-w-none text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-a:text-[#00a652]"
        dangerouslySetInnerHTML={{ __html: productDetails }}
      />
    </div>
  );
}
