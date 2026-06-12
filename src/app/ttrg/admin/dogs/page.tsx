"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Eye, Trash2, CheckCircle2, X, Globe, EyeOff, Archive, Upload, Loader2, Film, ImageIcon, GripVertical, ChevronDown, Heart, Stethoscope, GraduationCap, Brain, Star, Home } from "lucide-react";
import {
  fetchDogs, upsertDog, deleteDog as deleteDogDB,
  uploadFile, deleteFile, insertAuditLog, subscribeToTable, getSession,
  type AdminDog, type DogStatus,
} from "@/lib/admin-store";
import {
  BREED_OPTIONS, AGE_UNITS, GENDER_OPTIONS, SIZE_OPTIONS, DOG_STATUS_OPTIONS,
  MEDICAL_NEEDS_OPTIONS, TRAINING_NEEDS_OPTIONS, BEHAVIOR_NOTES_OPTIONS, SPECIAL_NEEDS_OPTIONS,
  RESCUE_SOURCE_OPTIONS, JOURNEY_STAGE_OPTIONS, SUPPORT_GOAL_OPTIONS,
  DOG_STATUS_COLORS, formatAge, formatBreed, isEmpty, getTimelineIndex, getTimelineKey,
  createEmptyDog,
} from "@/lib/dog-constants";

const stageLabels: Record<string, string> = { rescue: "Rescued", rehabilitate: "In Rehab", train: "In Training", recover: "Recovering", rehome: "Ready for Home" };
const stageColors: Record<string, string> = { rescue: "bg-red-100 text-red-700", rehabilitate: "bg-amber-100 text-amber-700", train: "bg-emerald-100 text-emerald-700", recover: "bg-blue-100 text-blue-700", rehome: "bg-violet-100 text-violet-700" };
const statusColors: Record<string, string> = { draft: "bg-slate-100 text-slate-600", pending_review: "bg-amber-100 text-amber-700", published: "bg-emerald-100 text-emerald-700", hidden: "bg-slate-100 text-slate-500", adopted: "bg-violet-100 text-violet-700", urgent: "bg-red-100 text-red-700", archived: "bg-slate-100 text-slate-400" };
const statusLabels: Record<string, string> = { draft: "Draft", pending_review: "Pending Review", published: "Published", hidden: "Hidden", adopted: "Adopted", urgent: "Urgent", archived: "Archived" };

