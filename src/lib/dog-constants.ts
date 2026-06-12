// Constants for dog profile fields
// Import type for AdminDog (used at end of file)
import type { AdminDog } from "./admin-store";

export const BREED_OPTIONS = [
  "Labrador Retriever",
  "Yellow Lab",
  "Golden Retriever",
  "German Shepherd",
  "Husky",
  "Husky Mix",
  "Pit Bull Terrier",
  "American Bully",
  "Boxer",
  "Rottweiler",
  "Doberman Pinscher",
  "Great Dane",
  "Mastiff",
  "Cane Corso",
  "Belgian Malinois",
  "Border Collie",
  "Australian Shepherd",
  "Cattle Dog / Blue Heeler",
  "Beagle",
  "Hound Mix",
  "Pointer",
  "Setter",
  "Terrier Mix",
  "Chihuahua",
  "Dachshund",
  "Poodle",
  "Doodle Mix",
  "Shih Tzu",
  "Maltese",
  "Yorkie",
  "French Bulldog",
  "English Bulldog",
  "Cocker Spaniel",
  "Springer Spaniel",
  "Akita",
  "Chow Chow",
  "Shar Pei",
  "Mixed Breed",
  "Unknown",
  "Other",
] as const;

export const AGE_UNITS = ["Weeks", "Months", "Years"] as const;

export const GENDER_OPTIONS = ["Male", "Female", "Unknown"] as const;

export const SIZE_OPTIONS = ["Small", "Medium", "Large", "Extra Large"] as const;

export const DOG_STATUS_OPTIONS = [
  "New Intake",
  "In Training",
  "Medical Care",
  "Behavioral Rehabilitation",
  "Foster Needed",
  "In Foster",
  "Ready for Adoption",
  "Adoption Pending",
  "Adopted",
  "Sponsor Needed",
  "Urgent Support Needed",
] as const;

export const MEDICAL_NEEDS_OPTIONS = [
  "Routine Vet Care",
  "Wellness Check Needed",
  "Vaccinations Needed",
  "Rabies Vaccine Needed",
  "Flea/Tick Prevention",
  "Heartworm Test Needed",
  "Heartworm Treatment Needed",
  "Spay/Neuter Needed",
  "Dental Care Needed",
  "Medication Needed",
  "Surgery Needed",
  "Wound Care",
  "Skin/Fur Treatment",
  "Ear Treatment",
  "Eye Treatment",
  "Special Diet",
  "Weight Management",
  "Senior Care",
  "Mobility Support",
  "Ongoing Medical Monitoring",
  "No Major Medical Needs Known",
  "Other",
] as const;

export const TRAINING_NEEDS_OPTIONS = [
  "Basic Obedience",
  "Leash Manners",
  "Off-Leash Control",
  "Place Command",
  "Door Manners",
  "Crate Training",
  "Potty Training",
  "Recall Training",
  "Sit/Stay/Down",
  "Impulse Control",
  "Socialization",
  "Confidence Building",
  "Calm Behavior in Home",
  "Family Home Readiness",
  "Public Manners",
  "Dog-to-Dog Manners",
  "No Jumping",
  "No Pulling",
  "No Excessive Barking",
  "Separation Anxiety Support",
  "Advanced Training",
  "Training Has Improved Tremendously",
  "Continued Training Required",
  "Other",
] as const;

export const BEHAVIOR_NOTES_OPTIONS = [
  "Friendly",
  "Affectionate",
  "Playful",
  "High Energy",
  "Calm",
  "Shy at First",
  "Nervous",
  "Needs Structure",
  "Needs Experienced Handler",
  "Good with Adults",
  "Good with Children",
  "Caution Around Children",
  "Dog Friendly",
  "Dog Selective",
  "Not Yet Dog Tested",
  "Cat Friendly",
  "Not Yet Cat Tested",
  "Protective",
  "Food Motivated",
  "Learns Quickly",
  "Improving with Training",
  "Needs Continued Evaluation",
  "Other",
] as const;

export const SPECIAL_NEEDS_OPTIONS = [
  "Experienced Owner Preferred",
  "No Small Children Recommended",
  "Active Home Preferred",
  "Quiet Home Preferred",
  "Fenced Yard Preferred",
  "Only Dog Home Preferred",
  "Slow Introductions Needed",
  "Continued Training Required",
  "Medical Follow-Up Required",
  "Foster Support Needed",
  "Special Handling Instructions",
  "Long-Term Support Needed",
  "No Special Needs Known",
  "Other",
] as const;

