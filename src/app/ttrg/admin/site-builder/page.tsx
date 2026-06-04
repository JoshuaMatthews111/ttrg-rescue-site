"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ArrowLeft, Save, Eye, Globe, Undo2, Redo2, Monitor, Tablet, Smartphone,
  Plus, GripVertical, Trash2, Copy, EyeOff, Eye as EyeIcon, ChevronRight,
  Upload, X, Layers, Settings, FileText, Image as ImageIcon, Type,
  Palette, Link as LinkIcon, Hash, ToggleLeft, Check,
} from "lucide-react";
import { getSession } from "@/lib/admin-store";
import {
  getPages, getPage, savePage, addSection, removeSection, duplicateSection,
  reorderSections, updateSectionField, toggleSectionVisibility, publishPage,
  saveVersion, addAuditLog, getBuilderPermissions, SECTION_TEMPLATES,
  type BuilderPage, type PageSection, type SectionType, type SectionField,
} from "@/lib/site-builder-store";

// ─── VIEWPORT MODES ──────────────────────────────────────────────────────────
type Viewport = "desktop" | "tablet" | "mobile";
const viewportWidths: Record<Viewport, string> = { desktop: "100%", tablet: "768px", mobile: "375px" };

// ─── UNDO/REDO ───────────────────────────────────────────────────────────────
interface HistoryEntry { sections: PageSection[] }

