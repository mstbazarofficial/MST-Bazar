export function ProductDetails({
  longDescription,
}: {
  longDescription: string | null;
}) {
  if (!longDescription) return null;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground sm:text-xl">
        Product Details
      </h2>

      <div
        className="prose prose-sm sm:prose-base max-w-none text-foreground/90 prose-headings:text-foreground prose-a:text-primary"
        dangerouslySetInnerHTML={{ __html: longDescription }}
      />
    </div>
  );
}
