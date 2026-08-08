import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "../../common/card/product-card";
import HeadingStyle2 from "../../common/HeadingStyle2";

export function RecentlyPurchasedSection() {
  const products = [
    {
      id: "prod-mst-001",
      title: "Premium Raw Mustard Honey",
      slug: "premium-raw-mustard-honey",
      unit: "500g",
      price: 450,
      discountPercentage: 10,
      isBestDeal: true,
      isPopular: true,
      categoryId: "cat-honey-01",
      category: {
        id: "cat-honey-01",
        name: "Natural Honey",
        slug: "natural-honey",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1587049352851-8d4c0b42e114?auto=format&fit=crop&w=800&q=80",
          isFeatured: true,
        },
        {
          url: "https://images.unsplash.com/photo-1610450947754-069a19fb5917?auto=format&fit=crop&w=800&q=80",
          isFeatured: false,
        },
      ],
    },
    {
      id: "prod-mst-002",
      title: "Pure Desi Cow Ghee",
      slug: "pure-desi-cow-ghee",
      unit: "250g",
      price: 550,
      discountPercentage: 0,
      isBestDeal: false,
      isPopular: true,
      categoryId: "cat-ghee-oil-02",
      category: {
        id: "cat-ghee-oil-02",
        name: "Ghee & Oils",
        slug: "ghee-and-oils",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80",
          isFeatured: true,
        },
      ],
    },
    {
      id: "prod-mst-003",
      title: "Premium Miniket Rice",
      slug: "premium-miniket-rice",
      unit: "5kg",
      price: 420,
      discountPercentage: 5,
      isBestDeal: true,
      isPopular: false,
      categoryId: "cat-rice-03",
      category: {
        id: "cat-rice-03",
        name: "Rice & Grains",
        slug: "rice-and-grains",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
          isFeatured: true,
        },
      ],
    },
    {
      id: "prod-mst-004",
      title: "Cold Pressed Mustard Oil",
      slug: "cold-pressed-mustard-oil",
      unit: "1L",
      price: 280,
      discountPercentage: 15,
      isBestDeal: true,
      isPopular: true,
      categoryId: "cat-ghee-oil-02",
      category: {
        id: "cat-ghee-oil-02",
        name: "Ghee & Oils",
        slug: "ghee-and-oils",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
          isFeatured: true,
        },
        {
          url: "https://images.unsplash.com/photo-1596541571217-10901e137b02?auto=format&fit=crop&w=800&q=80",
          isFeatured: false,
        },
      ],
    },
    {
      id: "prod-mst-005",
      title: "Fresh Red Spinach (Lal Shak)",
      slug: "fresh-red-spinach",
      unit: "1 Bundle",
      price: 25,
      discountPercentage: 0,
      isBestDeal: false,
      isPopular: false,
      categoryId: "cat-veg-04",
      category: {
        id: "cat-veg-04",
        name: "Fresh Vegetables",
        slug: "fresh-vegetables",
      },
      images: [
        {
          url: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80",
          isFeatured: true,
        },
      ],
    },
  ];

  return (
    <section className="mb-8 mt-14">
      <div className="mb-8">
        <HeadingStyle2
          firstTitle="recently"
          secondTitle="Purchased"
          className="mb-5"
          link="/products/purchased"
          linkTitle="View All Purchases"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product, idx) => (
          <ProductCard
            key={idx}
            product={product}
            href={`/product/${product.slug}`}
          />
        ))}
      </div>
    </section>
  );
}
