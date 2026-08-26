"use client";

import { Quote, Star } from "lucide-react";
import Image from "next/image";

// Swiper Components & Modules
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { SectionHeading } from "../common/layout/section-heading";

const REVIEWS = [
  {
    rating: 5,
    comment:
      "The quality of honey and mustard oil is unmatched. Truly 100% natural, fresh, and free from any chemical processing.",
    name: "Nusrat Jahan",
    location: "Dhaka",
    verified: "Verified Buyer",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  },
  {
    rating: 5,
    comment:
      "MST Bazar has become our family's primary store for daily organic essentials. The ghee aroma and purity are top notch!",
    name: "Tarique Ahmed",
    location: "Chattogram",
    verified: "Verified Buyer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  {
    rating: 5,
    comment:
      "Extremely fast doorstep delivery to Sylhet! The eco-friendly packaging ensured everything arrived completely intact.",
    name: "Sadia Akter",
    location: "Sylhet",
    verified: "Verified Buyer",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
  },
  {
    rating: 5,
    comment:
      "Direct farm sourcing makes a noticeable difference in taste and quality. Highly recommended for health-conscious families.",
    name: "Ahmmed Rafiq",
    location: "Rajshahi",
    verified: "Verified Buyer",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full site-container bg-muted section-y space-y-8">
      {/* Section Header */}
      <SectionHeading title="What Our Customers Say" highlightPositions={[3]} />

      {/* Testimonials Swiper Carousel */}
      <div className="relative pt-2 pb-6 [&_.swiper-pagination-bullet-active]:bg-primary! [&_.swiper-pagination-bullet]:w-2.5! [&_.swiper-pagination-bullet]:h-2.5!">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
          className="pb-12!"
        >
          {REVIEWS.map((review, index) => (
            <SwiperSlide key={index} className="h-auto">
              <div className="group relative flex h-full flex-col justify-between space-y-5 rounded-xl border border-border/60 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md">
                {/* Top: Decorative Quote Icon & Star Ratings */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                    <Quote className="h-6 w-6 text-primary/20 transition-colors group-hover:text-primary/40" />
                  </div>

                  {/* Comment Body */}
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-foreground/90">
                    "{review.comment}"
                  </p>
                </div>

                {/* Bottom Author Profile */}
                <div className="flex items-center gap-3 border-t border-border/50 pt-4">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border shadow-xs">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-xs sm:text-sm font-bold text-foreground">
                      {review.name}
                    </h4>
                    <p className="truncate text-[11px] font-medium text-muted-foreground">
                      {review.location} •{" "}
                      <span className="text-primary font-semibold">
                        {review.verified}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
