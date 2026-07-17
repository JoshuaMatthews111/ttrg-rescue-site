import type { Metadata } from "next";
import { getFamilyProfileBySlug, familyProfilesCloudUrl, type FamilyProfile } from "@/lib/admin-store";
import { familyStageTitle } from "@/lib/share-messages";

// Mirrors effectiveStage() on the profile page: explicit stage wins,
// otherwise derive from campaign status.
function stageOf(p: FamilyProfile): number {
  if (p.currentStage && p.currentStage >= 1 && p.currentStage <= 5) return p.currentStage;
  if (p.status === "completed") return 5;
  if (p.status === "funded" || (p.goalAmount > 0 && p.raisedAmount >= p.goalAmount)) return 4;
  if (p.status === "published") return 4;
  return 3;
}

// Family profiles have no Supabase table — the shared source of truth is a
// JSON file in public storage, uploaded by the admin panel on every save.
// Read it here so link previews (iMessage/WhatsApp/Facebook) always see the
// same data visitors do, including newly created campaigns.
async function findProfile(slug: string): Promise<FamilyProfile | undefined> {
  try {
    const res = await fetch(`${familyProfilesCloudUrl()}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const profiles = (await res.json()) as FamilyProfile[];
      const match = Array.isArray(profiles) ? profiles.find(p => p.slug === slug) : undefined;
      if (match) return match;
    }
  } catch { /* storage unreachable — fall back to bundled demo data */ }
  return getFamilyProfileBySlug(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = await findProfile(slug);

  const title = p
    ? `${p.shareTitle || familyStageTitle(p.dogName, p.familyName, stageOf(p))} — TTRG`
    : "Help a Family Keep Their Dog — Team Trainers Rescue Group";
  const description = p?.shortSummary || p?.story?.slice(0, 160) || "When training costs would force a family to give up their dog, we step in. Read their story and help keep this family together.";
  const image = p?.shareImage || p?.image || "/ttrg/ttrg-logo-circle.png";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function FamilyProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
