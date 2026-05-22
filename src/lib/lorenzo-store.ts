// Lorenzo's Dog Training Team — Admin Store
// Separate from TTRG admin store

export type LorenzoRole = "super_admin" | "admin" | "trainer" | "office_staff";

export type LeadStatus = "new" | "contacted" | "scheduled" | "won" | "lost" | "archived";

export interface ConsultationLead {
  id: string;
  name: string;
  email: string;
  phone: string;
  dogName: string;
  breed: string;
  age: string;
  behaviorIssue: string;
  trainingGoal: string;
  location: string;
  preferredContact: string;
  message: string;
  photoUrl: string;
  status: LeadStatus;
  assignedTo: string;
  notes: string;
  followUpDate: string;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
  assignedTo: string;
  notes: string;
  date: string;
}

export interface Trainer {
  id: string;
  name: string;
  photo: string;
  role: string;
  bio: string;
  specialties: string[];
  location: string;
  yearsExperience: number;
  visible: boolean;
}

export interface Testimonial {
  id: string;
  videoSrc: string;
  thumbnail: string;
  title: string;
  dogName: string;
  clientName: string;
  category: string;
  quote: string;
  visible: boolean;
  featured: boolean;
}

export interface Announcement {
  id: string;
  text: string;
  active: boolean;
  startDate: string;
  endDate: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  whoIsItFor: string;
  image: string;
  cta: string;
  order: number;
}

export interface EmailCaptureLead {
  id: string;
  email: string;
  date: string;
}

export interface LorenzoUser {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: LorenzoRole;
  status: "active" | "disabled";
  dateInvited: string;
  lastLogin: string;
}

export interface LorenzoSettings {
  phone: string;
  email: string;
  address: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  announcementEnabled: boolean;
  emailCaptureEnabled: boolean;
}

// ── Demo users ──
const DEMO_USERS: LorenzoUser[] = [
  {
    id: "u1",
    username: "lorenzo",
    password: "lorenzo",
    name: "Lorenzo Miller",
    email: "lorenzo@lorenzosdogtrainingteam.com",
    role: "super_admin",
    status: "active",
    dateInvited: "2021-01-01",
    lastLogin: "",
  },
];

// ── Default settings ──
const DEFAULT_SETTINGS: LorenzoSettings = {
  phone: "(866) 436-4959",
  email: "info@lorenzosdogtrainingteam.com",
  address: "4815 Orchard Rd, Cleveland, OH",
  socialFacebook: "https://www.facebook.com/LorenzosDogTrainingTeam",
  socialInstagram: "",
  socialYoutube: "",
  announcementEnabled: true,
  emailCaptureEnabled: true,
};

// ── Seed data ──
const SEED_TRAINERS: Trainer[] = [
  { id: "t1", name: "Lorenzo Miller", photo: "/lorenzo/trainers/lorenzo.jpg", role: "Founder & Master Trainer", bio: "Over 40 years of professional dog training experience. Lorenzo developed his own training technique after studying with numerous professional trainers.", specialties: ["Behavioral Modification", "Aggression", "Off-Leash Obedience", "Service Dog Training"], location: "Cleveland, OH", yearsExperience: 40, visible: true },
  { id: "t2", name: "Emilio", photo: "/lorenzo/trainers/emilio.jpg", role: "Master Trainer", bio: "Experienced trainer specializing in obedience and behavioral modification.", specialties: ["Basic Obedience", "Behavioral Modification", "Specialty Training"], location: "Cleveland, OH", yearsExperience: 10, visible: true },
  { id: "t3", name: "JD", photo: "/lorenzo/trainers/jd.jpg", role: "Master Trainer", bio: "Expert in working with all breeds including those with behavioral challenges.", specialties: ["Aggression", "Anxiety", "Reactivity", "Advanced Obedience"], location: "Cleveland, OH", yearsExperience: 10, visible: true },
];

