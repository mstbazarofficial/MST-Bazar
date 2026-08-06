import { Quote, Star } from "lucide-react";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rafiq Hasan",
    location: "Dhaka",
    comment:
      "The quality of honey and ghee is amazing. Fully authentic and natural. Highly recommended!!",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 2,
    name: "Sadia Akter",
    location: "Chattogram",
    comment:
      "I have been ordering mustard oil and jaggery for months. Always fresh and very well packed.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: 3,
    name: "Tanvir Ahmed",
    location: "Sylhet",
    comment:
      "Great service and super fast delivery! MST Bazar is now my trusted online grocery partner.",
    rating: 5,
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
  },
];

const Testimonials = () => {
  return (
    <section className="site-container section-y">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
          What Our Customers Say
        </h2>
        <a
          href="/reviews"
          className="text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-all"
        >
          View All
        </a>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TESTIMONIALS.map((review) => (
          <div
            key={review.id}
            className="bg-card border border-border/60 rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between space-y-4"
          >
            {/* Quote Icon & Text */}
            <div className="space-y-2">
              <Quote className="w-6 h-6 text-emerald-600 fill-emerald-600/20 rotate-180" />
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-medium">
                {review.comment}
              </p>
            </div>

            {/* User Avatar, Name & Stars */}
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="flex items-center gap-3">
                {/* Next.js Avatar Image */}
                <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-600/30 shrink-0">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">
                    {review.name}
                  </h4>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    {review.location}
                  </p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-amber-400 stroke-none"
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
