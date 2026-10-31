// components/admin/products/product-descriptions.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export function ProductDescriptions({
  productDetails,
}: {
  productDetails: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Product details
        </CardTitle>
      </CardHeader>
      <CardContent>
        {productDetails ? (
          <div
            className="prose prose-sm max-w-none text-foreground/80 prose-headings:text-foreground prose-strong:text-foreground prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: productDetails }}
          />
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border text-center text-muted-foreground">
            <FileText className="size-5" />
            <p className="text-sm">No product details added yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