const SEED_PROGRAMS: TrainingProgram[] = [
  { id: "p1", title: "Basic Obedience", description: "Develops an important line of communication and level of respect between the dog and its owner. You will learn to set rules and boundaries for your dog.", whoIsItFor: "Dogs of all ages and breeds who need foundational training, structure, and clear communication with their owners.", image: "/lorenzo/dog-training.jpg", cta: "Book Consultation", order: 1 },
  { id: "p2", title: "Behavioral Modification", description: "Designed for dogs that already have a basic understanding of obedience but are still struggling with behavioral challenges such as aggression, anxiety, reactivity, or destructive habits.", whoIsItFor: "Dogs with behavioral issues including aggression, anxiety, fear, reactivity, pulling, jumping, or destructive behavior.", image: "/lorenzo/master-trainers.jpg", cta: "Book Consultation", order: 2 },
  { id: "p3", title: "Service Dog Training", description: "Teaches a dog to assist people by performing specific tasks. Service dogs provide essential support for individuals with physical, emotional, or cognitive needs.", whoIsItFor: "Individuals who need a trained service dog for mobility assistance, emotional support, medical alerts, or other task-specific needs.", image: "/lorenzo/trainers/lorenzo-puppy.jpg", cta: "Book Consultation", order: 3 },
  { id: "p4", title: "Specialty Training", description: "Advanced training for dogs needing higher-level control, confidence, scent work, and task skills. Perfect for families, working environments, and active lifestyles.", whoIsItFor: "Dogs who have completed basic obedience and are ready for advanced off-leash obedience, scent work, alert training, or specialized skill development.", image: "/lorenzo/trainers/trainer-with-poodle.jpg", cta: "Book Consultation", order: 4 },
];

const SEED_TESTIMONIALS: Testimonial[] = [
  { id: "v1", videoSrc: "/lorenzo/videos/britta-testimonial.mp4", thumbnail: "", title: "From Reactive to Relaxed", dogName: "", clientName: "", category: "Behavioral Modification", quote: "The transformation was incredible. Our dog is a completely different companion.", visible: true, featured: true },
  { id: "v2", videoSrc: "/lorenzo/videos/testimonial-2.mp4", thumbnail: "", title: "Confidence Through Training", dogName: "", clientName: "", category: "Basic Obedience", quote: "Lorenzo's team gave us the tools to communicate with our dog effectively.", visible: true, featured: false },
];

const SEED_ANNOUNCEMENTS: Announcement[] = [
  { id: "a1", text: "Now Booking Consultations — Aggression, Anxiety, Pulling, Reactivity, Puppy Training, Off-Leash Obedience — Call (866) 436-4959 Today", active: true, startDate: "2025-01-01", endDate: "2026-12-31" },
];

// ── Persistence helpers ──
const STORE_KEY = "lorenzo_admin_store";

interface StoreData {
  leads: ConsultationLead[];
  contacts: ContactMessage[];
  trainers: Trainer[];
  testimonials: Testimonial[];
  announcements: Announcement[];
  programs: TrainingProgram[];
  emailLeads: EmailCaptureLead[];
  users: LorenzoUser[];
  settings: LorenzoSettings;
}

function loadStore(): StoreData {
  if (typeof window === "undefined") return getDefaults();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw) as StoreData;
  } catch {}
  return getDefaults();
}

function getDefaults(): StoreData {
  return {
    leads: [],
    contacts: [],
    trainers: SEED_TRAINERS,
    testimonials: SEED_TESTIMONIALS,
    announcements: SEED_ANNOUNCEMENTS,
    programs: SEED_PROGRAMS,
    emailLeads: [],
    users: DEMO_USERS,
    settings: DEFAULT_SETTINGS,
  };
}

function saveStore(data: StoreData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

// ── Auth ──
export function lorenzoAuthenticate(username: string, password: string): LorenzoUser | null {
  const store = loadStore();
  return store.users.find((u) => u.username === username && u.password === password && u.status === "active") ?? null;
}

export function lorenzoGetSession(): LorenzoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("lorenzo_session");
    if (raw) return JSON.parse(raw) as LorenzoUser;
  } catch {}
  return null;
}

export function lorenzoSetSession(user: LorenzoUser) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("lorenzo_session", JSON.stringify(user));
}