export const RESCUE_SOURCE_OPTIONS = [
  "Owner Surrender",
  "Shelter Rescue",
  "Veterinary Clinic Referral",
  "Emergency Rescue",
  "Abandoned",
  "Stray",
  "Transferred from Another Rescue",
  "Behavioral Rehabilitation Case",
  "Medical Rescue Case",
  "Other",
] as const;

export const JOURNEY_STAGE_OPTIONS = [
  "Intake",
  "Assessment",
  "Medical Care",
  "Training",
  "Behavioral Rehabilitation",
  "Foster Placement",
  "Adoption Preparation",
  "Ready for Adoption",
  "Adopted",
  "Long-Term Support",
] as const;

export const SUPPORT_GOAL_OPTIONS = [
  "Needs Donations",
  "Needs Sponsor",
  "Needs Foster",
  "Needs Adoption",
  "Needs Medical Support",
  "Needs Training Support",
  "Fully Sponsored",
  "Other",
] as const;

// Helper to format age display
export function formatAge(number?: number, unit?: string, approximate?: boolean): string {
  if (!number || !unit) return "";
  const approx = approximate ? "Approximately " : "";
  return `${approx}${number} ${unit}`;
}

// Helper to format breed display
export function formatBreed(breedOption?: string, otherBreed?: string, legacyBreed?: string): string {
  if (breedOption && breedOption !== "Other") return breedOption;
  if (breedOption === "Other" && otherBreed) return otherBreed;
  if (legacyBreed) return legacyBreed;
  return "";
}

// Helper to check if value is empty (for hiding blank fields)
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string" && value.trim() === "") return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

// Helper to filter out empty values from arrays
export function filterEmptyStrings(arr: string[] | undefined): string[] {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.filter(item => typeof item === "string" && item.trim() !== "");
}

// Helper to check if an options array has any real selections (excluding "Other" if custom is empty)
export function hasValidSelections(options: string[] | undefined, otherValue?: string): boolean {
  if (!options || !Array.isArray(options) || options.length === 0) return false;
  const realOptions = options.filter(o => o !== "Other" || (otherValue && otherValue.trim()));
  return realOptions.length > 0;
}

// Helper to build display array for options (replaces "Other" with custom value)
export function buildDisplayOptions(options: string[] | undefined, otherValue?: string): string[] {
  if (!options || !Array.isArray(options)) return [];
  return options.map(o => {
    if (o === "Other" && otherValue?.trim()) return otherValue.trim();
    return o;
  }).filter(o => o !== "Other" || (otherValue?.trim()));
}

// Map old stage to new journey stage for compatibility
export function mapStageToJourneyStage(oldStage: string): string {
  const map: Record<string, string> = {
    rescue: "Intake",
    rehabilitate: "Training",
    train: "Training",
    recover: "Medical Care",
    rehome: "Ready for Adoption",
  };
  return map[oldStage] || "Intake";
}

