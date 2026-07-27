import { requireSupabase } from "../../shared/supabase/client";
import type { CreateReportInput } from "./types";

export async function createReport(input: CreateReportInput) {
  const { error } = await requireSupabase().from("reports").insert(input);
  if (error) throw error;
}
