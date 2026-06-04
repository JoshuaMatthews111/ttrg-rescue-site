// ═══════════════════════════════════════════════════════════════════════════════
// TTRG Visual Site Builder — Data Store
// Uses localStorage for now; structured for easy Supabase migration.
// ═══════════════════════════════════════════════════════════════════════════════

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type SectionType =
  | "hero"
  | "dog_grid"
  | "donation_tiers"
  | "founder_feature"
  | "testimonial_slider"
  | "video_feature"
  | "rescue_alert"
  | "contact_cta"
  | "adoption_cta"
  | "foster_cta"
  | "sponsor_cta"
  | "image_text_split"
  | "faq"
  | "rescue_journey"
  | "success_stories"
  | "announcements"
  | "stats"
  | "partners"
  | "custom_html";

export interface SectionField {
  key: string;
  type: "text" | "richtext" | "image" | "video" | "link" | "color" | "number" | "boolean";
  label: string;
  value: string;
}

export interface PageSection {
  id: string;
  type: SectionType;
  label: string;
  order: number;
  visible: boolean;
  fields: SectionField[];
  createdAt: string;
  updatedAt: string;
}

export interface BuilderPage {
  id: string;
  slug: string;
  title: string;
  sections: PageSection[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export interface PageVersion {
  id: string;
  pageId: string;
  sections: PageSection[];
  status: "draft" | "published";
  savedBy: string;
  savedAt: string;
  note?: string;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  pageId: string;
  pageTitle: string;
  sectionId?: string;
  sectionLabel?: string;
  action: "create" | "edit" | "reorder" | "delete" | "hide" | "show" | "publish" | "save_draft" | "restore" | "upload_media";
  oldValue?: string;
  newValue?: string;
  status: "draft" | "published";
  timestamp: string;
}

export interface MediaItem {
  id: string;
  url: string;
  alt: string;
  type: "image" | "video";
  filename: string;
  uploadedBy: string;
  uploadedAt: string;
  sizeBytes?: number;
}

// ─── STORAGE KEYS ────────────────────────────────────────────────────────────

const KEYS = {
  pages: "ttrg-builder-pages",
  versions: "ttrg-builder-versions",
  auditLogs: "ttrg-builder-audit-logs",
  media: "ttrg-builder-media",
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function save<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── SECTION TEMPLATES ───────────────────────────────────────────────────────

export const SECTION_TEMPLATES: Record<SectionType, { label: string; icon: string; defaultFields: Omit<SectionField, "key">[] }> = {
  hero: {
    label: "Hero Section",
    icon: "🏠",
    defaultFields: [
      { type: "text", label: "Headline", value: "Welcome to TTRG" },
      { type: "text", label: "Subheadline", value: "Rescue. Train. Rehome. Repeat." },
      { type: "image", label: "Background Image", value: "/ttrg/video/lo-walkin-web.mp4" },
      { type: "text", label: "CTA Button Text", value: "Donate Now" },
      { type: "link", label: "CTA Button Link", value: "/ttrg/donate" },
    ],
  },
  rescue_journey: {
    label: "Rescue Journey",
    icon: "🐾",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Every Dog Follows This Path" },
      { type: "text", label: "Subtitle", value: "A proven framework that moves every dog from rescue to a permanent loving home." },
    ],
  },
  dog_grid: {
    label: "Dogs Grid",
    icon: "🐕",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Dogs Needing Support" },
      { type: "text", label: "Subtitle", value: "Each of these dogs is on a journey toward their forever home." },
      { type: "number", label: "Max Dogs Shown", value: "6" },
    ],
  },
  donation_tiers: {
    label: "Donation Tiers",
    icon: "💝",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Your Donation Makes a Difference" },
      { type: "text", label: "Tier 1 Label", value: "Feed a Dog for a Week" },
      { type: "number", label: "Tier 1 Amount", value: "25" },
      { type: "text", label: "Tier 2 Label", value: "Sponsor Medical Care" },
      { type: "number", label: "Tier 2 Amount", value: "100" },
      { type: "text", label: "Tier 3 Label", value: "Full Rescue Journey" },
      { type: "number", label: "Tier 3 Amount", value: "500" },
    ],
  },
  founder_feature: {
    label: "Founder Feature",
    icon: "👤",
    defaultFields: [
      { type: "text", label: "Name", value: "Lorenzo Miller" },
      { type: "text", label: "Title", value: "Founder & Lead Trainer" },
      { type: "richtext", label: "Bio Excerpt", value: "40+ years dedicated to dogs — from training to rescue to changing lives." },
      { type: "image", label: "Photo", value: "/ttrg/founder-lorenzo.jpg" },
      { type: "link", label: "Read More Link", value: "/ttrg/founder" },
    ],
  },
  testimonial_slider: {
    label: "Testimonials",
    icon: "⭐",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Success Stories" },
      { type: "richtext", label: "Testimonial 1", value: "TTRG changed our dog's life completely." },
      { type: "text", label: "Author 1", value: "Happy Adopter" },
      { type: "richtext", label: "Testimonial 2", value: "We couldn't have asked for a better experience." },
      { type: "text", label: "Author 2", value: "Foster Family" },
    ],
  },
  video_feature: {
    label: "Video Feature",
    icon: "🎬",
    defaultFields: [
      { type: "text", label: "Title", value: "Watch Our Story" },
      { type: "video", label: "Video URL", value: "/ttrg/video/bo-brady-web.mp4" },
      { type: "image", label: "Poster Image", value: "/ttrg/video/bo-brady-poster.jpg" },
      { type: "richtext", label: "Description", value: "See the incredible transformations at TTRG." },
    ],
  },
  rescue_alert: {
    label: "Rescue Alert Banner",
    icon: "🚨",
    defaultFields: [
      { type: "text", label: "Alert Text", value: "URGENT: New rescue needs immediate foster placement!" },
      { type: "link", label: "Alert Link", value: "/ttrg/foster" },
      { type: "color", label: "Background Color", value: "#C41E2A" },
      { type: "boolean", label: "Visible", value: "true" },
    ],
  },
  contact_cta: {
    label: "Contact CTA",
    icon: "📞",
    defaultFields: [
      { type: "text", label: "Headline", value: "Get In Touch" },
      { type: "text", label: "Subtitle", value: "Questions about adopting, fostering, or volunteering?" },
      { type: "text", label: "Button Text", value: "Contact Us" },
      { type: "link", label: "Button Link", value: "/ttrg/contact" },
    ],
  },
  adoption_cta: {
    label: "Adoption CTA",
    icon: "🏡",
    defaultFields: [
      { type: "text", label: "Headline", value: "Ready to Adopt?" },
      { type: "text", label: "Subtitle", value: "Start your application today." },
      { type: "text", label: "Button Text", value: "Apply to Adopt" },
      { type: "link", label: "Button Link", value: "/ttrg/adopt" },
    ],
  },
  foster_cta: {
    label: "Foster CTA",
    icon: "🤝",
    defaultFields: [
      { type: "text", label: "Headline", value: "Become a Foster" },
      { type: "text", label: "Subtitle", value: "Provide a temporary home for a dog in need." },
      { type: "text", label: "Button Text", value: "Apply to Foster" },
      { type: "link", label: "Button Link", value: "/ttrg/foster" },
    ],
  },
  sponsor_cta: {
    label: "Sponsor CTA",
    icon: "💰",
    defaultFields: [
      { type: "text", label: "Headline", value: "Sponsor a Dog" },
      { type: "text", label: "Subtitle", value: "Cover their care while they wait for a home." },
      { type: "text", label: "Button Text", value: "Become a Sponsor" },
      { type: "link", label: "Button Link", value: "/ttrg/sponsor" },
    ],
  },
  image_text_split: {
    label: "Image + Text Split",
    icon: "📐",
    defaultFields: [
      { type: "text", label: "Headline", value: "Our Mission" },
      { type: "richtext", label: "Body Text", value: "We rescue, rehabilitate, train, and rehome dogs." },
      { type: "image", label: "Image", value: "/ttrg/founder-lorenzo.jpg" },
      { type: "text", label: "Image Position", value: "left" },
    ],
  },
  faq: {
    label: "FAQ Block",
    icon: "❓",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Frequently Asked Questions" },
      { type: "text", label: "Q1", value: "How do I adopt a dog?" },
      { type: "richtext", label: "A1", value: "Start by filling out our adoption application." },
      { type: "text", label: "Q2", value: "Can I foster instead?" },
      { type: "richtext", label: "A2", value: "Yes! We always need foster homes." },
    ],
  },
  success_stories: {
    label: "Success Stories",
    icon: "🎉",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Real Dogs. Real Transformation." },
      { type: "text", label: "Subtitle", value: "Watch the journeys of dogs we've rescued." },
    ],
  },
  stats: {
    label: "Impact Stats",
    icon: "📊",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Making a Measurable Difference" },
      { type: "number", label: "Dogs Rescued", value: "247" },
      { type: "number", label: "Dogs Trained", value: "189" },
      { type: "number", label: "Forever Homes", value: "156" },
      { type: "number", label: "Active Fosters", value: "34" },
    ],
  },
  partners: {
    label: "Partners Section",
    icon: "🏢",
    defaultFields: [
      { type: "text", label: "Section Title", value: "Trusted By Our Community Partners" },
    ],
  },
  announcements: {
    label: "Announcements / Popup",
    icon: "📢",
    defaultFields: [
      { type: "text", label: "Popup Title", value: "Help Us Save More Dogs" },
      { type: "richtext", label: "Popup Body", value: "Sign up to stay updated on our rescue missions." },
      { type: "text", label: "Button Text", value: "Subscribe" },
      { type: "boolean", label: "Show Popup", value: "true" },
    ],
  },
  custom_html: {
    label: "Custom Block",
    icon: "🧩",
    defaultFields: [
      { type: "richtext", label: "Content", value: "<p>Custom content here</p>" },
    ],
  },
};

