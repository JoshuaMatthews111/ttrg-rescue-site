// Browser-side template fetch. Templates are not sensitive (they contain no
// donor data and no keys), so the Message Center reads them directly.

import { supabase } from "./supabase";

export interface CommTemplate {
  id: string; name: string; audience: string; subject: string; headline: string;
  body: string; button_label: string; button_url: string; sms_text: string; media_url?: string;
}

export async function fetchTemplates(): Promise<CommTemplate[]> {
  const { data, error } = await supabase
    .from("comm_templates")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return (data || []) as CommTemplate[];
}
