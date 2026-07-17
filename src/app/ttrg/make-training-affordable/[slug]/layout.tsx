import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { getFamilyProfileBySlug } from "@/lib/admin-store";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { data } = await supabase
    .from("family_profiles")
    .select("family_name, dog_name, short_summary, photo_url")
    .eq("slug", slug)
    .single();

  const local = data ? undefined : getFamilyProfileBySlug(slug);

  const dogName = data?.dog_name || local?.dogName;
  const familyName = data?.family_name || local?.familyName;
  const title = dogName && familyName ? `Help ${dogName} — ${familyName}` : "Make Training Affordable";
  const description = data?.short_summary || local?.shortSummary || "Support a family and their dog through TTRG's training program.";
  const image = data?.photo_url || local?.image || "/ttrg/ttrg-logo.png";

  return {
    title: `${title} — Team Trainers Rescue Group`,
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
