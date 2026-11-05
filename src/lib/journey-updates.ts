// Follow-up video updates for dogs already in a campaign.
//
// Each update shows in two places, both wired to the same campaign:
//   1. A "Follow-Up Updates" section on the dog's own profile page
//   2. The "Follow-Up Updates" row on /ttrg/journeys, with a Donate button
//      and a link back to the profile
//
// `dogName` must match the campaign name exactly — donations are filed by
// dog_name, so a different spelling sends gifts to an orphaned campaign.

export interface JourneyUpdate {
  id: string;
  dogName: string;
  /** Family-profile slug the update belongs to (make-training-affordable/<slug>). */
  profileSlug: string;
  familyName?: string;
  title: string;
  /** ISO date (YYYY-MM-DD) the update was posted. */
  date: string;
  videoUrl: string;
  summary: string;
}

export const journeyUpdates: JourneyUpdate[] = [
  {
    id: "draco-progress-2026-11",
    dogName: "Draco",
    profileSlug: "the-goodner-family-draco",
    familyName: "The Goodner Family",
    title: "Draco's Progress",
    date: "2026-11-05",
    videoUrl: "https://youtu.be/FvCcmkEgGAA",
    summary:
      "A follow-up from the training floor: see how far Draco has come with Team Trainers Rescue Group. Every gift keeps his training going and helps the Goodner family keep him home.",
  },
];

export function profileHref(u: JourneyUpdate): string {
  return `/ttrg/make-training-affordable/${u.profileSlug}`;
}

export function donateHref(u: JourneyUpdate): string {
  const family = u.familyName ? `&family=${encodeURIComponent(u.familyName)}` : "";
  return `/ttrg/donate?ttrgDog=${encodeURIComponent(u.dogName)}${family}`;
}

/** Updates for one profile, newest first. Matches the slug or the dog's name. */
export function updatesForProfile(slug: string, dogName?: string): JourneyUpdate[] {
  return journeyUpdates
    .filter(u => u.profileSlug === slug || (!!dogName && u.dogName.toLowerCase() === dogName.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function formatUpdateDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}
