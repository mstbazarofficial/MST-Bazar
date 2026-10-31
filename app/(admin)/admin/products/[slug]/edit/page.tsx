"use client";

import { ProductFormPage } from "@/components/admin/products/product-form-page";
import { adminFetch } from "@/lib/admin-fetch";
import { useQuery } from "@tanstack/react-query";
import { notFound, useParams } from "next/navigation";
import EditProductLoading from "./loading";

export default function EditProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(params.slug);

  const { data: product } = useQuery({
    queryKey: ["admin-product-edit", slug],
    queryFn: () => adminFetch("product", { slug }),
    staleTime: 0,
    gcTime: 0,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => adminFetch("categories"),
  });

  if (product === undefined || !categories) return <EditProductLoading />;
  if (product === null) notFound();

  return (
    <ProductFormPage
      mode="edit"
      productId={product.id}
      categories={categories}
      initialValues={{
        title: product.title,
        inputSlug: product.slug,
        brand: product.brand ?? "",
        unit: product.unit ?? "",
        price: product.price,
        discountPercentage: product.discountPercentage,
        shortDescription: product.shortDescription ?? "",
        isBestDeal: product.isBestDeal,
        isAvailable: product.isAvailable,
        categoryId: product.categoryId,
        images: product.images,
        isPopular: product.isPopular,
        isCombo: product.isCombo,
        priority: product.priority,
        isTopSelling: product.isTopSelling,
        productDetails: product.productDetails ?? "",
      }}
    />
  );
}