export function lorenzoClearSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("lorenzo_session");
}

// ── Leads ──
export function getLeads(): ConsultationLead[] { return loadStore().leads; }
export function addLead(lead: Omit<ConsultationLead, "id" | "date" | "status" | "assignedTo" | "notes" | "followUpDate">): ConsultationLead {
  const store = loadStore();
  const newLead: ConsultationLead = { ...lead, id: `L-${Date.now()}`, date: new Date().toISOString().split("T")[0], status: "new", assignedTo: "", notes: "", followUpDate: "" };
  store.leads.unshift(newLead);
  saveStore(store);
  return newLead;
}
export function updateLead(id: string, updates: Partial<ConsultationLead>) {
  const store = loadStore();
  const idx = store.leads.findIndex((l) => l.id === id);
  if (idx >= 0) { store.leads[idx] = { ...store.leads[idx], ...updates }; saveStore(store); }
}

// ── Contacts ──
export function getContacts(): ContactMessage[] { return loadStore().contacts; }
export function addContact(msg: Omit<ContactMessage, "id" | "date" | "read" | "assignedTo" | "notes">): ContactMessage {
  const store = loadStore();
  const newMsg: ContactMessage = { ...msg, id: `C-${Date.now()}`, date: new Date().toISOString().split("T")[0], read: false, assignedTo: "", notes: "" };
  store.contacts.unshift(newMsg);
  saveStore(store);
  return newMsg;
}

// ── Trainers ──
export function getTrainers(): Trainer[] { return loadStore().trainers; }
export function getVisibleTrainers(): Trainer[] { return loadStore().trainers.filter((t) => t.visible); }
export function upsertTrainer(trainer: Trainer) {
  const store = loadStore();
  const idx = store.trainers.findIndex((t) => t.id === trainer.id);
  if (idx >= 0) store.trainers[idx] = trainer; else store.trainers.push(trainer);
  saveStore(store);
}

// ── Testimonials ──
export function getTestimonials(): Testimonial[] { return loadStore().testimonials; }
export function getVisibleTestimonials(): Testimonial[] { return loadStore().testimonials.filter((t) => t.visible); }

// ── Announcements ──
export function getAnnouncements(): Announcement[] { return loadStore().announcements; }
export function getActiveAnnouncements(): Announcement[] {
  const now = new Date().toISOString().split("T")[0];
  return loadStore().announcements.filter((a) => a.active && a.startDate <= now && a.endDate >= now);
}
export function upsertAnnouncement(ann: Announcement) {
  const store = loadStore();
  const idx = store.announcements.findIndex((a) => a.id === ann.id);
  if (idx >= 0) store.announcements[idx] = ann; else store.announcements.push(ann);
  saveStore(store);
}

// ── Programs ──
export function getPrograms(): TrainingProgram[] { return loadStore().programs.sort((a, b) => a.order - b.order); }
export function upsertProgram(prog: TrainingProgram) {
  const store = loadStore();
  const idx = store.programs.findIndex((p) => p.id === prog.id);
  if (idx >= 0) store.programs[idx] = prog; else store.programs.push(prog);
  saveStore(store);
}

// ── Email Capture ──
export function getEmailLeads(): EmailCaptureLead[] { return loadStore().emailLeads; }
export function addEmailLead(email: string): EmailCaptureLead {
  const store = loadStore();
  const lead: EmailCaptureLead = { id: `E-${Date.now()}`, email, date: new Date().toISOString().split("T")[0] };
  store.emailLeads.unshift(lead);
  saveStore(store);
  return lead;
}

// ── Settings ──
export function getSettings(): LorenzoSettings { return loadStore().settings; }
export function saveSettings(settings: LorenzoSettings) {
  const store = loadStore();
  store.settings = settings;
  saveStore(store);
}

// ── Users ──
export function getUsers(): LorenzoUser[] { return loadStore().users; }
export function upsertUser(user: LorenzoUser) {
  const store = loadStore();
  const idx = store.users.findIndex((u) => u.id === user.id);
  if (idx >= 0) store.users[idx] = user; else store.users.push(user);
  saveStore(store);
}
