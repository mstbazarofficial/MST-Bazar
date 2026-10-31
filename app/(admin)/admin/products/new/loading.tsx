import { ProductFormSkeleton } from "@/components/admin/layout/loading-skeletons";

export default function NewProductLoading() {
  return (
    <ProductFormSkeleton
      title="Add New Product"
      actionWidths={["w-24", "w-32"]}
    />
  );
}
