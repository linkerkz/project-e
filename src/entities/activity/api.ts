import { requireSupabase } from "../../shared/supabase/client";
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from "./types";

export async function listActivities() {
  const nowIso = new Date().toISOString();
  const { data, error } = await requireSupabase()
    .from("activities")
    .select("*")
    .eq("status", "active")
    .gte("starts_at", nowIso)
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