// ─── DEFAULT HOMEPAGE SECTIONS ───────────────────────────────────────────────

function createDefaultHomepage(): BuilderPage {
  const now = new Date().toISOString();
  const sections: PageSection[] = [
    { id: uid(), type: "hero", label: "Hero Section", order: 0, visible: true, fields: buildFields("hero"), createdAt: now, updatedAt: now },
    { id: uid(), type: "stats", label: "Impact Stats", order: 1, visible: true, fields: buildFields("stats"), createdAt: now, updatedAt: now },
    { id: uid(), type: "rescue_journey", label: "Rescue Journey", order: 2, visible: true, fields: buildFields("rescue_journey"), createdAt: now, updatedAt: now },
    { id: uid(), type: "success_stories", label: "Success Stories", order: 3, visible: true, fields: buildFields("success_stories"), createdAt: now, updatedAt: now },
    { id: uid(), type: "dog_grid", label: "Dogs Needing Support", order: 4, visible: true, fields: buildFields("dog_grid"), createdAt: now, updatedAt: now },
    { id: uid(), type: "founder_feature", label: "Founder Feature", order: 5, visible: true, fields: buildFields("founder_feature"), createdAt: now, updatedAt: now },
    { id: uid(), type: "partners", label: "Partners", order: 6, visible: true, fields: buildFields("partners"), createdAt: now, updatedAt: now },
    { id: uid(), type: "donation_tiers", label: "Donation Tiers", order: 7, visible: true, fields: buildFields("donation_tiers"), createdAt: now, updatedAt: now },
  ];

  return {
    id: "home",
    slug: "/ttrg",
    title: "Homepage",
    sections,
    status: "published",
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
  };
}

