// Admin data store — uses localStorage for test-mode persistence + Supabase for live persistence
// This is the single source of truth for admin-managed data

import {
  insertSubmission, insertContactMessage, insertFosterApplication,
  insertSponsorInterest, insertTickerItem, insertDonation, uploadFile,
} from "./supabase-store";

export type DogStatus = "draft" | "pending_review" | "published" | "hidden" | "adopted" | "urgent" | "archived";

// New structured field types
export type BreedOption =
  | "Labrador Retriever" | "Yellow Lab" | "Golden Retriever" | "German Shepherd"
  | "Husky" | "Husky Mix" | "Pit Bull Terrier" | "American Bully" | "Boxer"
  | "Rottweiler" | "Doberman Pinscher" | "Great Dane" | "Mastiff" | "Cane Corso"
  | "Belgian Malinois" | "Border Collie" | "Australian Shepherd" | "Cattle Dog / Blue Heeler"
  | "Beagle" | "Hound Mix" | "Pointer" | "Setter" | "Terrier Mix" | "Chihuahua"
  | "Dachshund" | "Poodle" | "Doodle Mix" | "Shih Tzu" | "Maltese" | "Yorkie"
  | "French Bulldog" | "English Bulldog" | "Cocker Spaniel" | "Springer Spaniel"
  | "Akita" | "Chow Chow" | "Shar Pei" | "Mixed Breed" | "Unknown" | "Other";

export type AgeUnit = "Weeks" | "Months" | "Years";
export type GenderOption = "Male" | "Female" | "Unknown";
export type SizeOption = "Small" | "Medium" | "Large" | "Extra Large";

export type DogStatusOption =
  | "New Intake" | "In Training" | "Medical Care" | "Behavioral Rehabilitation"
  | "Foster Needed" | "In Foster" | "Ready for Adoption" | "Adoption Pending"
  | "Adopted" | "Sponsor Needed" | "Urgent Support Needed";

export type RescueSourceOption =
  | "Owner Surrender" | "Shelter Rescue" | "Veterinary Clinic Referral"
  | "Emergency Rescue" | "Abandoned" | "Stray" | "Transferred from Another Rescue"
  | "Behavioral Rehabilitation Case" | "Medical Rescue Case" | "Other";

export type JourneyStageOption =
  | "Intake" | "Assessment" | "Medical Care" | "Training"
  | "Behavioral Rehabilitation" | "Foster Placement" | "Adoption Preparation"
  | "Ready for Adoption" | "Adopted" | "Long-Term Support";

export type SupportGoalOption =
  | "Needs Donations" | "Needs Sponsor" | "Needs Foster" | "Needs Adoption"
  | "Needs Medical Support" | "Needs Training Support" | "Fully Sponsored" | "Other";

export interface AdminDog {
  id: string;
  name: string;

  // Basic Profile (structured)
  age: string; // legacy support
  ageNumber?: number;
  ageUnit?: AgeUnit;
  ageApproximate?: boolean;

  breed: string; // legacy support
  breedOption?: BreedOption;
  otherBreed?: string;

  gender: string; // legacy support
  genderOption?: GenderOption;

  weight: string;
  size?: SizeOption;

  dogStatus?: DogStatusOption;

  price: number;
  story: string;
  fullStory: string;
  rescueStory?: string; // The emotional journey story

  image: string;
  gallery: string[];
  videoUrl?: string;
  urgent: boolean;

  // Legacy stage (mapped to journey)
  stage: "rescue" | "rehabilitate" | "train" | "recover" | "rehome";
  stageColor: string;

  // Medical Needs (structured)
  medicalNeeds: string; // legacy support
  medicalNeedsOptions?: string[];
  otherMedicalNeed?: string;
  medicalNeedsNotes?: string;

  // Training Needs (structured)
  trainingNeeds: string; // legacy support
  trainingNeedsOptions?: string[];
  otherTrainingNeed?: string;
  trainingNeedsNotes?: string;

  // Behavior Notes (structured)
  behaviorNotes: string; // legacy support
  behaviorNotesOptions?: string[];
  otherBehaviorNote?: string;
  behaviorNotesText?: string;

  // Special Needs (structured)
  specialNeeds: string; // legacy support
  specialNeedsOptions?: string[];
  otherSpecialNeed?: string;
  specialNeedsNotes?: string;

