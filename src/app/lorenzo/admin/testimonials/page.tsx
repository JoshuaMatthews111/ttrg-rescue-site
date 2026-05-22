"use client";

import { useState, useEffect } from "react";
import { getTestimonials, type Testimonial } from "@/lib/lorenzo-store";
import { Eye, EyeOff, Star } from "lucide-react";

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  useEffect(() => { setTestimonials(getTestimonials()); }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#0B1D3A]">Testimonials / Success Stories</h1>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center"><p className="text-slate-400 text-sm">No testimonials yet.</p></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
              <div className="aspect-video bg-[#0B1D3A] overflow-hidden relative">
                <video src={t.videoSrc} muted className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 text-[10px] font-bold bg-[#C8102E] text-white px-2 py-0.5 rounded-full">{t.category}</span>
                <div className="absolute top-2 right-2 flex gap-1">
                  {t.featured && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                  {t.visible ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-[#0B1D3A] text-sm mb-1">{t.title}</h3>
                <p className="text-xs text-slate-500 italic">&ldquo;{t.quote}&rdquo;</p>
                {t.dogName && <p className="text-[10px] text-slate-400 mt-2">Dog: {t.dogName}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
