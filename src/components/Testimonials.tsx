"use client";

import { useState } from "react";
import { Play, Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah & Max",
    breed: "German Shepherd",
    quote: "We finally have peace in our home. Max went from aggressive and uncontrollable to a calm, loving family member.",
    longQuote: "We were at our breaking point. Max would lunge at other dogs, pull so hard on the leash I got injured, and we couldn't have guests over. Lorenzo's team transformed him completely. Now he walks perfectly, loves people, and is the dog we always dreamed of.",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600&q=80",
    rating: 5,
    service: "Behavioral Modification",
  },
  {
    id: 2,
    name: "The Rodriguez Family",
    breed: "Pit Bull Mix",
    quote: "They saved our dog from being rehomed. We are forever grateful.",
    longQuote: "Everyone told us to give up on Bruno. Shelters wouldn't take him, trainers refused to work with him. Lorenzo's team saw potential in him when nobody else did. Now he's the gentlest dog in the neighborhood.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    rating: 5,
    service: "Behavioral Modification",
  },
  {
    id: 3,
    name: "Jennifer M.",
    breed: "Golden Retriever",
    quote: "Our dog became a completely different animal. The transformation is unbelievable.",
    longQuote: "Bailey was sweet but completely out of control. Jumping on everyone, counter surfing, ignoring every command. After just weeks with Lorenzo's team, she's the most well-behaved dog. We actually enjoy walks now!",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&q=80",
    rating: 5,
    service: "Basic Obedience",
  },
  {
    id: 4,
    name: "David & Luna",
    breed: "Doberman",
    quote: "They gave us our confidence back. We can take Luna anywhere now.",
    longQuote: "Luna was reactive to everything — bikes, dogs, strangers. I was embarrassed to walk her. After the program, she walks by my side calmly no matter what. Lorenzo's team changed both our lives.",
    image: "https://images.unsplash.com/photo-1568572933382-74d440642117?w=600&q=80",
    rating: 5,
    service: "Behavioral Modification",
  },
  {
    id: 5,
    name: "The Thompson Family",
    breed: "Labrador",
    quote: "Worth every penny. Our family is happier than ever with our new, trained pup.",
    longQuote: "We tried every YouTube video, every treat trick. Nothing worked. Lorenzo's trainers are on another level — they understood Cooper in ways we never could. Our home is finally peaceful.",
    image: "https://images.unsplash.com/photo-1601758003122-53c40e686a19?w=600&q=80",
    rating: 5,
    service: "Basic Obedience",
  },
  {
    id: 6,
    name: "Michelle K.",
    breed: "Rescue Mix",
    quote: "My rescue went from terrified to thriving. These trainers are miracle workers.",
    longQuote: "Bella came from a terrible situation and was afraid of everything. Lorenzo's team used such patience and expertise. Now she greets everyone with a wagging tail. They truly saved her life.",
    image: "https://images.unsplash.com/photo-1544568100-847a948585b9?w=600&q=80",
    rating: 5,
    service: "Specialty Training",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = (direction: "left" | "right") => {
    const container = document.getElementById("testimonial-scroll");
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section id="testimonials" className="relative py-24 sm:py-32 overflow-hidden bg-cream">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-navy/10 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block text-red text-sm font-[var(--font-body)] font-semibold tracking-[0.2em] uppercase mb-4">
            Real Stories, Real Results
          </span>
          <h2 className="font-[var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-navy leading-tight mb-6">
            Life-Changing{" "}
            <span className="text-red">Transformations</span>
          </h2>
          <p className="font-[var(--font-body)] text-navy/60 text-lg max-w-2xl mx-auto">
            Don&apos;t just take our word for it. See what real families say about their experience.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16">
          <div className="bg-white rounded-3xl shadow-premium-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 sm:h-80 lg:h-auto min-h-[400px]">
                <img
                  src={testimonials[activeIndex].image}
                  alt={testimonials[activeIndex].name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
                <button className="absolute inset-0 flex items-center justify-center group">
                  <div className="w-20 h-20 rounded-full bg-red/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-red transition-all shadow-glow-red">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </button>
                <div className="absolute bottom-4 left-4 glass rounded-full px-4 py-2">
                  <span className="text-white text-sm font-[var(--font-body)] font-medium">
                    {testimonials[activeIndex].service}
                  </span>
                </div>
              </div>

              <div className="p-8 sm:p-12 flex flex-col justify-center">
                <Quote className="w-10 h-10 text-red/20 mb-6" />
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="font-[var(--font-body)] text-navy/80 text-lg sm:text-xl leading-relaxed mb-6 italic">
                  &ldquo;{testimonials[activeIndex].longQuote}&rdquo;
                </p>
                <div>
                  <p className="font-[var(--font-heading)] text-navy font-bold text-lg">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="font-[var(--font-body)] text-navy/50 text-sm">
                    {testimonials[activeIndex].breed}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === activeIndex ? "bg-red w-8" : "bg-navy/20 hover:bg-navy/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Netflix-style Horizontal Scroll */}
        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-[var(--font-heading)] text-xl font-bold text-navy">
              More Success Stories
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-10 h-10 rounded-full bg-white shadow-premium flex items-center justify-center hover:bg-navy hover:text-white transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-10 h-10 rounded-full bg-white shadow-premium flex items-center justify-center hover:bg-navy hover:text-white transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div
            id="testimonial-scroll"
            className="flex gap-5 overflow-x-auto scroll-snap-x pb-4 -mx-4 px-4"
            style={{ scrollbarWidth: "none" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={t.id}
                onClick={() => setActiveIndex(i)}
                className="flex-shrink-0 w-[320px] bg-white rounded-2xl shadow-premium overflow-hidden group cursor-pointer hover:shadow-premium-lg transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 rounded-full bg-red/90 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white ml-0.5" fill="white" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(t.rating)].map((_, si) => (
                      <Star key={si} className="w-3.5 h-3.5 text-gold fill-gold" />
                    ))}
                  </div>
                  <p className="font-[var(--font-body)] text-navy/70 text-sm leading-relaxed mb-3 line-clamp-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-[var(--font-heading)] text-navy font-semibold text-sm">{t.name}</p>
                      <p className="text-navy/40 text-xs">{t.breed}</p>
                    </div>
                    <span className="text-xs font-[var(--font-body)] text-red/70 font-medium bg-red/5 px-2.5 py-1 rounded-full">
                      {t.service}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
