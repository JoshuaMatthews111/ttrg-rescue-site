// ═══════════════════════════════════════════════════════════════════════════════
// Supabase Data Store — async functions that talk to Supabase
// Falls back gracefully if Supabase is unavailable
// ═══════════════════════════════════════════════════════════════════════════════
import { supabase } from "./supabase";
import type {
  AdminDog, AdminUser, Submission, ContactMessage,
  FosterApplication, SponsorInterest, TickerItem, Donation,
  SiteSettings, DogStatus, UserRole,
} from "./admin-store";

// ─── Helper: convert snake_case DB row → camelCase AdminDog ───
function rowToDog(r: Record<string, unknown>): AdminDog {
  return {
    id: r.id as string,
    name: r.name as string,
    age: r.age as string,
    breed: r.breed as string,
    gender: r.gender as string,
    weight: r.weight as string,
    price: Number(r.price) || 35,
    story: r.story as string,
    fullStory: (r.full_story as string) || "",
    image: r.image as string,
    gallery: (r.gallery as string[]) || [],
    urgent: r.urgent as boolean,
    stage: r.stage as AdminDog["stage"],
    stageColor: (r.stage_color as string) || "bg-red-500",
    medicalNeeds: (r.medical_needs as string) || "",
    trainingNeeds: (r.training_needs as string) || "",
    behaviorNotes: (r.behavior_notes as string) || "",
    specialNeeds: (r.special_needs as string) || "",
    location: (r.location as string) || "",
    status: r.status as DogStatus,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
    publishedAt: r.published_at as string | undefined,
    createdBy: (r.created_by as string) || "Admin",
    // Extended journey fields
    rescueDate: (r.rescue_date as string) || "",
    daysInRescue: Number(r.days_in_rescue) || 0,
    currentJourneyStage: (r.current_journey_stage as string) || "rescue",
    journeyDates: (r.journey_dates as Record<string, string>) || {},
    progressPercent: Number(r.progress_percent) || 0,
    currentStageLabel: (r.current_stage_label as string) || "",
    statusBadges: (r.status_badges as string[]) || [],
    milestones: (r.milestones as unknown[]) || [],
    currentNeeds: (r.current_needs as unknown[]) || [],
    careTeam: (r.care_team as string) || "",
    lastUpdate: (r.last_update as string) || "",
    adminNote: (r.admin_note as string) || "",
    sponsorStatus: (r.sponsor_status as string) || "none",
  } as AdminDog;
}

// ─── Helper: convert camelCase AdminDog → snake_case DB row ───
function dogToRow(d: AdminDog): Record<string, unknown> {
  return {
    id: d.id,
    name: d.name,
    age: d.age,
    breed: d.breed,
    gender: d.gender,
    weight: d.weight,
    price: d.price,
    story: d.story,
    full_story: d.fullStory,
    image: d.image,
    gallery: d.gallery,
    urgent: d.urgent,
    stage: d.stage,
    stage_color: d.stageColor,
    medical_needs: d.medicalNeeds || "",
    training_needs: d.trainingNeeds || "",
    behavior_notes: d.behaviorNotes || "",
    special_needs: d.specialNeeds || "",
    location: d.location,
    status: d.status,
    created_at: d.createdAt,
    updated_at: new Date().toISOString(),
    published_at: d.publishedAt || null,
    created_by: d.createdBy,
    // Extended fields
    rescue_date: (d as unknown as Record<string, unknown>).rescueDate || "",
    days_in_rescue: (d as unknown as Record<string, unknown>).daysInRescue || 0,
    current_journey_stage: (d as unknown as Record<string, unknown>).currentJourneyStage || "rescue",
    journey_dates: (d as unknown as Record<string, unknown>).journeyDates || {},
    progress_percent: (d as unknown as Record<string, unknown>).progressPercent || 0,
    current_stage_label: (d as unknown as Record<string, unknown>).currentStageLabel || "",
    status_badges: (d as unknown as Record<string, unknown>).statusBadges || [],
    milestones: (d as unknown as Record<string, unknown>).milestones || [],
    current_needs: (d as unknown as Record<string, unknown>).currentNeeds || [],
    care_team: (d as unknown as Record<string, unknown>).careTeam || "",
    last_update: (d as unknown as Record<string, unknown>).lastUpdate || "",
    admin_note: (d as unknown as Record<string, unknown>).adminNote || "",
    sponsor_status: (d as unknown as Record<string, unknown>).sponsorStatus || "none",
  };
}

