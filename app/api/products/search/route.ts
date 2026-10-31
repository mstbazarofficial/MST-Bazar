import { getAllProducts, type ProductSearchResult } from "@/lib/data/catalog";
import { NextResponse, type NextRequest } from "next/server";

const MAX_RESULTS = 5;
const MAX_QUERY_LENGTH = 100;

export async function GET(request: NextRequest) {
  const q = (request.nextUrl.searchParams.get("q") ?? "")
    .trim()
    .slice(0, MAX_QUERY_LENGTH)
    .toLowerCase();

  if (!q) return NextResponse.json([]);

  const products = await getAllProducts();
  const results: ProductSearchResult[] = products
    .filter((product) => product.title.toLowerCase().includes(q))
    .slice(0, MAX_RESULTS)
    .map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      unit: product.unit,
      price: product.price,
      discountPercentage: product.discountPercentage,
      isBestDeal: product.isBestDeal,
      isPopular: product.isPopular,
      images: product.images,
    }));

  return NextResponse.json(results);
}