function buildFields(type: SectionType): SectionField[] {
  const template = SECTION_TEMPLATES[type];
  return template.defaultFields.map((f, i) => ({
    key: `${type}_${i}_${f.label.toLowerCase().replace(/\s+/g, "_")}`,
    ...f,
  }));
}

// ─── PAGE CRUD ───────────────────────────────────────────────────────────────

export function getPages(): BuilderPage[] {
  const pages = load<BuilderPage[]>(KEYS.pages, []);
  if (pages.length === 0) {
    const defaults = [createDefaultHomepage()];
    save(KEYS.pages, defaults);
    return defaults;
  }
  return pages;
}

export function getPage(id: string): BuilderPage | null {
  return getPages().find((p) => p.id === id) || null;
}

export function savePage(page: BuilderPage): void {
  const pages = getPages();
  const idx = pages.findIndex((p) => p.id === page.id);
  if (idx >= 0) pages[idx] = page;
  else pages.push(page);
  save(KEYS.pages, pages);
}

export function createPage(title: string, slug: string): BuilderPage {
  const now = new Date().toISOString();
  const page: BuilderPage = {
    id: uid(),
    slug,
    title,
    sections: [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  const pages = getPages();
  pages.push(page);
  save(KEYS.pages, pages);
  return page;
}

export function deletePage(id: string): void {
  const pages = getPages().filter((p) => p.id !== id);
  save(KEYS.pages, pages);
}

// ─── SECTION HELPERS ─────────────────────────────────────────────────────────

export function addSection(pageId: string, type: SectionType): PageSection | null {
  const page = getPage(pageId);
  if (!page) return null;
  const now = new Date().toISOString();
  const section: PageSection = {
    id: uid(),
    type,
    label: SECTION_TEMPLATES[type].label,
    order: page.sections.length,
    visible: true,
    fields: buildFields(type),
    createdAt: now,
    updatedAt: now,
  };
  page.sections.push(section);
  page.updatedAt = now;
  savePage(page);
  return section;
}

export function removeSection(pageId: string, sectionId: string): void {
  const page = getPage(pageId);
  if (!page) return;
  page.sections = page.sections.filter((s) => s.id !== sectionId);
  page.sections.forEach((s, i) => { s.order = i; });
  page.updatedAt = new Date().toISOString();
  savePage(page);
}

export function duplicateSection(pageId: string, sectionId: string): PageSection | null {
  const page = getPage(pageId);
  if (!page) return null;
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) return null;
  const now = new Date().toISOString();
  const dupe: PageSection = {
    ...JSON.parse(JSON.stringify(section)),
    id: uid(),
    label: `${section.label} (Copy)`,
    order: page.sections.length,
    createdAt: now,
    updatedAt: now,
  };
  page.sections.push(dupe);
  page.updatedAt = now;
  savePage(page);
  return dupe;
}

export function reorderSections(pageId: string, orderedIds: string[]): void {
  const page = getPage(pageId);
  if (!page) return;
  const map = new Map(page.sections.map((s) => [s.id, s]));
  page.sections = orderedIds.map((id, i) => {
    const s = map.get(id)!;
    s.order = i;
    return s;
  }).filter(Boolean);
  page.updatedAt = new Date().toISOString();
  savePage(page);
}

export function updateSectionField(pageId: string, sectionId: string, fieldKey: string, value: string): void {
  const page = getPage(pageId);
  if (!page) return;
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) return;
  const field = section.fields.find((f) => f.key === fieldKey);
  if (field) field.value = value;
  section.updatedAt = new Date().toISOString();
  page.updatedAt = section.updatedAt;
  savePage(page);
}