export default function SiteBuilderPage() {
  const router = useRouter();
  const [pages, setPages] = useState<BuilderPage[]>([]);
  const [activePage, setActivePage] = useState<BuilderPage | null>(null);
  const [activeSection, setActiveSection] = useState<PageSection | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [saved, setSaved] = useState(false);
  const [published, setPublished] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("super_admin");
  const [permissions, setPermissions] = useState<string[]>([]);

  // Undo/Redo
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const skipHistoryRef = useRef(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUserName(session.name);
      setUserRole(session.role);
      setPermissions(getBuilderPermissions(session.role));
    }
    const allPages = getPages();
    setPages(allPages);
    if (allPages.length > 0) {
      setActivePage(allPages[0]);
      setHistory([{ sections: JSON.parse(JSON.stringify(allPages[0].sections)) }]);
      setHistoryIdx(0);
    }
  }, []);

  const pushHistory = useCallback((sections: PageSection[]) => {
    if (skipHistoryRef.current) { skipHistoryRef.current = false; return; }
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIdx + 1);
      sliced.push({ sections: JSON.parse(JSON.stringify(sections)) });
      if (sliced.length > 50) sliced.shift();
      return sliced;
    });
    setHistoryIdx((prev) => Math.min(prev + 1, 50));
  }, [historyIdx]);

  const undo = useCallback(() => {
    if (historyIdx <= 0 || !activePage) return;
    const newIdx = historyIdx - 1;
    skipHistoryRef.current = true;
    const restored = JSON.parse(JSON.stringify(history[newIdx].sections));
    setActivePage({ ...activePage, sections: restored });
    savePage({ ...activePage, sections: restored });
    setHistoryIdx(newIdx);
  }, [historyIdx, history, activePage]);

  const redo = useCallback(() => {
    if (historyIdx >= history.length - 1 || !activePage) return;
    const newIdx = historyIdx + 1;
    skipHistoryRef.current = true;
    const restored = JSON.parse(JSON.stringify(history[newIdx].sections));
    setActivePage({ ...activePage, sections: restored });
    savePage({ ...activePage, sections: restored });
    setHistoryIdx(newIdx);
  }, [historyIdx, history, activePage]);

  const refreshPage = useCallback(() => {
    if (!activePage) return;
    const fresh = getPage(activePage.id);
    if (fresh) { setActivePage(fresh); pushHistory(fresh.sections); }
  }, [activePage, pushHistory]);

  // ─── ACTIONS ─────────────────────────────────────────────────────────────
  const handleDragEnd = (event: DragEndEvent) => {
    if (!activePage) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = activePage.sections.findIndex((s) => s.id === active.id);
    const newIdx = activePage.sections.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(activePage.sections, oldIdx, newIdx);
    reordered.forEach((s, i) => { s.order = i; });
    const updated = { ...activePage, sections: reordered, updatedAt: new Date().toISOString() };
    setActivePage(updated);
    savePage(updated);
    pushHistory(reordered);
    addAuditLog({ userId: "current", userName, pageId: activePage.id, pageTitle: activePage.title, action: "reorder", status: "draft" });
  };

  const handleAddSection = (type: SectionType) => {
    if (!activePage) return;
    addSection(activePage.id, type);
    refreshPage();
    setShowAddPanel(false);
    addAuditLog({ userId: "current", userName, pageId: activePage.id, pageTitle: activePage.title, action: "create", sectionLabel: SECTION_TEMPLATES[type].label, status: "draft" });
  };

  const handleRemoveSection = (sectionId: string) => {
    if (!activePage) return;
    const section = activePage.sections.find((s) => s.id === sectionId);
    removeSection(activePage.id, sectionId);
    refreshPage();
    if (activeSection?.id === sectionId) setActiveSection(null);
    addAuditLog({ userId: "current", userName, pageId: activePage.id, pageTitle: activePage.title, action: "delete", sectionLabel: section?.label, status: "draft" });
  };

  const handleDuplicateSection = (sectionId: string) => {
    if (!activePage) return;
    duplicateSection(activePage.id, sectionId);
    refreshPage();
  };

  const handleToggleVisibility = (sectionId: string) => {
    if (!activePage) return;
    toggleSectionVisibility(activePage.id, sectionId);
    refreshPage();
  };

  const handleFieldChange = (sectionId: string, fieldKey: string, value: string) => {
    if (!activePage) return;
    updateSectionField(activePage.id, sectionId, fieldKey, value);
    refreshPage();
  };

  const handleSaveDraft = () => {
    if (!activePage) return;
    saveVersion(activePage.id, userName, "Draft saved");
    addAuditLog({ userId: "current", userName, pageId: activePage.id, pageTitle: activePage.title, action: "save_draft", status: "draft" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePublish = () => {
    if (!activePage || !permissions.includes("publish")) return;
    publishPage(activePage.id, userName);
    refreshPage();
    addAuditLog({ userId: "current", userName, pageId: activePage.id, pageTitle: activePage.title, action: "publish", status: "published" });
    setPublished(true);
    setTimeout(() => setPublished(false), 2500);
  };

  const canEdit = permissions.includes("edit");

  if (!activePage) {
    return <div className="h-full flex items-center justify-center text-white/50 text-sm">Loading builder...</div>;
  }

  return (
    <>
      {/* ═══ TOP TOOLBAR ═══ */}
      <div className="h-14 bg-[#1a1f2e] border-b border-white/10 flex items-center px-4 gap-3 flex-shrink-0 z-50">
        {/* Back */}
        <Link href="/ttrg/admin" className="flex items-center gap-2 text-white/60 hover:text-white text-xs font-medium transition-colors mr-2">
          <ArrowLeft className="w-4 h-4" /> Back to Admin
        </Link>

        <div className="w-px h-6 bg-white/10" />

        {/* Page selector */}
        <div className="flex items-center gap-2 ml-2">
          <FileText className="w-3.5 h-3.5 text-white/40" />
          <select
            value={activePage.id}
            onChange={(e) => {
              const p = pages.find((pg) => pg.id === e.target.value);
              if (p) { setActivePage(p); setActiveSection(null); }
            }}
            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#C41E2A]/50"
          >
            {pages.map((p) => <option key={p.id} value={p.id} className="bg-[#1a1f2e]">{p.title}</option>)}
          </select>
        </div>

        <div className="flex-1" />

        {/* Viewport */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          {([["desktop", Monitor], ["tablet", Tablet], ["mobile", Smartphone]] as [Viewport, typeof Monitor][]).map(([vp, Icon]) => (
            <button key={vp} onClick={() => setViewport(vp)} className={`p-1.5 rounded-md transition-colors ${viewport === vp ? "bg-white/15 text-white" : "text-white/40 hover:text-white/70"}`}>
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/10" />

        {/* Undo/Redo */}
        <button onClick={undo} disabled={historyIdx <= 0} className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
          <Undo2 className="w-4 h-4" />
        </button>
        <button onClick={redo} disabled={historyIdx >= history.length - 1} className="p-1.5 text-white/40 hover:text-white disabled:opacity-30 transition-colors">
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-white/10" />

        {/* Actions */}
        {canEdit && (
          <>
            <button onClick={handleSaveDraft} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}>
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? "Saved!" : "Save Draft"}
            </button>
            {permissions.includes("publish") && (
              <button onClick={handlePublish} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${published ? "bg-emerald-500 text-white" : "bg-[#C41E2A] text-white hover:bg-[#a01825]"}`}>
                {published ? <Check className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
                {published ? "Published!" : "Publish"}
              </button>
            )}
          </>
        )}
      </div>

      {/* ═══ MAIN BODY ═══ */}
      <div className="flex-1 flex overflow-hidden">

        {/* ─── LEFT SIDEBAR: Sections List ─── */}
        <div className="w-64 bg-[#141824] border-r border-white/5 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#C41E2A]" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Sections</span>
            </div>
            {canEdit && (
              <button onClick={() => setShowAddPanel(!showAddPanel)} className="w-7 h-7 rounded-lg bg-[#C41E2A] hover:bg-[#a01825] flex items-center justify-center transition-colors">
                <Plus className="w-3.5 h-3.5 text-white" />
              </button>
            )}
          </div>

          {/* Add Section Panel */}
          {showAddPanel && (
            <div className="p-3 border-b border-white/5 bg-black/20 max-h-64 overflow-y-auto">
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-wider mb-2 px-1">Add Block</p>
              <div className="grid grid-cols-2 gap-1.5">
                {(Object.entries(SECTION_TEMPLATES) as [SectionType, typeof SECTION_TEMPLATES[SectionType]][]).map(([type, tmpl]) => (
                  <button
                    key={type}
                    onClick={() => handleAddSection(type)}
                    className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-center"
                  >
                    <span className="text-base">{tmpl.icon}</span>
                    <span className="text-[9px] font-medium leading-tight">{tmpl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sections List (Sortable) */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={activePage.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
                {activePage.sections.map((section) => (
                  <SortableSectionItem
                    key={section.id}
                    section={section}
                    isActive={activeSection?.id === section.id}
                    onClick={() => setActiveSection(section)}
                    onRemove={() => handleRemoveSection(section.id)}
                    onDuplicate={() => handleDuplicateSection(section.id)}
                    onToggleVisibility={() => handleToggleVisibility(section.id)}
                    canEdit={canEdit}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {activePage.sections.length === 0 && (
              <p className="text-white/30 text-xs text-center py-8">No sections yet. Click + to add one.</p>
            )}
          </div>
        </div>

        {/* ─── CENTER: Canvas Preview ─── */}
        <div className="flex-1 bg-[#0a0e18] flex items-start justify-center overflow-auto p-6">
          <div
            className="bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 min-h-[600px]"
            style={{ width: viewportWidths[viewport], maxWidth: "100%" }}
          >
            {activePage.sections.filter((s) => s.visible).map((section) => (
              <CanvasSection
                key={section.id}
                section={section}
                isSelected={activeSection?.id === section.id}
                onSelect={() => setActiveSection(section)}
                onFieldChange={(fieldKey, value) => handleFieldChange(section.id, fieldKey, value)}
                canEdit={canEdit}
              />
            ))}
            {activePage.sections.filter((s) => s.visible).length === 0 && (
              <div className="flex items-center justify-center h-96 text-slate-400 text-sm">
                No visible sections. Add or show sections from the left panel.
              </div>
            )}
          </div>
        </div>

        {/* ─── RIGHT: Settings Panel ─── */}
        <div className="w-72 bg-[#141824] border-l border-white/5 flex flex-col overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-white/5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#C41E2A]" />
            <span className="text-white text-xs font-bold uppercase tracking-wider">Settings</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {activeSection ? (
              <SectionSettings
                section={activeSection}
                onFieldChange={(fieldKey, value) => handleFieldChange(activeSection.id, fieldKey, value)}
                canEdit={canEdit}
              />
            ) : (
              <div className="text-white/30 text-xs text-center py-12">
                Select a section to edit its settings.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SORTABLE SECTION ITEM (Left Sidebar)
// ═══════════════════════════════════════════════════════════════════════════════

function SortableSectionItem({
  section, isActive, onClick, onRemove, onDuplicate, onToggleVisibility, canEdit,
}: {
  section: PageSection; isActive: boolean; onClick: () => void;
  onRemove: () => void; onDuplicate: () => void; onToggleVisibility: () => void; canEdit: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const tmpl = SECTION_TEMPLATES[section.type];

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onClick}
      className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all group ${
        isActive ? "bg-[#C41E2A]/20 border border-[#C41E2A]/40" : "hover:bg-white/5 border border-transparent"
      } ${!section.visible ? "opacity-40" : ""}`}
    >
      {canEdit && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-0.5">
          <GripVertical className="w-3.5 h-3.5 text-white/30" />
        </div>
      )}
      <span className="text-sm flex-shrink-0">{tmpl?.icon || "📄"}</span>
      <span className="text-white/80 text-xs font-medium flex-1 truncate">{section.label}</span>
      {canEdit && (
        <div className="hidden group-hover:flex items-center gap-0.5">
          <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
            {section.visible ? <EyeIcon className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="p-1 rounded hover:bg-white/10 text-white/30 hover:text-white/70 transition-colors">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS SECTION (Center Preview)
// ═══════════════════════════════════════════════════════════════════════════════

function CanvasSection({
  section, isSelected, onSelect, onFieldChange, canEdit,
}: {
  section: PageSection; isSelected: boolean; onSelect: () => void;
  onFieldChange: (fieldKey: string, value: string) => void; canEdit: boolean;
}) {
  const tmpl = SECTION_TEMPLATES[section.type];

  return (
    <div
      onClick={onSelect}
      className={`relative border-2 transition-all cursor-pointer ${
        isSelected ? "border-[#C41E2A]/60 shadow-[0_0_0_2px_rgba(196,30,42,0.15)]" : "border-transparent hover:border-blue-400/30"
      }`}
    >
      {/* Section type badge */}
      {isSelected && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 bg-[#C41E2A] text-white px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-lg">
          <span>{tmpl?.icon}</span> {section.label}
        </div>
      )}

      {/* Rendered preview */}
      <SectionPreview section={section} onFieldChange={onFieldChange} canEdit={canEdit} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION PREVIEW (Visual rendering in canvas)
// ═══════════════════════════════════════════════════════════════════════════════

function SectionPreview({
  section, onFieldChange, canEdit,
}: {
  section: PageSection; onFieldChange: (fieldKey: string, value: string) => void; canEdit: boolean;
}) {
  const fields = Object.fromEntries(section.fields.map((f) => [f.label, f]));

  const EditableText = ({ field, className, tag = "p" }: { field?: SectionField; className?: string; tag?: string }) => {
    if (!field) return null;
    const props = {
      contentEditable: canEdit,
      suppressContentEditableWarning: true,
      onBlur: (e: React.FocusEvent<HTMLElement>) => {
        if (canEdit && e.currentTarget.textContent !== field.value) {
          onFieldChange(field.key, e.currentTarget.textContent || "");
        }
      },
      className: `outline-none focus:ring-2 focus:ring-[#C41E2A]/30 focus:bg-[#C41E2A]/5 rounded px-1 -mx-1 transition-all ${className || ""}`,
      children: field.value,
    };
    switch (tag) {
      case "h1": return <h1 {...props} />;
      case "h2": return <h2 {...props} />;
      case "h3": return <h3 {...props} />;
      case "span": return <span {...props} />;
      default: return <p {...props} />;
    }
  };

  switch (section.type) {
    case "hero":
      return (
        <div className="relative min-h-[320px] bg-gradient-to-br from-[#0a1628] via-[#1a3a2a] to-[#0a1628] flex items-center p-8 sm:p-12">
          <div className="relative z-10 max-w-lg">
            <EditableText field={fields["Headline"]} className="text-white text-3xl sm:text-4xl font-black mb-3" tag="h1" />
            <EditableText field={fields["Subheadline"]} className="text-white/60 text-base sm:text-lg mb-6" />
            <div className="inline-flex items-center gap-2 bg-[#C41E2A] text-white px-6 py-3 rounded-full text-sm font-bold">
              <EditableText field={fields["CTA Button Text"]} className="text-white" tag="span" />
            </div>
          </div>
        </div>
      );

    case "stats":
      return (
        <div className="py-12 px-8 bg-gradient-to-br from-[#eef4ee] to-[#f0f5ee]">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-8" tag="h2" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {["Dogs Rescued", "Dogs Trained", "Forever Homes", "Active Fosters"].map((label) => (
              <div key={label} className="bg-white/80 rounded-xl p-4 text-center border border-[#2d5a3d]/10">
                <EditableText field={fields[label]} className="text-3xl font-black text-[#1B2A4A]" tag="p" />
                <p className="text-xs text-[#1B2A4A]/50 mt-1 font-semibold uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "rescue_journey":
      return (
        <div className="py-12 px-8 bg-white">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-3" tag="h2" />
          <EditableText field={fields["Subtitle"]} className="text-[#1B2A4A]/50 text-sm text-center max-w-xl mx-auto" />
          <div className="flex justify-between mt-8 gap-2">
            {["Rescue", "Medical", "Training", "Foster", "Adopt"].map((step, i) => (
              <div key={step} className="flex-1 text-center">
                <div className="w-10 h-10 rounded-full bg-[#C41E2A]/10 flex items-center justify-center mx-auto mb-2">
                  <span className="text-[#C41E2A] font-bold text-sm">{i + 1}</span>
                </div>
                <p className="text-xs font-semibold text-[#1B2A4A]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case "dog_grid":
      return (
        <div className="py-12 px-8 bg-[#f9f7f4]">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-3" tag="h2" />
          <EditableText field={fields["Subtitle"]} className="text-[#1B2A4A]/50 text-sm text-center mb-8" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                <div className="h-32 bg-gradient-to-br from-slate-200 to-slate-100 flex items-center justify-center">
                  <span className="text-3xl">🐕</span>
                </div>
                <div className="p-3">
                  <p className="text-sm font-bold text-[#1B2A4A]">Dog Name {i}</p>
                  <p className="text-xs text-[#1B2A4A]/50">Breed · Age</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "founder_feature":
      return (
        <div className="py-12 px-8 bg-gradient-to-br from-white via-[#f2f7f0] to-[#eef4ee]">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden shadow-xl flex-shrink-0 bg-slate-200">
              {fields["Photo"]?.value && (
                <img src={fields["Photo"].value} alt="Founder" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <EditableText field={fields["Title"]} className="text-[#C41E2A] text-xs font-bold uppercase tracking-wider mb-1" tag="p" />
              <EditableText field={fields["Name"]} className="text-[#1B2A4A] text-2xl font-black mb-2" tag="h3" />
              <EditableText field={fields["Bio Excerpt"]} className="text-[#1B2A4A]/60 text-sm leading-relaxed" />
            </div>
          </div>
        </div>
      );

    case "donation_tiers":
      return (
        <div className="py-12 px-8 bg-white">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-8" tag="h2" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-slate-200 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                <p className="text-2xl font-black text-[#C41E2A] mb-2">${fields[`Tier ${i} Amount`]?.value || "0"}</p>
                <EditableText field={fields[`Tier ${i} Label`]} className="text-sm font-semibold text-[#1B2A4A]" tag="p" />
              </div>
            ))}
          </div>
        </div>
      );

    case "testimonial_slider":
      return (
        <div className="py-12 px-8 bg-[#eef4ee]">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-8" tag="h2" />
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-lg mx-auto">
            <EditableText field={fields["Testimonial 1"]} className="text-[#1B2A4A]/70 text-sm italic mb-3" />
            <EditableText field={fields["Author 1"]} className="text-[#1B2A4A] text-xs font-bold" tag="p" />
          </div>
        </div>
      );

    case "video_feature":
      return (
        <div className="py-12 px-8 bg-[#0a1628]">
          <EditableText field={fields["Title"]} className="text-white text-2xl font-black text-center mb-4" tag="h2" />
          <div className="max-w-lg mx-auto aspect-video rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center">
            <span className="text-4xl">▶️</span>
          </div>
          <EditableText field={fields["Description"]} className="text-white/60 text-sm text-center mt-4 max-w-md mx-auto" />
        </div>
      );

    case "rescue_alert":
      return (
        <div className="py-4 px-8" style={{ backgroundColor: fields["Background Color"]?.value || "#C41E2A" }}>
          <EditableText field={fields["Alert Text"]} className="text-white text-sm font-bold text-center" tag="p" />
        </div>
      );

    case "contact_cta":
    case "adoption_cta":
    case "foster_cta":
    case "sponsor_cta":
      return (
        <div className="py-12 px-8 bg-white text-center">
          <EditableText field={fields["Headline"]} className="text-[#1B2A4A] text-2xl font-black mb-2" tag="h2" />
          <EditableText field={fields["Subtitle"]} className="text-[#1B2A4A]/50 text-sm mb-6" />
          <div className="inline-flex items-center gap-2 bg-[#1B2A4A] text-white px-6 py-3 rounded-full text-sm font-bold">
            <EditableText field={fields["Button Text"]} className="text-white" tag="span" />
          </div>
        </div>
      );

    case "image_text_split":
      return (
        <div className="py-12 px-8 bg-white">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-full sm:w-1/2 h-48 rounded-xl bg-slate-100 overflow-hidden">
              {fields["Image"]?.value && <img src={fields["Image"].value} alt="" className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <EditableText field={fields["Headline"]} className="text-[#1B2A4A] text-2xl font-black mb-3" tag="h2" />
              <EditableText field={fields["Body Text"]} className="text-[#1B2A4A]/60 text-sm leading-relaxed" />
            </div>
          </div>
        </div>
      );

    case "faq":
      return (
        <div className="py-12 px-8 bg-[#FAFAF8]">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-8" tag="h2" />
          <div className="max-w-lg mx-auto space-y-4">
            {["Q1", "Q2"].map((qKey) => (
              <div key={qKey} className="border border-slate-200 rounded-xl p-4 bg-white">
                <EditableText field={fields[qKey]} className="text-[#1B2A4A] text-sm font-bold mb-2" tag="p" />
                <EditableText field={fields[qKey.replace("Q", "A")]} className="text-[#1B2A4A]/60 text-sm" />
              </div>
            ))}
          </div>
        </div>
      );

    case "success_stories":
      return (
        <div className="py-12 px-8 bg-[#eef4ee]">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A] text-2xl font-black text-center mb-3" tag="h2" />
          <EditableText field={fields["Subtitle"]} className="text-[#1B2A4A]/50 text-sm text-center" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl h-28 flex items-center justify-center border border-slate-100 shadow-sm">
                <span className="text-2xl">🎬</span>
              </div>
            ))}
          </div>
        </div>
      );

    case "partners":
      return (
        <div className="py-8 px-8 bg-white border-y border-slate-100">
          <EditableText field={fields["Section Title"]} className="text-[#1B2A4A]/40 text-xs font-bold uppercase tracking-wider text-center mb-4" tag="p" />
          <div className="flex justify-center gap-8 opacity-50">
            {["🏥", "🏫", "🏢", "🏠", "🤝"].map((icon, i) => (
              <span key={i} className="text-2xl">{icon}</span>
            ))}
          </div>
        </div>
      );

    case "announcements":
      return (
        <div className="py-12 px-8 bg-[#1B2A4A]">
          <EditableText field={fields["Popup Title"]} className="text-white text-2xl font-black text-center mb-3" tag="h2" />
          <EditableText field={fields["Popup Body"]} className="text-white/60 text-sm text-center mb-6 max-w-md mx-auto" />
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-[#C41E2A] text-white px-6 py-3 rounded-full text-sm font-bold">
              <EditableText field={fields["Button Text"]} className="text-white" tag="span" />
            </span>
          </div>
        </div>
      );

    case "custom_html":
      return (
        <div className="py-8 px-8 bg-white">
          <EditableText field={fields["Content"]} className="text-[#1B2A4A] text-sm prose" />
        </div>
      );

    default:
      return (
        <div className="py-8 px-8 bg-slate-50 text-center">
          <p className="text-slate-400 text-sm">{section.label} — Preview not available</p>
        </div>
      );
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION SETTINGS (Right Panel)
// ═══════════════════════════════════════════════════════════════════════════════

function SectionSettings({
  section, onFieldChange, canEdit,
}: {
  section: PageSection; onFieldChange: (fieldKey: string, value: string) => void; canEdit: boolean;
}) {
  const tmpl = SECTION_TEMPLATES[section.type];

  const fieldIcon = (type: SectionField["type"]) => {
    switch (type) {
      case "text": return <Type className="w-3.5 h-3.5" />;
      case "richtext": return <FileText className="w-3.5 h-3.5" />;
      case "image": return <ImageIcon className="w-3.5 h-3.5" />;
      case "video": return <ImageIcon className="w-3.5 h-3.5" />;
      case "link": return <LinkIcon className="w-3.5 h-3.5" />;
      case "color": return <Palette className="w-3.5 h-3.5" />;
      case "number": return <Hash className="w-3.5 h-3.5" />;
      case "boolean": return <ToggleLeft className="w-3.5 h-3.5" />;
      default: return <Type className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-white/5">
        <span className="text-lg">{tmpl?.icon}</span>
        <div>
          <p className="text-white text-sm font-bold">{section.label}</p>
          <p className="text-white/40 text-[10px] uppercase tracking-wider">{section.type}</p>
        </div>
      </div>

      {section.fields.map((field) => (
        <div key={field.key} className="space-y-1.5">
          <div className="flex items-center gap-1.5 text-white/50">
            {fieldIcon(field.type)}
            <label className="text-[10px] font-bold uppercase tracking-wider">{field.label}</label>
          </div>

          {field.type === "boolean" ? (
            <button
              onClick={() => canEdit && onFieldChange(field.key, field.value === "true" ? "false" : "true")}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                field.value === "true" ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/40"
              }`}
            >
              {field.value === "true" ? "✓ Enabled" : "✗ Disabled"}
            </button>
          ) : field.type === "color" ? (
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={field.value}
                onChange={(e) => canEdit && onFieldChange(field.key, e.target.value)}
                disabled={!canEdit}
                className="w-8 h-8 rounded-lg border border-white/10 cursor-pointer"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => canEdit && onFieldChange(field.key, e.target.value)}
                disabled={!canEdit}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C41E2A]/50 disabled:opacity-50"
              />
            </div>
          ) : field.type === "richtext" ? (
            <textarea
              value={field.value}
              onChange={(e) => canEdit && onFieldChange(field.key, e.target.value)}
              disabled={!canEdit}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C41E2A]/50 resize-none disabled:opacity-50"
            />
          ) : field.type === "image" || field.type === "video" ? (
            <div className="space-y-2">
              <input
                type="text"
                value={field.value}
                onChange={(e) => canEdit && onFieldChange(field.key, e.target.value)}
                disabled={!canEdit}
                placeholder="URL or path..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C41E2A]/50 disabled:opacity-50"
              />
              {field.type === "image" && field.value && (
                <div className="w-full h-20 rounded-lg overflow-hidden bg-slate-800">
                  <img src={field.value} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              {canEdit && (
                <label className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer text-white/60 hover:text-white text-xs font-medium transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                  <input type="file" accept={field.type === "image" ? "image/*" : "video/*"} className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file || !canEdit) return;
                    const url = URL.createObjectURL(file);
                    onFieldChange(field.key, url);
                  }} />
                </label>
              )}
            </div>
          ) : (
            <input
              type={field.type === "number" ? "number" : "text"}
              value={field.value}
              onChange={(e) => canEdit && onFieldChange(field.key, e.target.value)}
              disabled={!canEdit}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#C41E2A]/50 disabled:opacity-50"
            />
          )}
        </div>
      ))}
    </div>
  );
}