const emptyDog: Omit<AdminDog, "id" | "createdAt" | "updatedAt" | "createdBy"> = createEmptyDog();

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

  // Map admin stage to journey stage + progress
  const stageToJourney: Record<string, { journeyStage: string; percent: number; label: string }> = {
    rescue:       { journeyStage: "rescue",  percent: 10,  label: "Rescue Intake" },
    rehabilitate: { journeyStage: "rehab",   percent: 35,  label: "Rehabilitation In Progress" },
    train:        { journeyStage: "rehab",   percent: 50,  label: "In Training — Rehabilitation Phase" },
    recover:      { journeyStage: "medical", percent: 25,  label: "Medical Recovery" },
    rehome:       { journeyStage: "adopt",   percent: 80,  label: "Ready for Adoption" },
  };

  const saveDog = async () => {
    if (!editDog || !editDog.name) return;
    setSaving(true);
    const dog = { ...editDog };
    dog.updatedAt = new Date().toISOString();

    // auto-set primary image from gallery if not set
    if (!dog.image && dog.gallery.length > 0) dog.image = dog.gallery[0];

    // Sync structured age to legacy age field
    if (dog.ageNumber && dog.ageUnit) {
      const approx = dog.ageApproximate ? "Approximately " : "";
      dog.age = `${approx}${dog.ageNumber} ${dog.ageUnit}`;
    }

    // Sync structured breed to legacy breed field
    if (dog.breedOption) {
      dog.breed = dog.breedOption === "Other" && dog.otherBreed
        ? dog.otherBreed
        : dog.breedOption;
    }

    // Sync structured gender to legacy gender field
    if (dog.genderOption) {
      dog.gender = dog.genderOption;
    }

    // Sync structured needs arrays to legacy text fields
    if (dog.medicalNeedsOptions && dog.medicalNeedsOptions.length > 0) {
      const other = dog.otherMedicalNeed && dog.medicalNeedsOptions.includes("Other")
        ? `Other: ${dog.otherMedicalNeed}`
        : "";
      const base = dog.medicalNeedsOptions.filter(o => o !== "Other").join(", ");
      dog.medicalNeeds = base + (other ? (base ? ", " : "") + other : "");
    }

    if (dog.trainingNeedsOptions && dog.trainingNeedsOptions.length > 0) {
      const other = dog.otherTrainingNeed && dog.trainingNeedsOptions.includes("Other")
        ? `Other: ${dog.otherTrainingNeed}`
        : "";
      const base = dog.trainingNeedsOptions.filter(o => o !== "Other").join(", ");
      dog.trainingNeeds = base + (other ? (base ? ", " : "") + other : "");
    }

    if (dog.behaviorNotesOptions && dog.behaviorNotesOptions.length > 0) {
      const other = dog.otherBehaviorNote && dog.behaviorNotesOptions.includes("Other")
        ? `Other: ${dog.otherBehaviorNote}`
        : "";
      const base = dog.behaviorNotesOptions.filter(o => o !== "Other").join(", ");
      dog.behaviorNotes = base + (other ? (base ? ", " : "") + other : "");
      if (dog.behaviorNotesText) {
        dog.behaviorNotes += (dog.behaviorNotes ? "\n\n" : "") + dog.behaviorNotesText;
      }
    }

    if (dog.specialNeedsOptions && dog.specialNeedsOptions.length > 0) {
      const other = dog.otherSpecialNeed && dog.specialNeedsOptions.includes("Other")
        ? `Other: ${dog.otherSpecialNeed}`
        : "";
      const base = dog.specialNeedsOptions.filter(o => o !== "Other").join(", ");
      dog.specialNeeds = base + (other ? (base ? ", " : "") + other : "");
    }

    // Sync journey stage to old stage for compatibility
    if (dog.journeyStage) {
      const stageMap: Record<string, string> = {
        "Intake": "rescue",
        "Assessment": "rescue",
        "Medical Care": "recover",
        "Training": "train",
        "Behavioral Rehabilitation": "rehabilitate",
        "Foster Placement": "rehabilitate",
        "Adoption Preparation": "rehome",
        "Ready for Adoption": "rehome",
        "Adopted": "rehome",
        "Long-Term Support": "rehome",
      };
      dog.stage = stageMap[dog.journeyStage] as typeof dog.stage || "rescue";
    }

    // Calculate progress percent based on journey stage
    const progressMap: Record<string, number> = {
      "Intake": 10,
      "Assessment": 20,
      "Medical Care": 30,
      "Training": 50,
      "Behavioral Rehabilitation": 60,
      "Foster Placement": 70,
      "Adoption Preparation": 80,
      "Ready for Adoption": 90,
      "Adopted": 100,
      "Long-Term Support": 100,
    };
    dog.progressPercent = progressMap[dog.journeyStage || ""] || 10;
    dog.currentJourneyStage = getTimelineKey(dog.journeyStage);
    dog.currentStageLabel = dog.journeyStage || "Intake";

    // Set status badges based on dog status and support goal
    const badges: string[] = [];
    if (dog.dogStatus === "Urgent Support Needed" || dog.urgent) badges.push("Urgent");
    if (dog.supportGoal === "Needs Sponsor") badges.push("Needs Sponsor");
    if (dog.supportGoal === "Needs Foster") badges.push("Needs Foster");
    if (dog.supportGoal === "Needs Adoption") badges.push("Ready for Home");
    if (dog.dogStatus === "Medical Care") badges.push("Medical Care");
    if (dog.dogStatus === "In Training" || dog.dogStatus === "Behavioral Rehabilitation") badges.push("In Training");
    dog.statusBadges = badges;

    // Set rescue date if not set
    if (!dog.rescueDate) {
      dog.rescueDate = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }

    // Set care team and last update
    dog.careTeam = "TTRG Team";
    dog.lastUpdate = "Just now";
    dog.adminNote = dog.medicalNeedsNotes || dog.trainingNeedsNotes || dog.specialNeedsNotes || "";

    // Generate milestones based on journey stage and needs
    const milestones: { label: string; date?: string; status: "completed" | "in_progress" | "upcoming" | "urgent" }[] = [];

    // Always show rescue intake as completed
    milestones.push({ label: "Rescue Intake", status: "completed", date: dog.rescueDate });

    // Add milestones based on journey stage
    const stageMilestones: Record<string, { label: string; status: "completed" | "in_progress" | "upcoming" }[]> = {
      "Intake": [
        { label: "Initial Assessment", status: "in_progress" },
        { label: "Medical Evaluation", status: "upcoming" },
      ],
      "Assessment": [
        { label: "Initial Assessment", status: "completed" },
        { label: "Medical Evaluation", status: "in_progress" },
      ],
      "Medical Care": [
        { label: "Medical Evaluation", status: "completed" },
        { label: "Treatment in Progress", status: "in_progress" },
        { label: "Ready for Training", status: "upcoming" },
      ],
      "Training": [
        { label: "Training Started", status: "completed" },
        { label: "Basic Obedience", status: "in_progress" },
        { label: "Advanced Training", status: "upcoming" },
      ],
      "Behavioral Rehabilitation": [
        { label: "Assessment Completed", status: "completed" },
        { label: "Rehabilitation in Progress", status: "in_progress" },
        { label: "Behavioral Evaluation", status: "upcoming" },
      ],
      "Foster Placement": [
        { label: "Training Completed", status: "completed" },
        { label: "Foster Home Found", status: "in_progress" },
        { label: "Foster Adjustment", status: "upcoming" },
      ],
      "Adoption Preparation": [
        { label: "Foster Care", status: "completed" },
        { label: "Ready for Adoption", status: "in_progress" },
      ],
      "Ready for Adoption": [
        { label: "Adoption Profile Created", status: "completed" },
        { label: "Meet & Greets", status: "in_progress" },
      ],
      "Adopted": [
        { label: "Forever Home Found", status: "completed" },
        { label: "Adoption Finalized", status: "completed" },
      ],
      "Long-Term Support": [
        { label: "In Forever Home", status: "completed" },
        { label: "Ongoing Support", status: "in_progress" },
      ],
    };

    const currentStageMilestones = stageMilestones[dog.journeyStage || "Intake"] || [];
    milestones.push(...currentStageMilestones);

    // Add needs-based milestones
    if (dog.medicalNeedsOptions?.includes("Surgery Needed")) {
      milestones.push({ label: "Surgery Required", status: "urgent" });
    }
    if (dog.trainingNeedsOptions?.includes("Basic Obedience")) {
      milestones.push({ label: "Basic Obedience Training", status: "in_progress" });
    }
    if (dog.supportGoal?.includes("Foster")) {
      milestones.push({ label: "Searching for Foster Home", status: "in_progress" });
    }
    if (dog.supportGoal?.includes("Adoption")) {
      milestones.push({ label: "Waiting for Perfect Match", status: "upcoming" });
    }

    dog.milestones = milestones;

    // Build currentNeeds array for the public page
    const currentNeeds: { icon: string; label: string; detail: string; urgent?: boolean }[] = [];

    if (dog.medicalNeedsOptions && dog.medicalNeedsOptions.length > 0) {
      currentNeeds.push({
        icon: "vet",
        label: "Medical Care",
        detail: dog.medicalNeedsOptions.slice(0, 2).join(", ") + (dog.medicalNeedsOptions.length > 2 ? "..." : ""),
        urgent: dog.medicalNeedsOptions.includes("Surgery Needed") || dog.medicalNeedsOptions.includes("Emergency Care"),
      });
    }

    if (dog.trainingNeedsOptions && dog.trainingNeedsOptions.length > 0) {
      currentNeeds.push({
        icon: "training",
        label: "Training",
        detail: dog.trainingNeedsOptions.slice(0, 2).join(", ") + (dog.trainingNeedsOptions.length > 2 ? "..." : ""),
      });
    }

    if (dog.supportGoal?.includes("Foster")) {
      currentNeeds.push({ icon: "foster", label: "Foster Home", detail: "Needs loving temporary home", urgent: true });
    }

    if (dog.supportGoal?.includes("Sponsor")) {
      currentNeeds.push({ icon: "nutrition", label: "Monthly Sponsor", detail: "Sustained support needed" });
    }

    if (currentNeeds.length === 0) {
      currentNeeds.push({ icon: "nutrition", label: "Daily Care", detail: "Food, shelter & love" });
    }

    dog.currentNeeds = currentNeeds;

    await upsertDog(dog);
    const session = getSession();
    await insertAuditLog({ userName: session?.name || "Admin", userRole: session?.role || "admin", action: "save_dog", entityType: "dog", entityId: dog.id, entityName: dog.name });
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
            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 1: BASIC PROFILE
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C41E2A] text-white text-xs flex items-center justify-center">1</span>
                  Basic Profile
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Name *</label>
                    <input value={editDog.name} onChange={(e) => setEditDog({ ...editDog, name: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Breed *</label>
                    <select value={editDog.breedOption || "Mixed Breed"} onChange={(e) => setEditDog({ ...editDog, breedOption: e.target.value as typeof BREED_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {BREED_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    {editDog.breedOption === "Other" && (
                      <input value={editDog.otherBreed || ""} onChange={(e) => setEditDog({ ...editDog, otherBreed: e.target.value })} placeholder="Enter custom breed" className="w-full h-9 px-3 mt-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Age Number</label>
                    <input type="number" min="0" value={editDog.ageNumber || ""} onChange={(e) => setEditDog({ ...editDog, ageNumber: parseInt(e.target.value) || undefined })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Unit</label>
                    <select value={editDog.ageUnit || "Years"} onChange={(e) => setEditDog({ ...editDog, ageUnit: e.target.value as typeof AGE_UNITS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {AGE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 text-sm text-[#1B2A4A]/60 cursor-pointer">
                      <input type="checkbox" checked={editDog.ageApproximate || false} onChange={(e) => setEditDog({ ...editDog, ageApproximate: e.target.checked })} className="rounded" />
                      Approximate age
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Gender</label>
                    <select value={editDog.genderOption || "Unknown"} onChange={(e) => setEditDog({ ...editDog, genderOption: e.target.value as typeof GENDER_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Size</label>
                    <select value={editDog.size || "Medium"} onChange={(e) => setEditDog({ ...editDog, size: e.target.value as typeof SIZE_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {SIZE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Weight</label>
                    <input value={editDog.weight} onChange={(e) => setEditDog({ ...editDog, weight: e.target.value })} placeholder="e.g., 45 lbs" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Location</label>
                    <input value={editDog.location} onChange={(e) => setEditDog({ ...editDog, location: e.target.value })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 2: RESCUE JOURNEY
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#C41E2A] text-white text-xs flex items-center justify-center">2</span>
                  Rescue Journey
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Dog Status</label>
                    <select value={editDog.dogStatus || "New Intake"} onChange={(e) => setEditDog({ ...editDog, dogStatus: e.target.value as typeof DOG_STATUS_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {DOG_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Journey Stage</label>
                    <select value={editDog.journeyStage || "Intake"} onChange={(e) => setEditDog({ ...editDog, journeyStage: e.target.value as typeof JOURNEY_STAGE_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {JOURNEY_STAGE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Current Stage Label (Public)</label>
                    <input value={editDog.currentStageLabel || editDog.journeyStage || "Intake"} onChange={(e) => setEditDog({ ...editDog, currentStageLabel: e.target.value })} placeholder="e.g., Training - Basic Obedience" className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                    <p className="text-[10px] text-[#1B2A4A]/40 mt-1">This displays on the dog's public page</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Days in Care</label>
                    <input type="number" value={editDog.daysInRescue || 0} onChange={(e) => setEditDog({ ...editDog, daysInRescue: parseInt(e.target.value) || 0 })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                    <p className="text-[10px] text-[#1B2A4A]/40 mt-1">Auto-calculated from rescue date, or set manually</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">How Dog Came to TTRG</label>
                    <select value={editDog.rescueSource || "Shelter Rescue"} onChange={(e) => setEditDog({ ...editDog, rescueSource: e.target.value as typeof RESCUE_SOURCE_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {RESCUE_SOURCE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {editDog.rescueSource === "Other" && (
                      <input value={editDog.otherRescueSource || ""} onChange={(e) => setEditDog({ ...editDog, otherRescueSource: e.target.value })} placeholder="Enter custom source" className="w-full h-9 px-3 mt-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Support Goal</label>
                    <select value={editDog.supportGoal || "Needs Donations"} onChange={(e) => setEditDog({ ...editDog, supportGoal: e.target.value as typeof SUPPORT_GOAL_OPTIONS[number] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      {SUPPORT_GOAL_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {editDog.supportGoal === "Other" && (
                      <input value={editDog.otherSupportGoal || ""} onChange={(e) => setEditDog({ ...editDog, otherSupportGoal: e.target.value })} placeholder="Enter custom goal" className="w-full h-9 px-3 mt-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1 flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-[#C41E2A]" /> Rescue Story
                  </label>
                  <textarea value={editDog.rescueStory || ""} onChange={(e) => setEditDog({ ...editDog, rescueStory: e.target.value })} placeholder="Tell the emotional story of how this dog came to TTRG and why they need support..." rows={4} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
                  <p className="text-[10px] text-[#1B2A4A]/40 mt-1">This story will appear prominently on the public dog page.</p>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <label className="flex items-center gap-2 text-sm text-[#1B2A4A]/60 cursor-pointer">
                    <input type="checkbox" checked={editDog.urgent || false} onChange={(e) => setEditDog({ ...editDog, urgent: e.target.checked })} className="rounded" />
                    <span className="text-red-600 font-semibold">Mark as Urgent / Critical</span>
                  </label>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 3: MEDICAL NEEDS
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-[#C41E2A]" /> Medical Needs
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {MEDICAL_NEEDS_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-2 text-xs text-[#1B2A4A]/70 cursor-pointer hover:bg-white/50 p-1.5 rounded-lg transition-colors">
                      <input type="checkbox" checked={(editDog.medicalNeedsOptions || []).includes(option)} onChange={(e) => {
                        const current = editDog.medicalNeedsOptions || [];
                        const updated = e.target.checked ? [...current, option] : current.filter(o => o !== option);
                        setEditDog({ ...editDog, medicalNeedsOptions: updated });
                      }} className="rounded" />
                      {option}
                    </label>
                  ))}
                </div>
                {((editDog.medicalNeedsOptions || []).includes("Other")) && (
                  <input value={editDog.otherMedicalNeed || ""} onChange={(e) => setEditDog({ ...editDog, otherMedicalNeed: e.target.value })} placeholder="Specify other medical need" className="w-full h-9 px-3 mt-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                )}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Medical Notes</label>
                  <textarea value={editDog.medicalNeedsNotes || ""} onChange={(e) => setEditDog({ ...editDog, medicalNeedsNotes: e.target.value })} placeholder="Additional medical details..." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 4: TRAINING NEEDS
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#C41E2A]" /> Training Needs
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {TRAINING_NEEDS_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-2 text-xs text-[#1B2A4A]/70 cursor-pointer hover:bg-white/50 p-1.5 rounded-lg transition-colors">
                      <input type="checkbox" checked={(editDog.trainingNeedsOptions || []).includes(option)} onChange={(e) => {
                        const current = editDog.trainingNeedsOptions || [];
                        const updated = e.target.checked ? [...current, option] : current.filter(o => o !== option);
                        setEditDog({ ...editDog, trainingNeedsOptions: updated });
                      }} className="rounded" />
                      {option}
                    </label>
                  ))}
                </div>
                {((editDog.trainingNeedsOptions || []).includes("Other")) && (
                  <input value={editDog.otherTrainingNeed || ""} onChange={(e) => setEditDog({ ...editDog, otherTrainingNeed: e.target.value })} placeholder="Specify other training need" className="w-full h-9 px-3 mt-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                )}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Training Notes</label>
                  <textarea value={editDog.trainingNeedsNotes || ""} onChange={(e) => setEditDog({ ...editDog, trainingNeedsNotes: e.target.value })} placeholder="Additional training details..." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 5: BEHAVIOR NOTES
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-[#C41E2A]" /> Behavior Notes
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BEHAVIOR_NOTES_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-2 text-xs text-[#1B2A4A]/70 cursor-pointer hover:bg-white/50 p-1.5 rounded-lg transition-colors">
                      <input type="checkbox" checked={(editDog.behaviorNotesOptions || []).includes(option)} onChange={(e) => {
                        const current = editDog.behaviorNotesOptions || [];
                        const updated = e.target.checked ? [...current, option] : current.filter(o => o !== option);
                        setEditDog({ ...editDog, behaviorNotesOptions: updated });
                      }} className="rounded" />
                      {option}
                    </label>
                  ))}
                </div>
                {((editDog.behaviorNotesOptions || []).includes("Other")) && (
                  <input value={editDog.otherBehaviorNote || ""} onChange={(e) => setEditDog({ ...editDog, otherBehaviorNote: e.target.value })} placeholder="Specify other behavior note" className="w-full h-9 px-3 mt-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                )}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Behavior Notes</label>
                  <textarea value={editDog.behaviorNotesText || ""} onChange={(e) => setEditDog({ ...editDog, behaviorNotesText: e.target.value })} placeholder="Detailed behavior observations..." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 6: SPECIAL NEEDS
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#C41E2A]" /> Special Needs
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SPECIAL_NEEDS_OPTIONS.map(option => (
                    <label key={option} className="flex items-center gap-2 text-xs text-[#1B2A4A]/70 cursor-pointer hover:bg-white/50 p-1.5 rounded-lg transition-colors">
                      <input type="checkbox" checked={(editDog.specialNeedsOptions || []).includes(option)} onChange={(e) => {
                        const current = editDog.specialNeedsOptions || [];
                        const updated = e.target.checked ? [...current, option] : current.filter(o => o !== option);
                        setEditDog({ ...editDog, specialNeedsOptions: updated });
                      }} className="rounded" />
                      {option}
                    </label>
                  ))}
                </div>
                {((editDog.specialNeedsOptions || []).includes("Other")) && (
                  <input value={editDog.otherSpecialNeed || ""} onChange={(e) => setEditDog({ ...editDog, otherSpecialNeed: e.target.value })} placeholder="Specify other special need" className="w-full h-9 px-3 mt-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white" />
                )}
                <div className="mt-3">
                  <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Special Needs Notes</label>
                  <textarea value={editDog.specialNeedsNotes || ""} onChange={(e) => setEditDog({ ...editDog, specialNeedsNotes: e.target.value })} placeholder="Additional special needs details..." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
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
              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 7: LEGACY STORY FIELDS (for backward compatibility)
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-400 text-white text-xs flex items-center justify-center">7</span>
                  Legacy Story Fields (Optional)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Short Story (legacy)</label>
                    <textarea value={editDog.story} onChange={(e) => setEditDog({ ...editDog, story: e.target.value })} placeholder="Brief one-line summary..." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Full Story (legacy)</label>
                    <textarea value={editDog.fullStory} onChange={(e) => setEditDog({ ...editDog, fullStory: e.target.value })} placeholder="Complete story..." rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 resize-none bg-white" />
                  </div>
                </div>
                <p className="text-[10px] text-[#1B2A4A]/40 mt-2">These legacy fields are auto-populated from the new structured fields above.</p>
              </div>

              {/* ═══════════════════════════════════════════════════════════════
                  SECTION 8: PUBLICATION STATUS
              ═══════════════════════════════════════════════════════════════ */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                <h3 className="text-sm font-bold text-[#1B2A4A] mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C41E2A]" /> Publication Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Status</label>
                    <select value={editDog.status} onChange={(e) => setEditDog({ ...editDog, status: e.target.value as DogStatus })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      <option value="draft">Draft</option>
                      <option value="pending_review">Pending Review</option>
                      <option value="published">Published</option>
                      <option value="hidden">Hidden</option>
                      <option value="adopted">Adopted/Rehomed</option>
                      <option value="urgent">Urgent</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#1B2A4A]/60 mb-1">Legacy Stage (Auto-set)</label>
                    <select value={editDog.stage} onChange={(e) => setEditDog({ ...editDog, stage: e.target.value as AdminDog["stage"] })} className="w-full h-10 px-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#C41E2A]/20 bg-white">
                      <option value="rescue">Rescue</option>
                      <option value="rehabilitate">Rehabilitate</option>
                      <option value="train">Train</option>
                      <option value="recover">Recover</option>
                      <option value="rehome">Rehome</option>
                    </select>
                  </div>
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
