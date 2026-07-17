import type { Metadata } from "next";
import { createClient } from "@supabase/supabase-js";
import { getDogById } from "@/lib/dogs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { data } = await supabase.from("dogs").select("name, breed, story, image, rescue_story").eq("id", id).single();
  const staticDog = data ? undefined : getDogById(id);

  const name = data?.name || staticDog?.name || "Dog Profile";
  const description = data?.story || data?.rescue_story || staticDog?.story || `Meet ${name} at Team Trainers Rescue Group. Support their journey today.`;
  const image = data?.image || staticDog?.image || "/ttrg/ttrg-logo.png";

  return {
    title: `${name} — Team Trainers Rescue Group`,
    description,
    openGraph: {
      title: `${name} — Team Trainers Rescue Group`,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} — Team Trainers Rescue Group`,
      description,
      images: [image],
    },
  };
}

export default function DogProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
