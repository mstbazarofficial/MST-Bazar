type ProductDescriptionsProps = {
  productDetails: string | null;
};

export function ProductDescriptions({
  productDetails,
}: ProductDescriptionsProps) {
  return (
    <div>
      {productDetails && (
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 text-sm font-semibold text-foreground">
            Product Details
          </h2>
          <div
            className="prose prose-sm max-w-none text-muted-foreground prose-headings:text-foreground prose-strong:text-foreground"
            dangerouslySetInnerHTML={{ __html: productDetails }}
          />
        </div>
      )}
    </div>
  );
}
