import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { getDogById } from "@/lib/dogs";
import { fetchShareOverrides } from "@/lib/share-overrides";
import { dogStageTitle } from "@/lib/share-messages";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const [{ data }, overrides] = await Promise.all([
    supabase.from("dogs").select("name, breed, story, image, full_story, stage").eq("id", id).single(),
    fetchShareOverrides(),
  ]);
  const staticDog = data ? undefined : getDogById(id);
  const override = overrides[id];

  const name = data?.name || staticDog?.name;
  const stage = data?.stage || staticDog?.stage;
  const description = data?.story || data?.full_story || staticDog?.story || (name ? `Meet ${name} at Team Trainers Rescue Group. Support their journey today.` : "Every dog deserves a second chance. Meet the dogs we're rescuing, training, and rehoming — and help write their happy ending.");
  const image = override?.image || data?.image || staticDog?.image || "/ttrg/ttrg-logo-circle.png";

  const title = override?.title
    ? `${override.title} — Team Trainers Rescue Group`
    : name ? `${dogStageTitle(name, stage)} — Team Trainers Rescue Group` : "Help Us Save a Rescue Dog — Team Trainers Rescue Group";
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
