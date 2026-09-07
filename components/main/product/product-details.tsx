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
        className="
    prose
    prose-sm
    sm:prose-lg
    max-w-none

    text-foreground/90

    prose-headings:text-foreground
    prose-headings:font-bold

    prose-p:tracking-normal
    prose-p:my-2
    prose-hr:my-8

    prose-strong:text-foreground

    prose-a:text-primary

    prose-ul:my-4
    prose-li:my-1

    prose-blockquote:border-primary
    prose-blockquote:text-muted-foreground

    prose-table:
    prose-th:border
    prose-th:pl-4
    prose-th:bg-sky-200/50
    prose-th:text-foreground
    prose-th:font-bold
    prose-td:border
    prose-td:pl-4
    prose-td:py-0

    prose-img:max-w-full
  "
        dangerouslySetInnerHTML={{
          __html: longDescription,
        }}
      />
    </div>
  );
}