// Map new journey stage to old stage for compatibility
export function mapJourneyStageToOldStage(journeyStage: string): string {
  const map: Record<string, string> = {
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
  return map[journeyStage] || "rescue";
}

// Map dog status to stage color
export function getStatusColor(dogStatus?: string): string {
  const map: Record<string, string> = {
    "New Intake": "bg-amber-500",
    "In Training": "bg-emerald-500",
    "Medical Care": "bg-blue-500",
    "Behavioral Rehabilitation": "bg-purple-500",
    "Foster Needed": "bg-orange-500",
    "In Foster": "bg-teal-500",
    "Ready for Adoption": "bg-violet-500",
    "Adoption Pending": "bg-pink-500",
    "Adopted": "bg-green-500",
    "Sponsor Needed": "bg-amber-500",
    "Urgent Support Needed": "bg-red-500",
  };
  return (dogStatus && map[dogStatus]) || "bg-slate-500";
}

// Map support goal to action buttons
export function getSupportActions(supportGoal?: string): { showSponsor: boolean; showDonate: boolean; showFoster: boolean; showAdopt: boolean } {
  const goal = supportGoal || "";
  return {
    showSponsor: goal.includes("Sponsor") || goal.includes("Donations"),
    showDonate: goal.includes("Donations") || goal.includes("Medical") || goal.includes("Training"),
    showFoster: goal.includes("Foster"),
    showAdopt: goal.includes("Adoption"),
  };
}

// Status badge colors for dog status
export const DOG_STATUS_COLORS: Record<string, string> = {
  "New Intake": "bg-amber-100 text-amber-700",
  "In Training": "bg-emerald-100 text-emerald-700",
  "Medical Care": "bg-blue-100 text-blue-700",
  "Behavioral Rehabilitation": "bg-purple-100 text-purple-700",
  "Foster Needed": "bg-orange-100 text-orange-700",
  "In Foster": "bg-teal-100 text-teal-700",
  "Ready for Adoption": "bg-violet-100 text-violet-700",
  "Adoption Pending": "bg-pink-100 text-pink-700",
  "Adopted": "bg-green-100 text-green-700",
  "Sponsor Needed": "bg-amber-100 text-amber-700",
  "Urgent Support Needed": "bg-red-100 text-red-700",
};

// Size icons (for display)
export const SIZE_ICONS: Record<string, string> = {
  "Small": "🐕",
  "Medium": "🐕‍🦺",
  "Large": "🦮",
  "Extra Large": "🐩",
};

// Gender icons
export const GENDER_ICONS: Record<string, string> = {
  "Male": "♂️",
  "Female": "♀️",
  "Unknown": "?",
};

// Get journey stage progress percentage
export function getJourneyProgress(stage?: string): number {
  const progress: Record<string, number> = {
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
  return progress[stage || ""] || 10;
}

// Journey stage labels for timeline
export const JOURNEY_STAGE_LABELS: Record<string, { num: number; label: string; key: string }> = {
  "Intake": { num: 1, label: "Rescue Intake", key: "rescue" },
  "Assessment": { num: 2, label: "Assessment", key: "assessment" },
  "Medical Care": { num: 3, label: "Medical Care", key: "medical" },
  "Training": { num: 4, label: "Training & Rehab", key: "rehab" },
  "Behavioral Rehabilitation": { num: 4, label: "Behavioral Rehab", key: "rehab" },
  "Foster Placement": { num: 5, label: "Foster Placement", key: "foster" },
  "Adoption Preparation": { num: 6, label: "Adoption Prep", key: "adopt" },
  "Ready for Adoption": { num: 6, label: "Ready for Home", key: "adopt" },
  "Adopted": { num: 7, label: "Forever Home", key: "home" },
  "Long-Term Support": { num: 7, label: "Long-Term Support", key: "home" },
};

// Timeline stages for journey display (simplified 6-stage timeline)
export const TIMELINE_STAGES = [
  { key: "rescue", label: "Rescue Intake", num: 1 },
  { key: "medical", label: "Medical Care", num: 2 },
  { key: "rehab", label: "Training & Rehab", num: 3 },
  { key: "foster", label: "Foster", num: 4 },
  { key: "adopt", label: "Adoption Ready", num: 5 },
  { key: "home", label: "Forever Home", num: 6 },
] as const;

// Map journey stage to timeline key
export function getTimelineKey(journeyStage?: string): string {
  const map: Record<string, string> = {
    "Intake": "rescue",
    "Assessment": "rescue",
    "Medical Care": "medical",
    "Training": "rehab",
    "Behavioral Rehabilitation": "rehab",
    "Foster Placement": "foster",
    "Adoption Preparation": "adopt",
    "Ready for Adoption": "adopt",
    "Adopted": "home",
    "Long-Term Support": "home",
  };
  return map[journeyStage || ""] || "rescue";
}

// Get timeline index
export function getTimelineIndex(journeyStage?: string): number {
  const key = getTimelineKey(journeyStage);
  const index = TIMELINE_STAGES.findIndex(s => s.key === key);
  return index >= 0 ? index : 0;
}

// Format date for display
export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateString;
  }
}

// Get relative time (e.g., "2 days ago")
export function getRelativeTime(dateString?: string): string {
  if (!dateString) return "Recently";
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  } catch {
    return "Recently";
  }
}

