"use client";

import { useState } from "react";
import { Play, Plus, Eye, EyeOff, Star, Edit, Image as ImageIcon } from "lucide-react";

interface Story {
  id: string;
  title: string;
  description: string;
  type: "video" | "story" | "youtube";
  dog?: string;
  thumbnail: string;
  videoSrc?: string;
  published: boolean;
  featured: boolean;
  date: string;
}

const stories: Story[] = [
  { id: "S-1", title: "From Fear to Family", description: "Luna's journey from heartbreak to thriving with her forever family.", type: "video", dog: "Luna", thumbnail: "/ttrg/dogs/luna.jpg", videoSrc: "/ttrg/videos/britta-testimonial.mp4", published: true, featured: true, date: "2026-05-15" },
  { id: "S-2", title: "Second Chances Work", description: "Max went from neglected to thriving in just 12 weeks of training.", type: "video", dog: "Max", thumbnail: "/ttrg/dogs/tucker.jpg", videoSrc: "/ttrg/videos/testimonial-2.mp4", published: true, featured: true, date: "2026-05-10" },
  { id: "S-3", title: "A Bond That Heals", description: "How Rex helped a family heal too.", type: "video", thumbnail: "/ttrg/dogs/shadow.jpg", videoSrc: "/ttrg/videos/trefz-family.mp4", published: true, featured: false, date: "2026-05-05" },
  { id: "S-4", title: "Prince's Transformation", description: "From behavioral challenges to confident companion.", type: "story", dog: "Prince", thumbnail: "/ttrg/dogs/prince.jpg", published: true, featured: false, date: "2026-04-28" },
  { id: "S-5", title: "Bailey Finds a Home", description: "After 47 days in rescue, Bailey's story has a happy ending.", type: "story", dog: "Bailey", thumbnail: "/ttrg/dogs/bailey.jpg", published: false, featured: false, date: "2026-04-20" },
];

export default function MediaPage() {
  const [items, setItems] = useState(stories);
  const [showAdd, setShowAdd] = useState(false);

  const toggleFeatured = (id: string) => setItems(items.map((s) => s.id === id ? { ...s, featured: !s.featured } : s));
  const togglePublished = (id: string) => setItems(items.map((s) => s.id === id ? { ...s, published: !s.published } : s));

  return (
    <div className="p-5 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">STORIES &amp; VIDEOS</h1>
          <p className="text-white/40 text-xs mt-1">Manage success stories, video testimonials, and YouTube links</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-[#C41E2A] hover:bg-[#A01825] text-white text-xs font-bold px-5 py-2.5 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Story
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((s) => (
          <div key={s.id} className="bg-[#0f1b30] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors">
            <div className="aspect-video relative overflow-hidden bg-[#1B2A4A]">
              <img src={s.thumbnail} alt={s.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent" />
              <div className="absolute top-2 left-2 flex gap-1">
                {s.featured && <span className="bg-amber-500/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" /> FEATURED</span>}
                {!s.published && <span className="bg-slate-700/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">DRAFT</span>}
              </div>
              {s.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white ml-1" />
                  </div>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-white text-sm font-bold mb-1">{s.title}</p>
              {s.dog && <p className="text-[#C41E2A] text-[10px] font-bold uppercase tracking-wider mb-2">Dog: {s.dog}</p>}
              <p className="text-white/40 text-xs line-clamp-2 mb-3">{s.description}</p>
              <p className="text-white/30 text-[10px] mb-3">Published {s.date}</p>
              <div className="grid grid-cols-3 gap-1.5">
                <button onClick={() => toggleFeatured(s.id)} className={`text-[10px] font-bold py-2 rounded-lg ${s.featured ? "bg-amber-500/20 text-amber-300" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
                  <Star className="w-3 h-3 inline" /> {s.featured ? "Featured" : "Feature"}
                </button>
                <button onClick={() => togglePublished(s.id)} className={`text-[10px] font-bold py-2 rounded-lg ${s.published ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>
                  {s.published ? <><Eye className="w-3 h-3 inline" /> Live</> : <><EyeOff className="w-3 h-3 inline" /> Hidden</>}
                </button>
                <button className="text-[10px] font-bold py-2 rounded-lg bg-white/5 text-white/60 hover:bg-white/10">
                  <Edit className="w-3 h-3 inline" /> Edit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative bg-[#0f1b30] border border-white/10 rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-black text-white">Add New Story</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white text-2xl">×</button>
            </div>
            <div className="space-y-3">
              <input placeholder="Story Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30" />
              <textarea placeholder="Description / Short emotional summary" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 resize-none" />
              <input placeholder="Attached Dog (optional)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30" />
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white">
                <option className="bg-[#0f1b30]">Video Upload</option>
                <option className="bg-[#0f1b30]">YouTube Embed</option>
                <option className="bg-[#0f1b30]">Story (Text + Photo)</option>
              </select>
              <input placeholder="YouTube URL or Video Source" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30" />
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center">
                <ImageIcon className="w-8 h-8 text-white/30 mx-auto mb-2" />
                <p className="text-white/40 text-xs">Drag &amp; drop thumbnail</p>
              </div>
              <label className="flex items-center gap-2 text-white/70 text-xs"><input type="checkbox" /> Feature on homepage</label>
              <label className="flex items-center gap-2 text-white/70 text-xs"><input type="checkbox" defaultChecked /> Publish immediately</label>
            </div>
            <button className="w-full mt-5 bg-[#C41E2A] hover:bg-[#A01825] text-white py-3 rounded-xl text-sm font-bold">Save Story</button>
          </div>
        </div>
      )}
    </div>
  );
}