// ═══════════════════════════════════════════════════════════════
// DOGS
// ═══════════════════════════════════════════════════════════════
export async function fetchDogs(): Promise<AdminDog[]> {
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("fetchDogs error:", error.message); return []; }
  return (data || []).map(rowToDog);
}

export async function fetchPublishedDogs(): Promise<AdminDog[]> {
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .in("status", ["published", "urgent"])
    .order("created_at", { ascending: false });
  if (error) { console.error("fetchPublishedDogs error:", error.message); return []; }
  return (data || []).map(rowToDog);
}

export async function fetchDogById(id: string): Promise<AdminDog | null> {
  const { data, error } = await supabase
    .from("dogs")
    .select("*")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return rowToDog(data);
}

export async function upsertDog(dog: AdminDog): Promise<void> {
  const row = dogToRow(dog);
  const { error } = await supabase.from("dogs").upsert(row, { onConflict: "id" });
  if (error) console.error("upsertDog error:", error.message);
}

export async function deleteDog(id: string): Promise<void> {
  const { error } = await supabase.from("dogs").delete().eq("id", id);
  if (error) console.error("deleteDog error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// AUTH — check admin_users table
// ═══════════════════════════════════════════════════════════════
export async function authenticateUser(email: string, password: string): Promise<{ success: boolean; name: string; role: UserRole; id: string } | null> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("*")
    .eq("email", email)
    .eq("password_hash", password)
    .eq("status", "active")
    .single();
  if (error || !data) return null;
  // Update last_login
  await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", data.id);
  return { success: true, name: data.name, role: data.role as UserRole, id: data.id };
}

// ═══════════════════════════════════════════════════════════════
// ADMIN USERS
// ═══════════════════════════════════════════════════════════════
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: true });
  if (error) { console.error("fetchAdminUsers error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, name: r.name, email: r.email,
    role: r.role as UserRole, status: r.status,
    dateInvited: r.date_invited, lastLogin: r.last_login,
    assignedDogs: r.assigned_dogs || 0, avatarUrl: r.avatar_url || "",
  })) as AdminUser[];
}

