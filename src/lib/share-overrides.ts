// Per-campaign share customization for DOGS (families store shareTitle/
// shareImage natively in their cloud JSON). The Supabase dogs table can't
// grow new columns from here, so overrides live in a small JSON map in the
// public storage bucket, keyed by dog id:
//   { "dog-abc123": { "title": "Fund Buddy's Training", "image": "https://…" } }
// Written by the admin dogs panel, read by the dog OG layout (server) and
// the dog profile share button (client).

import { uploadFile } from "./supabase-store";

export interface ShareOverride {
  title?: string;
  image?: string;
}

const CLOUD_PATH = "site-data/share-overrides.json";

export function shareOverridesCloudUrl(): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/${CLOUD_PATH}`;
}

export async function fetchShareOverrides(): Promise<Record<string, ShareOverride>> {
  try {
    const res = await fetch(`${shareOverridesCloudUrl()}?t=${Date.now()}`, { cache: "no-store" });
    if (res.ok) {
      const map = await res.json();
      if (map && typeof map === "object" && !Array.isArray(map)) return map;
    }
  } catch { /* not created yet or offline */ }
  return {};
}

export async function saveShareOverride(key: string, override: ShareOverride): Promise<boolean> {
  const map = await fetchShareOverrides();
  const cleaned: ShareOverride = {};
  if (override.title?.trim()) cleaned.title = override.title.trim();
  if (override.image?.trim()) cleaned.image = override.image.trim();
  if (Object.keys(cleaned).length === 0) delete map[key];
  else map[key] = cleaned;
  const file = new File([JSON.stringify(map)], "share-overrides.json", { type: "application/json" });
  const url = await uploadFile("media", CLOUD_PATH, file);
  return !!url;
}
