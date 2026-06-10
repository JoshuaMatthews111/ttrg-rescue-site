"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Eye, Trash2, CheckCircle2, X, Globe, EyeOff, Archive, Upload, Loader2, Film, ImageIcon, GripVertical } from "lucide-react";
import {
  fetchDogs, upsertDog, deleteDog as deleteDogDB,
  uploadFile, deleteFile, insertAuditLog, subscribeToTable, getSession,
  type AdminDog, type DogStatus,
} from "@/lib/admin-store";

const stageLabels: Record<string, string> = { rescue: "Rescued", rehabilitate: "In Rehab", train: "In Training", recover: "Recovering", rehome: "Ready for Home" };
const stageColors: Record<string, string> = { rescue: "bg-red-100 text-red-700", rehabilitate: "bg-amber-100 text-amber-700", train: "bg-emerald-100 text-emerald-700", recover: "bg-blue-100 text-blue-700", rehome: "bg-violet-100 text-violet-700" };
const statusColors: Record<string, string> = { draft: "bg-slate-100 text-slate-600", pending_review: "bg-amber-100 text-amber-700", published: "bg-emerald-100 text-emerald-700", hidden: "bg-slate-100 text-slate-500", adopted: "bg-violet-100 text-violet-700", urgent: "bg-red-100 text-red-700", archived: "bg-slate-100 text-slate-400" };
const statusLabels: Record<string, string> = { draft: "Draft", pending_review: "Pending Review", published: "Published", hidden: "Hidden", adopted: "Adopted", urgent: "Urgent", archived: "Archived" };

const emptyDog: Omit<AdminDog, "id" | "createdAt" | "updatedAt" | "createdBy"> = {
  name: "", age: "", breed: "", gender: "Male", weight: "", price: 35, story: "", fullStory: "",
  image: "", videoUrl: "",
  gallery: [], urgent: false, stage: "rescue", stageColor: "bg-red-500",
  medicalNeeds: "", trainingNeeds: "", behaviorNotes: "", specialNeeds: "", location: "Cleveland, OH", status: "draft",
};