export function toggleSectionVisibility(pageId: string, sectionId: string): void {
  const page = getPage(pageId);
  if (!page) return;
  const section = page.sections.find((s) => s.id === sectionId);
  if (!section) return;
  section.visible = !section.visible;
  section.updatedAt = new Date().toISOString();
  page.updatedAt = section.updatedAt;
  savePage(page);
}

// ─── VERSIONS / DRAFTS ──────────────────────────────────────────────────────

export function saveVersion(pageId: string, userName: string, note?: string): void {
  const page = getPage(pageId);
  if (!page) return;
  const versions = load<PageVersion[]>(KEYS.versions, []);
  versions.push({
    id: uid(),
    pageId,
    sections: JSON.parse(JSON.stringify(page.sections)),
    status: page.status,
    savedBy: userName,
    savedAt: new Date().toISOString(),
    note,
  });
  // Keep last 30 versions per page
  const pageVersions = versions.filter((v) => v.pageId === pageId);
  if (pageVersions.length > 30) {
    const toRemove = pageVersions.slice(0, pageVersions.length - 30).map((v) => v.id);
    const filtered = versions.filter((v) => !toRemove.includes(v.id));
    save(KEYS.versions, filtered);
  } else {
    save(KEYS.versions, versions);
  }
}

export function getVersions(pageId: string): PageVersion[] {
  return load<PageVersion[]>(KEYS.versions, []).filter((v) => v.pageId === pageId).sort((a, b) => b.savedAt.localeCompare(a.savedAt));
}

