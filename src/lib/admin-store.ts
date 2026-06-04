// Admin data store — uses localStorage for test-mode persistence + Supabase for live persistence
// This is the single source of truth for admin-managed data

import {
  insertSubmission, insertContactMessage, insertFosterApplication,
  insertSponsorInterest, insertTickerItem, insertDonation,
} from "./supabase-store";

export type DogStatus = "draft" | "pending_review" | "published" | "hidden" | "adopted" | "urgent" | "archived";

export interface AdminDog {
  id: string;
  name: string;
  age: string;
  breed: string;
  gender: string;
  weight: string;
  price: number;
  story: string;
  fullStory: string;
  image: string;
  gallery: string[];
  urgent: boolean;
  stage: "rescue" | "rehabilitate" | "train" | "recover" | "rehome";
  stageColor: string;
  medicalNeeds: string;
  trainingNeeds: string;
  behaviorNotes: string;
  specialNeeds: string;
  location: string;
  status: DogStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy: string;
}

export type UserRole = "super_admin" | "admin" | "trainer" | "org_partner";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "invited" | "active" | "disabled";
  dateInvited: string;
  lastLogin?: string;
  assignedDogs: number;
}

export interface Submission {
  id: string;
  dogName: string;
  breed: string;
  age: string;
  gender: string;
  weight: string;
  location?: string;
  story: string;
  reasonForSubmission?: string;
  medicalNeeds: string;
  trainingNeeds: string;
  behaviorNotes: string;
  urgency: string;
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterType: string;
  organization: string;
  livingSituation: string;
  videoLink?: string;
  status: "pending" | "approved" | "rejected" | "more_info";
  date: string;
  actionBy: string;
  consent: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface FosterApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  cityState: string;
  housingType: string;
  rentOrOwn: string;
  currentPets: string;
  dogExperience: string;
  childrenInHome: string;
  preferredSize: string;
  availability: string;
  reason: string;
  consent: boolean;
  status: "pending" | "approved" | "rejected";
  date: string;
  actionBy: string;
}

export interface SponsorInterest {
  id: string;
  dogId: string;
  dogName: string;
  name: string;
  email: string;
  phone: string;
  amount: number;
  frequency: string;
  date: string;
  status: "new" | "contacted" | "active" | "closed";
}

// ─── AUTH ───
const DEMO_USERS = [
  { username: "ttrg", password: "ttrg", name: "TTRG Admin", role: "super_admin" as UserRole },
];

export function authenticate(username: string, password: string): { success: boolean; name: string; role: UserRole } | null {
  const user = DEMO_USERS.find((u) => u.username === username && u.password === password);
  if (user) return { success: true, name: user.name, role: user.role };
  return null;
}

export function getSession(): { name: string; role: UserRole } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("ttrg-session");
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function setSession(name: string, role: UserRole) {
  localStorage.setItem("ttrg-session", JSON.stringify({ name, role }));
}

export function clearSession() {
  localStorage.removeItem("ttrg-session");
}

// ─── GENERIC STORE HELPERS ───
function getStore<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw); } catch { return fallback; }
}

function setStore<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── DOGS ───
import { dogs as seedDogs } from "./dogs";

function seedAdminDogs(): AdminDog[] {
  return seedDogs.map((d) => ({
    ...d,
    funded: undefined as never,
    status: "published" as DogStatus,
    createdAt: "2025-01-15T00:00:00Z",
    updatedAt: new Date().toISOString(),
    publishedAt: "2025-01-15T00:00:00Z",
    createdBy: "Admin",
  }));
}

export function getAdminDogs(): AdminDog[] {
  return getStore<AdminDog>("ttrg-admin-dogs", seedAdminDogs());
}

export function saveAdminDogs(dogs: AdminDog[]) {
  setStore("ttrg-admin-dogs", dogs);
}

export function getPublishedDogs(): AdminDog[] {
  return getAdminDogs().filter((d) => d.status === "published" || d.status === "urgent");
}

export function isAdminDogsInitialized(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem("ttrg-admin-dogs") !== null;
}

export function getAdminDogById(id: string): AdminDog | undefined {
  return getAdminDogs().find((d) => d.id === id);
}

export function upsertAdminDog(dog: AdminDog) {
  const dogs = getAdminDogs();
  const idx = dogs.findIndex((d) => d.id === dog.id);
  if (idx >= 0) dogs[idx] = dog;
  else dogs.push(dog);
  saveAdminDogs(dogs);
}

export function deleteAdminDog(id: string) {
  const dogs = getAdminDogs().filter((d) => d.id !== id);
  saveAdminDogs(dogs);
}

