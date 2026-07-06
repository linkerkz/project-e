import { requireSupabase } from "../../shared/supabase/client";
import type {
  CreateMemberInput,
  CreateSeriesInput,
  Meeting,
  MeetingMark,
  Series,
  SeriesMember,
  SeriesWithMeetings,
  UpdateSeriesInput,
  UpsertMarkInput,
} from "./types";
import { listOccurrences } from "./utils";

export async function listSeries() {
  const { data, error } = await requireSupabase()
    .from("series")
    .select("*, meetings(*)")
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as SeriesWithMeetings[];
}

export async function getSeriesBySlug(slug: string) {
  const { data, error } = await requireSupabase()
    .from("series")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data as Series | null;
}

export async function getSeriesByEditToken(editToken: string) {
  const { data, error } = await requireSupabase()
    .from("series")
    .select("*")
    .eq("edit_token", editToken)
    .maybeSingle();
  if (error) throw error;
  return data as Series | null;
}

export async function createSeries(input: CreateSeriesInput) {
  const { data, error } = await requireSupabase()
    .from("series")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as Series;
}

export async function updateSeries(id: string, input: UpdateSeriesInput) {
  const { data, error } = await requireSupabase()
    .from("series")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Series;
}

// Досоздаёт недостающие слоты до горизонта. ignoreDuplicates не трогает уже
// существующие строки — отменённые и перенесённые встречи не пересоздаются.
export async function ensureUpcomingMeetings(series: Series) {
  const slots = listOccurrences(series.recurrence, series.starts_at);
  const rows = slots.map((scheduledAt) => ({
    series_id: series.id,
    scheduled_at: scheduledAt,
    starts_at: scheduledAt,
  }));
  const { error } = await requireSupabase().from("meetings").upsert(rows, {
    onConflict: "series_id,scheduled_at",
    ignoreDuplicates: true,
  });
  if (error) throw error;
  return listMeetings(series.id);
}

export async function listMeetings(seriesId: string) {
  const { data, error } = await requireSupabase()
    .from("meetings")
    .select("*")
    .eq("series_id", seriesId)
    .order("scheduled_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Meeting[];
}

export async function rescheduleMeeting(id: string, startsAt: string) {
  const { data, error } = await requireSupabase()
    .from("meetings")
    .update({ starts_at: startsAt })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Meeting;
}

export async function cancelMeeting(id: string) {
  const { data, error } = await requireSupabase()
    .from("meetings")
    .update({ status: "cancelled" })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Meeting;
}

export async function listMembers(seriesId: string) {
  const { data, error } = await requireSupabase()
    .from("series_members")
    .select("*")
    .eq("series_id", seriesId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SeriesMember[];
}

export async function joinSeries(input: CreateMemberInput) {
  const { data, error } = await requireSupabase()
    .from("series_members")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as SeriesMember;
}

export async function leaveSeries(memberId: string) {
  const { error } = await requireSupabase()
    .from("series_members")
    .delete()
    .eq("id", memberId);
  if (error) throw error;
}

export async function listMarks(meetingIds: string[]) {
  if (meetingIds.length === 0) return [];
  const { data, error } = await requireSupabase()
    .from("meeting_marks")
    .select("*")
    .in("meeting_id", meetingIds);
  if (error) throw error;
  return (data ?? []) as MeetingMark[];
}

export async function upsertMark(input: UpsertMarkInput) {
  const { data, error } = await requireSupabase()
    .from("meeting_marks")
    .upsert(input, { onConflict: "meeting_id,member_id" })
    .select("*")
    .single();
  if (error) throw error;
  return data as MeetingMark;
}
