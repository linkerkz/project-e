import { requireSupabase } from "../../shared/supabase/client";
import type { City } from "./types";

export async function listCities() {
  const { data, error } = await requireSupabase()
    .from("cities")
    .select("*")
    .eq("is_active", true)
    .order("sort", { ascending: true });
  if (error) throw error;
  return (data ?? []) as City[];
}