// ─── USERS ───
const seedUsers: AdminUser[] = [
  { id: "u1", name: "Lorenzo Miller", email: "lorenzo@ttrg.org", role: "super_admin", status: "active", dateInvited: "2025-01-01", lastLogin: "Just now", assignedDogs: 6 },
  { id: "u2", name: "Admin Staff", email: "admin@ttrg.org", role: "admin", status: "active", dateInvited: "2025-01-05", lastLogin: "2 hours ago", assignedDogs: 0 },
  { id: "u3", name: "Jasmine Bland", email: "jasmine@ttrg.org", role: "trainer", status: "active", dateInvited: "2025-01-10", lastLogin: "1 hour ago", assignedDogs: 4 },
  { id: "u4", name: "Daniel Bainbridge", email: "daniel@ttrg.org", role: "trainer", status: "active", dateInvited: "2025-01-10", lastLogin: "3 hours ago", assignedDogs: 5 },
  { id: "u5", name: "Bailey Brown", email: "bailey@ttrg.org", role: "trainer", status: "active", dateInvited: "2025-02-01", lastLogin: "1 day ago", assignedDogs: 3 },
];

export function getAdminUsers(): AdminUser[] {
  return getStore<AdminUser>("ttrg-admin-users", seedUsers);
}

export function saveAdminUsers(users: AdminUser[]) {
  setStore("ttrg-admin-users", users);
}

export function upsertAdminUser(user: AdminUser) {
  const users = getAdminUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) users[idx] = user;
  else users.push(user);
  saveAdminUsers(users);
}

// ─── SUBMISSIONS ───
const seedSubmissions: Submission[] = [
  { id: "TTRG-A3F2K1", dogName: "Max", breed: "German Shepherd Mix", age: "4 yrs", gender: "Male", weight: "55 lbs", story: "Found as stray with injuries. Needs immediate medical attention.", medicalNeeds: "Injured leg, underweight", trainingNeeds: "Basic obedience", behaviorNotes: "Shy with strangers", urgency: "Critical", submitterName: "Houston Animal Shelter", submitterEmail: "shelter@houston.org", submitterPhone: "(216) 401-0100", submitterType: "Shelter / Pound", organization: "Houston Animal Shelter", livingSituation: "Shelter kennel", status: "pending", date: "2025-05-16", actionBy: "", consent: true },
  { id: "TTRG-B7D4M9", dogName: "Bella", breed: "Chihuahua", age: "6 yrs", gender: "Female", weight: "8 lbs", story: "Owner moving overseas, cannot take pet. Well-behaved, spayed.", medicalNeeds: "None", trainingNeeds: "None needed", behaviorNotes: "Calm, house-trained", urgency: "Standard", submitterName: "Jane Doe", submitterEmail: "jane@email.com", submitterPhone: "(216) 401-0200", submitterType: "Individual", organization: "", livingSituation: "Home", status: "pending", date: "2025-05-16", actionBy: "", consent: true },
  { id: "TTRG-C1E8P3", dogName: "Rocky", breed: "Rottweiler", age: "2 yrs", gender: "Male", weight: "80 lbs", story: "Overcrowded facility. Rocky is good with other dogs, needs training.", medicalNeeds: "Up to date on vaccinations", trainingNeeds: "Leash training, socialization", behaviorNotes: "High energy, good with dogs", urgency: "Urgent", submitterName: "Paws & Claws Rescue", submitterEmail: "info@pawsclaws.org", submitterPhone: "(216) 401-0300", submitterType: "Rescue Partner", organization: "Paws & Claws Rescue", livingSituation: "Rescue facility", status: "pending", date: "2025-05-15", actionBy: "", consent: true },
];

export function getSubmissions(): Submission[] {
  return getStore<Submission>("ttrg-submissions", seedSubmissions);
}

export function saveSubmissions(subs: Submission[]) {
  setStore("ttrg-submissions", subs);
}

export function addSubmission(sub: Submission) {
  const subs = getSubmissions();
  subs.unshift(sub);
  saveSubmissions(subs);
  insertSubmission(sub).catch(() => {});
}

// ─── CONTACT MESSAGES ───
export function getContactMessages(): ContactMessage[] {
  return getStore<ContactMessage>("ttrg-contacts", []);
}

export function addContactMessage(msg: ContactMessage) {
  const msgs = getContactMessages();
  msgs.unshift(msg);
  setStore("ttrg-contacts", msgs);
  insertContactMessage(msg).catch(() => {});
}

// ─── FOSTER APPLICATIONS ───
export function getFosterApplications(): FosterApplication[] {
  return getStore<FosterApplication>("ttrg-foster-apps", []);
}

export function addFosterApplication(app: FosterApplication) {
  const apps = getFosterApplications();
  apps.unshift(app);
  setStore("ttrg-foster-apps", apps);
  insertFosterApplication(app).catch(() => {});
}

// ─── SPONSOR INTERESTS ───
export function getSponsorInterests(): SponsorInterest[] {
  return getStore<SponsorInterest>("ttrg-sponsor-interests", []);
}

export function addSponsorInterest(interest: SponsorInterest) {
  const interests = getSponsorInterests();
  interests.unshift(interest);
  setStore("ttrg-sponsor-interests", interests);
  insertSponsorInterest(interest).catch(() => {});
}

