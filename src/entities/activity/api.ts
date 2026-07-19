import type { CategoryKey } from "../../shared/lib/categories";
import { requireSupabase } from "../../shared/supabase/client";
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from "./types";

type Params = {
  city?: string;
  query?: string;
  categories?: CategoryKey[];
};

export async function listActivities(params: Params = {}) {
  const { city, query, categories } = params;
  const nowIso = new Date().toISOString();
  let request = requireSupabase()
    .from("activities")
    .select("*")
    .eq("status", "active")
    .gte("starts_at", nowIso);
  if (city) request = request.eq("city", city);
  if (query) request = request.ilike("title", `%${query}%`);
  if (categories?.length) request = request.in("category", categories);

  const { data, error } = await request
    .order("starts_at", { ascending: true })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as Activity[];
}

export async function getActivityBySlug(slug: string) {
  const { data, error } = await requireSupabase()
    .from("activities")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Activity | null;
}

export async function getActivityByEditToken(editToken: string) {
  const { data, error } = await requireSupabase()
    .from("activities")
    .select("*")
    .eq("edit_token", editToken)
    .maybeSingle();
  if (error) throw error;
  return data as Activity | null;
}

export async function createActivity(input: CreateActivityInput) {
  const { data, error } = await requireSupabase()
    .from("activities")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Activity;
}

export async function updateActivity(id: string, input: UpdateActivityInput) {
  const { data, error } = await requireSupabase()
    .from("activities")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Activity;
}