  // Rescue Journey (structured)
  rescueSource?: RescueSourceOption;
  otherRescueSource?: string;
  journeyStage?: JourneyStageOption;
  supportGoal?: SupportGoalOption;
  otherSupportGoal?: string;

  location: string;
  status: DogStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  createdBy: string;

  // Extended journey fields (for compatibility)
  rescueDate?: string;
  daysInRescue?: number;
  currentJourneyStage?: string;
  journeyDates?: Record<string, string>;
  progressPercent?: number;
  currentStageLabel?: string;
  statusBadges?: string[];
  milestones?: unknown[];
  currentNeeds?: unknown[];
  careTeam?: string;
  lastUpdate?: string;
  adminNote?: string;
  sponsorStatus?: string;
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
  { id: "t2", text: "🐾 400+ Dogs Successfully Trained & Rehabilitated", active: true, createdAt: new Date().toISOString(), type: "manual" },
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

/* ═══════ FAMILY SUPPORT PROFILES ═══════ */
export type FamilyProfileStatus = "draft" | "published" | "funded" | "completed" | "archived";

export interface FamilyProfile {
  id: string;
  slug: string;
  familyName: string;
  dogName: string;
  dogBreed: string;
  location: string;
  image: string;
  gallery: string[];
  videoUrl?: string;
  /** Journey stage 1–5: Family in Need, Situation Evaluated, Support Profile
   *  Created, Training Funds Raised, Training Completed */
  currentStage?: number;
  story: string;
  shortSummary: string;
  /** Optional custom title for link previews & shares (e.g. "Fund Drako's
   *  Training") — overrides the stage-based default wording. */
  shareTitle?: string;
  /** Optional custom thumbnail for link previews — overrides the cover image. */
  shareImage?: string;
  behaviorIssues: string;
  trainingNeeded: string;
  goalAmount: number;
  raisedAmount: number;
  donorCount: number;
  status: FamilyProfileStatus;
  urgent: boolean;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  completedAt?: string;
  testimony?: string;
}

const FAMILY_KEY = "ttrg-family-profiles";

const demoFamilyProfiles: FamilyProfile[] = [
  {
    id: "fam-demo-1",
    slug: "johnson-family-max",
    familyName: "The Johnson Family",
    dogName: "Max",
    dogBreed: "German Shepherd Mix",
    location: "Cleveland, OH",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80",
    gallery: [],
    story: "The Johnson family adopted Max two years ago, but recently Max has developed leash reactivity and resource guarding that the family cannot address on their own. With two young children at home, they are worried about safety but love Max deeply and don't want to surrender him. Professional training would cost $1,800 — far beyond what the family can afford on a single income. TTRG evaluated the situation and believes 6 weeks of structured behavior modification will resolve the issues and keep Max safely in his home.",
    shortSummary: "Max needs behavior training to stay safely with his family of four.",
    behaviorIssues: "Leash reactivity, resource guarding around food bowls",
    trainingNeeded: "6-week behavior modification program with certified trainer",
    goalAmount: 1800,
    raisedAmount: 1240,
    donorCount: 18,
    status: "published",
    urgent: true,
    featured: true,
    createdAt: "2026-06-20T10:00:00Z",
    updatedAt: "2026-07-05T14:30:00Z",
    publishedAt: "2026-06-21T08:00:00Z",
  },
  {
    id: "fam-demo-2",
    slug: "martinez-family-bella",
    familyName: "The Martinez Family",
    dogName: "Bella",
    dogBreed: "Pit Bull Terrier",
    location: "Akron, OH",
    image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&q=80",
    gallery: [],
    story: "Maria Martinez is a single mother raising three children while working two jobs. Bella has been the family's loyal companion for four years, but after a move to a new apartment, Bella has developed severe separation anxiety — barking, destructive chewing, and accidents. The landlord has given them 30 days to resolve it or Bella must go. Maria reached out to TTRG in tears. A professional desensitization and crate training program will cost $1,200. Help keep Bella home where she is loved.",
    shortSummary: "Bella's separation anxiety is threatening her family's housing — training can save her spot.",
    behaviorIssues: "Severe separation anxiety, destructive behavior, excessive barking",
    trainingNeeded: "4-week separation anxiety desensitization + crate training",
    goalAmount: 1200,
    raisedAmount: 450,
    donorCount: 8,
    status: "published",
    urgent: true,
    featured: false,
    createdAt: "2026-06-25T10:00:00Z",
    updatedAt: "2026-07-04T11:00:00Z",
    publishedAt: "2026-06-26T09:00:00Z",
  },
  {
    id: "fam-demo-3",
    slug: "williams-family-duke",
    familyName: "The Williams Family",
    dogName: "Duke",
    dogBreed: "Labrador Retriever",
    location: "Mentor, OH",
    image: "https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=600&q=80",
    gallery: [],
    story: "Retired veteran James Williams adopted Duke from a shelter to be his emotional support companion. Duke is gentle and loving indoors, but pulls dangerously on walks — James was recently injured when Duke lunged after a squirrel. James lives on a fixed income and cannot afford the leash training Duke needs. With proper loose-leash walking training and basic obedience, Duke can safely accompany James on daily walks that are crucial for both their wellbeing.",
    shortSummary: "Veteran needs help training his support dog for safe daily walks.",
    behaviorIssues: "Extreme leash pulling, lunging at distractions",
    trainingNeeded: "5-week loose-leash walking + obedience program",
    goalAmount: 950,
    raisedAmount: 950,
    donorCount: 14,
    status: "completed",
    urgent: false,
    featured: false,
    createdAt: "2026-05-15T10:00:00Z",
    updatedAt: "2026-06-28T16:00:00Z",
    publishedAt: "2026-05-16T08:00:00Z",
    completedAt: "2026-06-28T16:00:00Z",
    testimony: "Duke is a completely different dog on walks now. James says he feels safe again and they walk together every morning. Thank you to every donor who made this possible.",
  },
];

export function getFamilyProfiles(): FamilyProfile[] {
  if (typeof window === "undefined") return demoFamilyProfiles;
  const raw = localStorage.getItem(FAMILY_KEY);
  if (!raw) {
    localStorage.setItem(FAMILY_KEY, JSON.stringify(demoFamilyProfiles));
    return demoFamilyProfiles;
  }
  return JSON.parse(raw);
}

export function saveFamilyProfiles(profiles: FamilyProfile[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAMILY_KEY, JSON.stringify(profiles));
}

export function getPublishedFamilyProfiles(): FamilyProfile[] {
  return getFamilyProfiles().filter(p => p.status === "published" || p.status === "funded" || p.status === "completed");
}

export function getFamilyProfileBySlug(slug: string): FamilyProfile | undefined {
  return getFamilyProfiles().find(p => p.slug === slug);
}

export function upsertFamilyProfile(profile: FamilyProfile) {
  const profiles = getFamilyProfiles();
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) profiles[idx] = profile;
  else profiles.unshift(profile);
  saveFamilyProfiles(profiles);
  void saveFamilyProfilesToCloud();
}

