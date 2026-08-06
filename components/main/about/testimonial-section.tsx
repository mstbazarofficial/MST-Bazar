"use client";

import { Star } from "lucide-react";
import Image from "next/image";

// Swiper Components & Modules
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper Styles
import "swiper/css";
import "swiper/css/pagination";
import HeadLine from "../common/HeadLine";

const REVIEWS = [
  {
    rating: 5,
    comment:
      "The quality of honey and ghee is amazing. Fully authentic and natural.",
    name: "Nusrat Jahan",
    location: "Dhaka",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200",
  },
  {
    rating: 5,
    comment: "MST Bazar is my trusted partner for healthy food for my family.",
    name: "Tarique Ahmed",
    location: "Chattogram",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
  },
  {
    rating: 5,
    comment: "Fast delivery, great packaging and super quality products.",
    name: "Sadia Akter",
    location: "Sylhet",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200",
  },
  {
    rating: 5,
    comment: "Organically sourced and pure products. Highly recommended!",
    name: "Ahmmed Rafiq",
    location: "Rajshahi",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
  },
];

export function TestimonialsSection() {
  return (
    <div className="space-y-6 site-container section-y">
      {/* Section Header */}
      <HeadLine title="What Our Customers Say" />

      {/* Testimonials Swiper Carousel */}
      <div className="relative pt-2 pb-6 [&_.swiper-pagination-bullet-active]:bg-[#0B5D2A]! [&_.swiper-pagination-bullet]:w-2.5! [&_.swiper-pagination-bullet]:h-2.5!">
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
              {/* Single Review Card (HTML & Styling Same As Original) */}
              <div className="bg-white border border-gray-100/90 rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-md transition-all duration-300 h-full">
                <div className="space-y-3">
                  {/* Star Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Quote Text */}
                  <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
                    <span className="text-gray-400 text-3xl font-serif mr-1">
                      &ldquo;
                    </span>
                    {review.comment}
                    <span className="text-gray-400 text-3xl leading-0 font-serif ml-0.5">
                      &rdquo;
                    </span>
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-medium">
                      {review.location}
                    </p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