export function restoreVersion(pageId: string, versionId: string): void {
  const versions = load<PageVersion[]>(KEYS.versions, []);
  const version = versions.find((v) => v.id === versionId);
  if (!version) return;
  const page = getPage(pageId);
  if (!page) return;
  page.sections = JSON.parse(JSON.stringify(version.sections));
  page.updatedAt = new Date().toISOString();
  savePage(page);
}

export function publishPage(pageId: string, userName: string): void {
  const page = getPage(pageId);
  if (!page) return;
  saveVersion(pageId, userName, "Published");
  page.status = "published";
  page.publishedAt = new Date().toISOString();
  page.updatedAt = page.publishedAt;
  savePage(page);
}

// ─── AUDIT LOGS ──────────────────────────────────────────────────────────────

export function addAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  const logs = load<AuditLogEntry[]>(KEYS.auditLogs, []);
  logs.push({ ...entry, id: uid(), timestamp: new Date().toISOString() });
  // Keep last 500
  if (logs.length > 500) logs.splice(0, logs.length - 500);
  save(KEYS.auditLogs, logs);
}

export function getAuditLogs(pageId?: string): AuditLogEntry[] {
  const logs = load<AuditLogEntry[]>(KEYS.auditLogs, []);
  if (pageId) return logs.filter((l) => l.pageId === pageId).sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return logs.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

// ─── MEDIA LIBRARY ───────────────────────────────────────────────────────────

export function getMedia(): MediaItem[] {
  return load<MediaItem[]>(KEYS.media, []);
}

export function addMedia(item: Omit<MediaItem, "id" | "uploadedAt">): MediaItem {
  const media = getMedia();
  const full: MediaItem = { ...item, id: uid(), uploadedAt: new Date().toISOString() };
  media.push(full);
  save(KEYS.media, media);
  return full;
}

export function deleteMedia(id: string): void {
  save(KEYS.media, getMedia().filter((m) => m.id !== id));
}

// ─── PERMISSION CHECK ────────────────────────────────────────────────────────

export type BuilderPermission = "edit" | "save_draft" | "publish" | "suggest";

export function getBuilderPermissions(role: string): BuilderPermission[] {
  switch (role) {
    case "super_admin": return ["edit", "save_draft", "publish", "suggest"];
    case "admin": return ["edit", "save_draft", "suggest"];
    case "trainer": return ["suggest"];
    case "org_partner": return ["suggest"];
    default: return [];
  }
}
