import Image from "next/image";
import HeadLine from "../common/HeadLine";

const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&q=80&w=500",
    alt: "Pure Natural Honey Bowl",
  },
  {
    src: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&q=80&w=500",
    alt: "Organic Ghee Butter Jar",
  },
  {
    src: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=500",
    alt: "Pure Mustard Oil Bottle",
  },
  {
    src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=500",
    alt: "Green Agricultural Farm Field",
  },
  {
    src: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=500",
    alt: "Eco-Friendly Product Packaging Box",
  },
  {
    src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=500",
    alt: "Delivery Man Handing Over Package",
  },
];

export function FromNatureGallery() {
  return (
    <section className="space-y-6 site-container section-y">
      {/* Section Header */}
      <HeadLine title="From Nature to Your Home" />

      {/* 6 Image Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 items-center">
        {GALLERY_IMAGES.map((img, index) => {
          const isLast = index === GALLERY_IMAGES.length - 1;
          return (
            <div key={index} className="relative group">
              {/* Image Box */}
              <div className="relative h-38 sm:h-42 lg:h-56 w-full rounded-md overflow-hidden border border-gray-100 shadow-2xs group-hover:shadow-md transition-all duration-300">
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 16vw, 16vw"
                  loading="eager"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Green Connecting Dot (Desktop Only) */}
              {!isLast && (
                <div className="hidden lg:block absolute -right-2.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#0B5D2A] z-10 border-2 border-white" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