// Calculate days in rescue from rescue date
export function calculateDaysInRescue(rescueDateString?: string): number {
  if (!rescueDateString) return 0;
  try {
    const rescueDate = new Date(rescueDateString);
    const now = new Date();
    const diffMs = now.getTime() - rescueDate.getTime();
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
}

// Parse existing legacy medicalNeeds, trainingNeeds, etc. into arrays (for migration)
export function parseLegacyNeeds(legacyText: string): string[] {
  if (!legacyText) return [];
  // Split by common delimiters
  const parts = legacyText.split(/[,;•\n]+/).map(p => p.trim()).filter(p => p.length > 0);
  // Try to match against known options
  return parts;
}

// Build emotional summary from available data
export function buildEmotionalSummary(dog: {
  name?: string;
  breedOption?: string;
  otherBreed?: string;
  ageNumber?: number;
  ageUnit?: string;
  ageApproximate?: boolean;
  genderOption?: string;
  dogStatus?: string;
  rescueSource?: string;
  rescueStory?: string;
}): string {
  const { name, breedOption, otherBreed, ageNumber, ageUnit, ageApproximate, genderOption, dogStatus, rescueStory } = dog;
  const breed = formatBreed(breedOption, otherBreed, "");
  const age = formatAge(ageNumber, ageUnit, ageApproximate);

  if (rescueStory && rescueStory.trim().length > 20) {
    // Use first sentence of rescue story if available
    const firstSentence = rescueStory.split(/[.!?]+/)[0];
    if (firstSentence && firstSentence.length > 10) {
      return firstSentence.trim() + ".";
    }
  }

  // Build generic summary
  let summary = "";
  if (name) summary += `${name}`;
  if (age) summary += ` is a ${age.toLowerCase()}`;
  if (breed) summary += ` ${breed}`;
  if (genderOption && genderOption !== "Unknown") summary += ` ${genderOption.toLowerCase()}`;

  if (dogStatus) {
    const statusMap: Record<string, string> = {
      "New Intake": "who just arrived and is beginning their journey to recovery.",
      "In Training": "who is working hard in training to become their best self.",
      "Medical Care": "who is receiving the medical care they need to heal.",
      "Behavioral Rehabilitation": "who is learning to trust again through patient rehabilitation.",
      "Foster Needed": "who is searching for a loving foster home.",
      "In Foster": "who is thriving in a foster home while preparing for adoption.",
      "Ready for Adoption": "who is ready to find their forever home.",
      "Adoption Pending": "who has found a potential forever family.",
      "Adopted": "who has found their forever home.",
      "Sponsor Needed": "who needs a sponsor to support their care.",
      "Urgent Support Needed": "who needs urgent support to continue their recovery.",
    };
    summary += statusMap[dogStatus] || "who is on their journey to recovery.";
  } else {
    summary += " who is on their journey to recovery.";
  }

  return summary;
}

// Default empty dog with all new fields
export function createEmptyDog(): Omit<AdminDog, "id" | "createdAt" | "updatedAt" | "createdBy"> {
  return {
    name: "",
    age: "",
    breed: "",
    gender: "Male",
    weight: "",
    price: 35,
    story: "",
    fullStory: "",
    rescueStory: "",
    image: "",
    videoUrl: "",
    gallery: [],
    urgent: false,
    stage: "rescue",
    stageColor: "bg-red-500",
    medicalNeeds: "",
    trainingNeeds: "",
    behaviorNotes: "",
    specialNeeds: "",
    location: "Cleveland, OH",
    status: "draft",
    // New fields
    ageNumber: undefined,
    ageUnit: "Years",
    ageApproximate: false,
    breedOption: "Mixed Breed",
    otherBreed: "",
    genderOption: "Unknown",
    size: "Medium",
    dogStatus: "New Intake",
    medicalNeedsOptions: [],
    otherMedicalNeed: "",
    medicalNeedsNotes: "",
    trainingNeedsOptions: [],
    otherTrainingNeed: "",
    trainingNeedsNotes: "",
    behaviorNotesOptions: [],
    otherBehaviorNote: "",
    behaviorNotesText: "",
    specialNeedsOptions: [],
    otherSpecialNeed: "",
    specialNeedsNotes: "",
    rescueSource: "Shelter Rescue",
    otherRescueSource: "",
    journeyStage: "Intake",
    supportGoal: "Needs Donations",
    otherSupportGoal: "",
  };
}
