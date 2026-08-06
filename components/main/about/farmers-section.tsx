"use client";

import Image from "next/image";
import HeadLine from "../common/HeadLine";

const FARMERS = [
  {
    name: "Abdul Karim",
    role: "Mustard Farmer",
    loc: "Pabna",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "Rashida Begum",
    role: "Honey Producer",
    loc: "Kushtia",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "Farid Uddin",
    role: "Organic Farmer",
    loc: "Rajshahi",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "Selma Akter",
    role: "Ghee Producer",
    loc: "Bogra",
    img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
  },
  {
    name: "Sajjad Hossain",
    role: "Spice Farmer",
    loc: "Sylhet",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
  },
];

export function FarmersSection() {
  return (
    <section className=" bg-background">
      <div className="site-container section-y space-y-8">
        <div className="text-center">
          <HeadLine title="Meet Our Trusted Farmers" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {FARMERS.map((f, idx) => (
            <div
              key={idx}
              className="bg-card border border-border/60 rounded-md overflow-hidden shadow-2xs space-y-2 "
            >
              <div className="relative h-56 w-full">
                <Image
                  src={f.img}
                  alt={f.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="px-3 bg-primary-dark/5 text-primary-dark space-y-0.5 pb-3">
                <h5 className="text-xs font-bold text-foreground">{f.name}</h5>
                <p className="text-[10px] text-emerald-700 font-semibold">
                  {f.role}
                </p>
                <p className="text-[10px] text-muted-foreground">{f.loc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