export function deleteFamilyProfile(id: string) {
  saveFamilyProfiles(getFamilyProfiles().filter(p => p.id !== id));
  void saveFamilyProfilesToCloud();
}

// ── Cloud sync ──────────────────────────────────────────────────────────────
// There is no family_profiles table in Supabase; profiles used to live only
// in the admin's browser (localStorage), invisible to visitors and to link
// previews. The shared source of truth is a JSON file in the public storage
// bucket: every save uploads it, every page view syncs from it, and the OG
// metadata layout reads the same file server-side.
const FAMILY_CLOUD_PATH = "site-data/family-profiles.json";

export function familyProfilesCloudUrl(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${FAMILY_CLOUD_PATH}`;
}

export async function saveFamilyProfilesToCloud(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const file = new File([JSON.stringify(getFamilyProfiles())], "family-profiles.json", { type: "application/json" });
  const url = await uploadFile("media", FAMILY_CLOUD_PATH, file);
  return !!url;
}

export async function syncFamilyProfilesFromCloud(): Promise<FamilyProfile[]> {
  try {
    // Cache-buster: the storage CDN caches the public URL for an hour.
    const res = await fetch(`${familyProfilesCloudUrl()}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const profiles = await res.json();
      if (Array.isArray(profiles) && profiles.length > 0) {
        if (typeof window !== "undefined") localStorage.setItem(FAMILY_KEY, JSON.stringify(profiles));
        return profiles as FamilyProfile[];
      }
    }
  } catch { /* offline or file not published yet — fall back to local */ }
  return getFamilyProfiles();
}

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
