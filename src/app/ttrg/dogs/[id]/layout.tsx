import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { getDogById } from "@/lib/dogs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase.from("dogs").select("name, breed, story, image, full_story").eq("id", id).single();
  const staticDog = data ? undefined : getDogById(id);

  const name = data?.name || staticDog?.name;
  const description = data?.story || data?.full_story || staticDog?.story || (name ? `Meet ${name} at Team Trainers Rescue Group. Support their journey today.` : "Every dog deserves a second chance. Meet the dogs we're rescuing, training, and rehoming — and help write their happy ending.");
  const image = data?.image || staticDog?.image || "/ttrg/ttrg-logo-circle.png";

  const title = name ? `Help Us Save ${name} — Team Trainers Rescue Group` : "Help Us Save a Rescue Dog — Team Trainers Rescue Group";
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: name || "Team Trainers Rescue Group" }],
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

export default function DogProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