export default function AdminDogsPage() {
  const [dogs, setDogs] = useState<AdminDog[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editDog, setEditDog] = useState<AdminDog | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const loadDogs = useCallback(async () => {
    const data = await fetchDogs();
    setDogs(data);
  }, []);

  useEffect(() => {
    loadDogs();
    const unsub = subscribeToTable("dogs", loadDogs);
    return () => { unsub(); };
  }, [loadDogs]);

  const filtered = dogs
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()))
    .filter((d) => statusFilter === "all" || d.status === statusFilter);

  const openNew = () => {
    const id = "dog-" + Date.now().toString(36);
    setEditDog({ ...emptyDog, id, gallery: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "Admin" } as AdminDog);
    setShowModal(true);
  };

  const openEdit = (dog: AdminDog) => { setEditDog({ ...dog, gallery: dog.gallery || [] }); setShowModal(true); };

  const saveDog = async () => {
    if (!editDog || !editDog.name) return;
    setSaving(true);
    editDog.updatedAt = new Date().toISOString();
    // auto-set primary image from gallery if not set
    if (!editDog.image && editDog.gallery.length > 0) editDog.image = editDog.gallery[0];
    await upsertDog(editDog);
    const session = getSession();
    await insertAuditLog({ userName: session?.name || "Admin", userRole: session?.role || "admin", action: "save_dog", entityType: "dog", entityId: editDog.id, entityName: editDog.name });
    await loadDogs();
    setSaving(false);
    setShowModal(false);
    setEditDog(null);
  };

  const setStatus = async (id: string, status: DogStatus) => {
    const dog = dogs.find((d) => d.id === id);
    if (!dog) return;
    const updated = { ...dog, status, updatedAt: new Date().toISOString(), publishedAt: status === "published" ? new Date().toISOString() : dog.publishedAt };
    await upsertDog(updated);
    const session = getSession();
    await insertAuditLog({ userName: session?.name || "Admin", userRole: session?.role || "admin", action: `status_${status}`, entityType: "dog", entityId: id, entityName: dog.name });
    await loadDogs();
  };

  const archiveDog = (id: string) => { setStatus(id, "archived"); };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this dog? This cannot be undone.")) return;
    const dog = dogs.find((d) => d.id === id);
    await deleteDogDB(id);
    const session = getSession();
    await insertAuditLog({ userName: session?.name || "Admin", userRole: session?.role || "admin", action: "delete_dog", entityType: "dog", entityId: id, entityName: dog?.name || id });
    await loadDogs();
  };

  // Multi-photo upload: accepts multiple files, adds to gallery
  const handlePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editDog) return;
    setUploading(true);
    const newGallery = [...(editDog.gallery || [])];
    let newImage = editDog.image;
    for (let i = 0; i < files.length; i++) {
      setUploadProgress(`Uploading photo ${i + 1} of ${files.length}...`);
      const file = files[i];
      const path = `dogs/${editDog.id}/${Date.now()}-${file.name}`;
      const url = await uploadFile("media", path, file);
      if (url) {
        newGallery.push(url);
        if (!newImage) newImage = url;
      }
    }
    setEditDog({ ...editDog, image: newImage, gallery: newGallery });
    setUploading(false);
    setUploadProgress("");
    // reset input so same files can be re-selected
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  // Video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editDog) return;
    setUploading(true);
    setUploadProgress(`Uploading video (${(file.size / 1024 / 1024).toFixed(1)} MB)...`);
    const path = `dogs/${editDog.id}/video-${Date.now()}-${file.name}`;
    const url = await uploadFile("media", path, file);
    if (url) setEditDog({ ...editDog, videoUrl: url });
    setUploading(false);
    setUploadProgress("");
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  // Remove a gallery image
  const removeGalleryImage = (idx: number) => {
    if (!editDog) return;
    const newGallery = editDog.gallery.filter((_, i) => i !== idx);
    const removedUrl = editDog.gallery[idx];
    const newImage = editDog.image === removedUrl ? (newGallery[0] || "") : editDog.image;
    setEditDog({ ...editDog, gallery: newGallery, image: newImage });
  };

  // Set a gallery image as the primary/cover photo
  const setPrimaryImage = (url: string) => {
    if (!editDog) return;
    setEditDog({ ...editDog, image: url });
  };

  const statusCounts = dogs.reduce((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {} as Record<string, number>);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1B2A4A]">Dogs Management</h1>
          <p className="text-sm text-[#1B2A4A]/50">{dogs.length} dogs in system</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-[#C41E2A] hover:bg-[#A01825] text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Dog
        </button>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {["all", "published", "draft", "pending_review", "urgent", "adopted", "hidden", "archived"].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${statusFilter === s ? "bg-[#1B2A4A] text-white" : "bg-white border border-slate-200 text-[#1B2A4A]/50 hover:bg-slate-50"}`}>
            {s === "all" ? "All" : statusLabels[s]} {s !== "all" && statusCounts[s] ? `(${statusCounts[s]})` : ""}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Search dogs..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#FAFAF8] border-b border-slate-100">
              <tr>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Dog</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden sm:table-cell">Breed</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Stage</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Status</th>
                <th className="text-left px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs hidden lg:table-cell">Updated</th>
                <th className="text-right px-5 py-3 text-[#1B2A4A]/50 font-semibold text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((dog) => (
                <tr key={dog.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <img src={dog.image} alt={dog.name} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-[#1B2A4A]">{dog.name || "Untitled"}</p>
                        <p className="text-[10px] text-[#1B2A4A]/40">{dog.age} · {dog.gender}{dog.urgent ? " · 🔴 Urgent" : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[#1B2A4A]/60 hidden sm:table-cell">{dog.breed}</td>
                  <td className="px-5 py-3">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${stageColors[dog.stage]}`}>
                      {stageLabels[dog.stage]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${statusColors[dog.status]}`}>
                      {statusLabels[dog.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3 hidden lg:table-cell">
                    <p className="text-[10px] text-[#1B2A4A]/40">{new Date(dog.updatedAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {(dog.status === "published" || dog.status === "urgent") && (
                        <Link href={`/ttrg/dogs/${dog.id}`} className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-emerald-600 transition-colors" title="View Live">
                          <Globe className="w-4 h-4" />
                        </Link>
                      )}
                      <Link href={`/ttrg/dogs/${dog.id}`} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#1B2A4A]/40 hover:text-[#1B2A4A] transition-colors" title="Preview">
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button onClick={() => openEdit(dog)} className="w-8 h-8 rounded-lg hover:bg-blue-50 flex items-center justify-center text-[#1B2A4A]/40 hover:text-blue-600 transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      {dog.status !== "published" && (
                        <button onClick={() => setStatus(dog.id, "published")} className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center text-[#1B2A4A]/40 hover:text-emerald-600 transition-colors" title="Publish">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      {dog.status === "published" && (
                        <button onClick={() => setStatus(dog.id, "hidden")} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#1B2A4A]/40 hover:text-slate-600 transition-colors" title="Unpublish">
                          <EyeOff className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => archiveDog(dog.id)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#1B2A4A]/40 hover:text-slate-600 transition-colors" title="Archive">
                        <Archive className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(dog.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-[#1B2A4A]/40 hover:text-red-500 transition-colors" title="Delete permanently">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-[#1B2A4A]/30 text-sm">No dogs match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit/Create Modal */}
      {showModal && editDog && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 relative" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-[#1B2A4A]">{dogs.find(d => d.id === editDog.id) ? `Edit: ${editDog.name || "Untitled"}` : "Add New Dog"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Name *</label>
                  <input value={editDog.name} onChange={(e) => setEditDog({ ...editDog, name: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Breed</label>
                  <input value={editDog.breed} onChange={(e) => setEditDog({ ...editDog, breed: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Age</label>
                  <input value={editDog.age} onChange={(e) => setEditDog({ ...editDog, age: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Gender</label>
                  <select value={editDog.gender} onChange={(e) => setEditDog({ ...editDog, gender: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                    <option>Male</option><option>Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Weight</label>
                  <input value={editDog.weight} onChange={(e) => setEditDog({ ...editDog, weight: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Location</label>
                  <input value={editDog.location} onChange={(e) => setEditDog({ ...editDog, location: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Stage</label>
                  <select value={editDog.stage} onChange={(e) => setEditDog({ ...editDog, stage: e.target.value as AdminDog["stage"] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                    <option value="rescue">Rescue</option><option value="rehabilitate">Rehabilitate</option><option value="train">Train</option><option value="recover">Recover</option><option value="rehome">Rehome</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Status</label>
                  <select value={editDog.status} onChange={(e) => setEditDog({ ...editDog, status: e.target.value as DogStatus })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20">
                    <option value="draft">Draft</option><option value="pending_review">Pending Review</option><option value="published">Published</option><option value="hidden">Hidden</option><option value="adopted">Adopted/Rehomed</option><option value="urgent">Urgent</option><option value="archived">Archived</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Monthly Sponsor ($)</label>
                  <input type="number" value={editDog.price} onChange={(e) => setEditDog({ ...editDog, price: Number(e.target.value) })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
                <div className="flex items-end gap-4 pb-1">
                  <label className="flex items-center gap-2 text-sm text-[#1B2A4A]/60 cursor-pointer">
                    <input type="checkbox" checked={editDog.urgent} onChange={(e) => setEditDog({ ...editDog, urgent: e.target.checked })} className="rounded" />
                    Mark as Urgent
                  </label>
                </div>
              </div>
              {/* ── Photos (multi-upload + gallery) ── */}
              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-2 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5" /> Photos <span className="font-normal text-[#1B2A4A]/40">(upload multiple — first is cover photo)</span>
                </label>
                {editDog.gallery && editDog.gallery.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {editDog.gallery.map((url, i) => (
                      <div key={i} className="relative group">
                        <img src={url} alt={`Photo ${i + 1}`} className={`w-20 h-20 rounded-xl object-cover border-2 transition-all ${editDog.image === url ? "border-[#C41E2A] ring-2 ring-[#C41E2A]/20" : "border-slate-200"}`} />
                        <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button type="button" onClick={() => setPrimaryImage(url)} className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center" title="Set as cover">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${editDog.image === url ? "text-[#C41E2A]" : "text-slate-500"}`} />
                          </button>
                          <button type="button" onClick={() => removeGalleryImage(i)} className="w-6 h-6 rounded-full bg-white/90 flex items-center justify-center" title="Remove">
                            <X className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                        {editDog.image === url && (
                          <span className="absolute -top-1.5 -left-1.5 bg-[#C41E2A] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">COVER</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" multiple onChange={handlePhotosUpload} className="hidden" />
                <button type="button" onClick={() => photoInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-[#1B2A4A]/70 transition-colors disabled:opacity-50">
                  {uploading && uploadProgress.includes("photo") ? <><Loader2 className="w-3 h-3 animate-spin" /> {uploadProgress}</> : <><Upload className="w-3 h-3" /> Upload Photos</>}
                </button>
              </div>

              {/* ── Video Upload ── */}
              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-2 flex items-center gap-2">
                  <Film className="w-3.5 h-3.5" /> Dog Video <span className="font-normal text-[#1B2A4A]/40">(plays on homepage card &amp; profile — no size limit)</span>
                </label>
                {editDog.videoUrl && (
                  <div className="mb-3 relative rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <video src={editDog.videoUrl} controls muted className="w-full max-h-48 object-contain" />
                    <button type="button" onClick={() => setEditDog({ ...editDog, videoUrl: "" })} className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors" title="Remove video">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <input ref={videoInputRef} type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  <button type="button" onClick={() => videoInputRef.current?.click()} disabled={uploading} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-medium text-[#1B2A4A]/70 transition-colors disabled:opacity-50">
                    {uploading && uploadProgress.includes("video") ? <><Loader2 className="w-3 h-3 animate-spin" /> {uploadProgress}</> : <><Film className="w-3 h-3" /> Upload Video</>}
                  </button>
                  <span className="text-[10px] text-[#1B2A4A]/30">or</span>
                  <input value={editDog.videoUrl || ""} onChange={(e) => setEditDog({ ...editDog, videoUrl: e.target.value })} placeholder="Paste video URL" className="flex-1 h-9 px-3 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Short Story</label>
                <textarea value={editDog.story} onChange={(e) => setEditDog({ ...editDog, story: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Full Story</label>
                <textarea value={editDog.fullStory} onChange={(e) => setEditDog({ ...editDog, fullStory: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Medical Needs</label>
                  <textarea value={editDog.medicalNeeds} onChange={(e) => setEditDog({ ...editDog, medicalNeeds: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Training Needs</label>
                  <textarea value={editDog.trainingNeeds} onChange={(e) => setEditDog({ ...editDog, trainingNeeds: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Behavior Notes</label>
                  <textarea value={editDog.behaviorNotes} onChange={(e) => setEditDog({ ...editDog, behaviorNotes: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Special Needs</label>
                  <textarea value={editDog.specialNeeds} onChange={(e) => setEditDog({ ...editDog, specialNeeds: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between p-6 border-t border-slate-100">
              <button onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#1B2A4A]/60 hover:bg-slate-50 transition-colors">Cancel</button>
              <div className="flex gap-2">
                <button onClick={() => { editDog.status = "published"; editDog.publishedAt = new Date().toISOString(); saveDog(); }} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Save & Publish
                </button>
                <button onClick={saveDog} disabled={saving} className="px-4 py-2.5 rounded-xl bg-[#C41E2A] hover:bg-[#A01825] text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5">
                  {saving ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving...</> : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
