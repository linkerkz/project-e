import { requireSupabase } from "../../shared/supabase/client";
import type { CreateParticipantInput, Participant } from "./types";

export async function listParticipants(activityId: string) {
  const { data, error } = await requireSupabase()
    .from("participants")
    .select("*")
    .eq("activity_id", activityId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Participant[];
}

export async function createParticipant(input: CreateParticipantInput) {
  const { data, error } = await requireSupabase()
    .from("participants")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Participant;
}
