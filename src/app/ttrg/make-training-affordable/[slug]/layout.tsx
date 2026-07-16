import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";

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

  const title = data ? `Help ${data.dog_name} — ${data.family_name}` : "Make Training Affordable";
  const description = data?.short_summary || "Support a family and their dog through TTRG's training program.";
  const image = data?.photo_url || "/ttrg/ttrg-logo.png";

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