// ─── SITE SETTINGS (admin-editable ticker, hero, announcements) ───
export interface TickerItem {
  id: string;
  text: string;
  active: boolean;
  createdAt: string;
  type: "manual" | "auto";
}

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  frequency: "one-time" | "monthly";
  dogName?: string;
  date: string;
  status: "completed" | "failed" | "pending";
  last4?: string;
}

export interface SiteSettings {
  heroHeadlines: string[];
  heroSubtitles: string[];
  tickerSpeed: number;
  announcementBar: string;
  announcementActive: boolean;
}

const defaultTicker: TickerItem[] = [
  { id: "t1", text: "🐾 3 Dogs Rescued This Week — Your Support Saves Lives", active: true, createdAt: new Date().toISOString(), type: "manual" },
  { id: "t2", text: "🐾 127 Dogs Successfully Trained, Rehabilitated & Rehomed", active: true, createdAt: new Date().toISOString(), type: "manual" },
  { id: "t3", text: "🐾 New Rescue Story Added — Follow Bailey's Journey", active: true, createdAt: new Date().toISOString(), type: "manual" },
  { id: "t4", text: "🐾 Thank You To Our Amazing Donors & Foster Families", active: true, createdAt: new Date().toISOString(), type: "manual" },
  { id: "t5", text: "🐾 Emergency Foster Placements Helping Dogs in Critical Need", active: true, createdAt: new Date().toISOString(), type: "manual" },
  { id: "t6", text: "🐾 Every Adoption Opens Space for the Next Dog Waiting", active: true, createdAt: new Date().toISOString(), type: "manual" },
];

const defaultSettings: SiteSettings = {
  heroHeadlines: ["Rescue.", "Train.", "Rehome.", "Repeat."],
  heroSubtitles: [
    "Every dog deserves a second chance. Join our mission to rescue, heal, and find forever homes.",
    "From shelters to forever families — we provide rescue, medical care, training, and love.",
    "Track every dog's transformation. Real stories, real impact, real results.",
    "Your donation funds medical care, professional training, and safe shelter.",
  ],
  tickerSpeed: 30,
  announcementBar: "",
  announcementActive: false,
};

export function getTickerItems(): TickerItem[] {
  return getStore<TickerItem>("ttrg-ticker", defaultTicker);
}

export function saveTickerItems(items: TickerItem[]) {
  setStore("ttrg-ticker", items);
}

export function addTickerItem(item: TickerItem) {
  const items = getTickerItems();
  items.unshift(item);
  saveTickerItems(items);
  insertTickerItem(item).catch(() => {});
}

export function getSiteSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = localStorage.getItem("ttrg-site-settings");
  if (!raw) return defaultSettings;
  try { return JSON.parse(raw); } catch { return defaultSettings; }
}

export function saveSiteSettings(settings: SiteSettings) {
  localStorage.setItem("ttrg-site-settings", JSON.stringify(settings));
}

export function getDonations(): Donation[] {
  return getStore<Donation>("ttrg-donations", []);
}

export function saveDonations(donations: Donation[]) {
  setStore("ttrg-donations", donations);
}

export function addDonation(donation: Donation) {
  const donations = getDonations();
  donations.unshift(donation);
  saveDonations(donations);
  insertDonation(donation).catch(() => {});
}

// ═══════════════════════════════════════════════════════════════════════════════
// SUPABASE ASYNC RE-EXPORTS — use these in components for real-time data
// ═══════════════════════════════════════════════════════════════════════════════
export {
  fetchDogs, fetchPublishedDogs, fetchDogById, upsertDog, deleteDog,
  authenticateUser,
  fetchAdminUsers, upsertUser,
  fetchSubmissions, insertSubmission, updateSubmissionStatus,
  fetchContactMessages, insertContactMessage,
  fetchFosterApplications, insertFosterApplication,
  fetchSponsorInterests, insertSponsorInterest,
  fetchTickerItems, saveTickerItemsDB, insertTickerItem,
  fetchDonations, insertDonation,
  fetchSiteSettings, saveSiteSettingsDB,
  insertAuditLog, fetchAuditLogs,
  uploadFile, deleteFile, listFiles,
  subscribeToDogs, subscribeToTable,
} from "./supabase-store";

// Auto-generate ticker from dog journey progress
export function generateJourneyTicker(dogName: string, fromStage: string, toStage: string): TickerItem {
  const stageLabels: Record<string, string> = {
    rescue: "Rescue", medical: "Medical Care", rehab: "Training & Rehab",
    foster: "Foster Placement", adopt: "Adoption Ready", home: "Forever Home",
  };
  return {
    id: `auto-${Date.now()}`,
    text: `🎉 ${dogName} just advanced from ${stageLabels[fromStage] || fromStage} to ${stageLabels[toStage] || toStage}!`,
    active: true,
    createdAt: new Date().toISOString(),
    type: "auto",
  };
}