export async function upsertUser(user: AdminUser): Promise<void> {
  const { error } = await supabase.from("admin_users").upsert({
    id: user.id, name: user.name, email: user.email,
    role: user.role, status: user.status,
    date_invited: user.dateInvited, assigned_dogs: user.assignedDogs,
  }, { onConflict: "id" });
  if (error) console.error("upsertUser error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// SUBMISSIONS
// ═══════════════════════════════════════════════════════════════
export async function fetchSubmissions(): Promise<Submission[]> {
  const { data, error } = await supabase.from("submissions").select("*").order("date", { ascending: false });
  if (error) { console.error("fetchSubmissions error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, dogName: r.dog_name, breed: r.breed, age: r.age,
    gender: r.gender, weight: r.weight, location: r.location,
    story: r.story, reasonForSubmission: r.reason_for_submission,
    medicalNeeds: r.medical_needs, trainingNeeds: r.training_needs,
    behaviorNotes: r.behavior_notes, urgency: r.urgency,
    submitterName: r.submitter_name, submitterEmail: r.submitter_email,
    submitterPhone: r.submitter_phone, submitterType: r.submitter_type,
    organization: r.organization, livingSituation: r.living_situation,
    videoLink: r.video_link, status: r.status, date: r.date,
    actionBy: r.action_by, consent: r.consent,
  })) as Submission[];
}

export async function insertSubmission(sub: Submission): Promise<void> {
  const { error } = await supabase.from("submissions").insert({
    id: sub.id, dog_name: sub.dogName, breed: sub.breed, age: sub.age,
    gender: sub.gender, weight: sub.weight, location: sub.location,
    story: sub.story, reason_for_submission: sub.reasonForSubmission,
    medical_needs: sub.medicalNeeds, training_needs: sub.trainingNeeds,
    behavior_notes: sub.behaviorNotes, urgency: sub.urgency,
    submitter_name: sub.submitterName, submitter_email: sub.submitterEmail,
    submitter_phone: sub.submitterPhone, submitter_type: sub.submitterType,
    organization: sub.organization, living_situation: sub.livingSituation,
    video_link: sub.videoLink, status: sub.status, date: sub.date,
    action_by: sub.actionBy, consent: sub.consent,
  });
  if (error) console.error("insertSubmission error:", error.message);
}

export async function updateSubmissionStatus(id: string, status: string, actionBy: string): Promise<void> {
  const { error } = await supabase.from("submissions").update({ status, action_by: actionBy }).eq("id", id);
  if (error) console.error("updateSubmissionStatus error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// CONTACT MESSAGES
// ═══════════════════════════════════════════════════════════════
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase.from("contact_messages").select("*").order("date", { ascending: false });
  if (error) { console.error("fetchContactMessages error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, name: r.name, email: r.email, phone: r.phone,
    subject: r.subject, message: r.message, date: r.date, read: r.read,
  })) as ContactMessage[];
}

export async function insertContactMessage(msg: ContactMessage): Promise<void> {
  const { error } = await supabase.from("contact_messages").insert({
    id: msg.id, name: msg.name, email: msg.email, phone: msg.phone,
    subject: msg.subject, message: msg.message, date: msg.date, read: msg.read,
  });
  if (error) console.error("insertContactMessage error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// FOSTER APPLICATIONS
// ═══════════════════════════════════════════════════════════════
export async function fetchFosterApplications(): Promise<FosterApplication[]> {
  const { data, error } = await supabase.from("foster_applications").select("*").order("date", { ascending: false });
  if (error) { console.error("fetchFosterApplications error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, firstName: r.first_name, lastName: r.last_name,
    email: r.email, phone: r.phone, cityState: r.city_state,
    housingType: r.housing_type, rentOrOwn: r.rent_or_own,
    currentPets: r.current_pets, dogExperience: r.dog_experience,
    childrenInHome: r.children_in_home, preferredSize: r.preferred_size,
    availability: r.availability, reason: r.reason, consent: r.consent,
    status: r.status, date: r.date, actionBy: r.action_by,
  })) as FosterApplication[];
}

export async function insertFosterApplication(app: FosterApplication): Promise<void> {
  const { error } = await supabase.from("foster_applications").insert({
    id: app.id, first_name: app.firstName, last_name: app.lastName,
    email: app.email, phone: app.phone, city_state: app.cityState,
    housing_type: app.housingType, rent_or_own: app.rentOrOwn,
    current_pets: app.currentPets, dog_experience: app.dogExperience,
    children_in_home: app.childrenInHome, preferred_size: app.preferredSize,
    availability: app.availability, reason: app.reason, consent: app.consent,
    status: app.status, date: app.date, action_by: app.actionBy,
  });
  if (error) console.error("insertFosterApplication error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// SPONSOR INTERESTS
// ═══════════════════════════════════════════════════════════════
export async function fetchSponsorInterests(): Promise<SponsorInterest[]> {
  const { data, error } = await supabase.from("sponsor_interests").select("*").order("date", { ascending: false });
  if (error) { console.error("fetchSponsorInterests error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, dogId: r.dog_id, dogName: r.dog_name,
    name: r.name, email: r.email, phone: r.phone,
    amount: r.amount, frequency: r.frequency,
    date: r.date, status: r.status,
  })) as SponsorInterest[];
}

export async function insertSponsorInterest(interest: SponsorInterest): Promise<void> {
  const { error } = await supabase.from("sponsor_interests").insert({
    id: interest.id, dog_id: interest.dogId, dog_name: interest.dogName,
    name: interest.name, email: interest.email, phone: interest.phone,
    amount: interest.amount, frequency: interest.frequency,
    date: interest.date, status: interest.status,
  });
  if (error) console.error("insertSponsorInterest error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// TICKER ITEMS
// ═══════════════════════════════════════════════════════════════
export async function fetchTickerItems(): Promise<TickerItem[]> {
  const { data, error } = await supabase.from("ticker_items").select("*").order("created_at", { ascending: false });
  if (error) { console.error("fetchTickerItems error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, text: r.text, active: r.active,
    createdAt: r.created_at, type: r.type,
  })) as TickerItem[];
}

export async function saveTickerItemsDB(items: TickerItem[]): Promise<void> {
  // Delete all then re-insert (simple approach for small dataset)
  await supabase.from("ticker_items").delete().neq("id", "");
  if (items.length === 0) return;
  const rows = items.map((t) => ({
    id: t.id, text: t.text, active: t.active,
    created_at: t.createdAt, type: t.type,
  }));
  const { error } = await supabase.from("ticker_items").insert(rows);
  if (error) console.error("saveTickerItemsDB error:", error.message);
}

export async function insertTickerItem(item: TickerItem): Promise<void> {
  const { error } = await supabase.from("ticker_items").insert({
    id: item.id, text: item.text, active: item.active,
    created_at: item.createdAt, type: item.type,
  });
  if (error) console.error("insertTickerItem error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// DONATIONS
// ═══════════════════════════════════════════════════════════════
export async function fetchDonations(): Promise<Donation[]> {
  const { data, error } = await supabase.from("donations").select("*").order("date", { ascending: false });
  if (error) { console.error("fetchDonations error:", error.message); return []; }
  return (data || []).map((r) => ({
    id: r.id, name: r.name, email: r.email,
    amount: r.amount, frequency: r.frequency,
    dogName: r.dog_name, date: r.date,
    status: r.status, last4: r.last4,
  })) as Donation[];
}

export async function insertDonation(donation: Donation): Promise<void> {
  const { error } = await supabase.from("donations").insert({
    id: donation.id, name: donation.name, email: donation.email,
    amount: donation.amount, frequency: donation.frequency,
    dog_name: donation.dogName, date: donation.date,
    status: donation.status, last4: donation.last4,
  });
  if (error) console.error("insertDonation error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS
// ═══════════════════════════════════════════════════════════════
export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).single();
  if (error || !data) return null;
  return {
    heroHeadlines: data.hero_headlines || [],
    heroSubtitles: data.hero_subtitles || [],
    tickerSpeed: data.ticker_speed || 30,
    announcementBar: data.announcement_bar || "",
    announcementActive: data.announcement_active || false,
  };
}

export async function saveSiteSettingsDB(settings: SiteSettings): Promise<void> {
  const { error } = await supabase.from("site_settings").update({
    hero_headlines: settings.heroHeadlines,
    hero_subtitles: settings.heroSubtitles,
    ticker_speed: settings.tickerSpeed,
    announcement_bar: settings.announcementBar,
    announcement_active: settings.announcementActive,
  }).eq("id", 1);
  if (error) console.error("saveSiteSettingsDB error:", error.message);
}

// ═══════════════════════════════════════════════════════════════
// AUDIT LOGS
// ═══════════════════════════════════════════════════════════════
export async function insertAuditLog(log: {
  userName: string; userRole: string; action: string;
  entityType: string; entityId: string; entityName: string;
  details?: Record<string, unknown>;
}): Promise<void> {
  const { error } = await supabase.from("audit_logs").insert({
    user_name: log.userName, user_role: log.userRole,
    action: log.action, entity_type: log.entityType,
    entity_id: log.entityId, entity_name: log.entityName,
    details: log.details || {},
  });
  if (error) console.error("insertAuditLog error:", error.message);
}

export async function fetchAuditLogs(limit = 50): Promise<Record<string, unknown>[]> {
  const { data, error } = await supabase
    .from("audit_logs").select("*")
    .order("timestamp", { ascending: false }).limit(limit);
  if (error) return [];
  return data || [];
}

// ═══════════════════════════════════════════════════════════════
// MEDIA / STORAGE
// ═══════════════════════════════════════════════════════════════
export async function uploadFile(
  bucket: string, path: string, file: File
): Promise<string | null> {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600", upsert: true,
  });
  if (error) { console.error("uploadFile error:", error.message); return null; }
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(path);
  return urlData.publicUrl;
}

export async function deleteFile(bucket: string, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error("deleteFile error:", error.message);
}

export async function listFiles(bucket: string, folder?: string): Promise<{ name: string; url: string }[]> {
  const { data, error } = await supabase.storage.from(bucket).list(folder || "", { limit: 100 });
  if (error || !data) return [];
  return data
    .filter((f) => f.name !== ".emptyFolderPlaceholder")
    .map((f) => {
      const fullPath = folder ? `${folder}/${f.name}` : f.name;
      const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(fullPath);
      return { name: f.name, url: urlData.publicUrl };
    });
}

// ═══════════════════════════════════════════════════════════════
// REAL-TIME SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════════
export function subscribeToDogs(callback: (dogs: AdminDog[]) => void) {
  const channel = supabase
    .channel("dogs-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "dogs" }, async () => {
      const dogs = await fetchPublishedDogs();
      callback(dogs);
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}

export function subscribeToTable(table: string, callback: () => void) {
  const channel = supabase
    .channel(`${table}-changes`)
    .on("postgres_changes", { event: "*", schema: "public", table }, () => {
      callback();
    })
    .subscribe();
  return () => { supabase.removeChannel(channel); };
}
