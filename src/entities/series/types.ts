import type { CategoryKey } from "../../shared/lib/categories";

export type RecurrenceUnit = "day" | "week" | "month";

export type RecurrenceEnd =
  | { kind: "never" }
  | { kind: "until"; date: string }
  | { kind: "count"; count: number };

export type Recurrence = {
  interval: number;
  unit: RecurrenceUnit;
  weekdays: number[]; // 0 = понедельник … 6 = воскресенье
  end: RecurrenceEnd;
};

export type SeriesStatus = "active" | "finished";

export type Series = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  city: string;
  location_text: string | null;
  starts_at: string; // первая встреча; задаёт время серии
  capacity: number | null;
  cover_url: string | null;
  chat_url: string | null;
  category: CategoryKey | null;
  is_free: boolean;
  recurrence: Recurrence;
  edit_token: string;
  status: SeriesStatus;
  created_at: string;
  updated_at: string;
};

export type MeetingStatus = "active" | "cancelled";

export type Meeting = {
  id: string;
  series_id: string;
  scheduled_at: string; // слот по правилу, неизменен
  starts_at: string; // факт: слот или перенос
  status: MeetingStatus;
  created_at: string;
};

// Строка ленты: серия с уже сгенерированными встречами (ближайшую считаем на клиенте).
export type SeriesWithMeetings = Series & { meetings: Meeting[] };

export type SeriesMember = {
  id: string;
  series_id: string;
  name: string;
  telegram: string | null;
  created_at: string;
};

export type MarkStatus = "going" | "skip";

export type MeetingMark = {
  id: string;
  meeting_id: string;
  member_id: string;
  status: MarkStatus;
  created_at: string;
};

export type CreateSeriesInput = {
  slug: string;
  title: string;
  description?: string | null;
  city: string;
  location_text?: string | null;
  starts_at: string;
  capacity?: number | null;
  cover_url?: string | null;
  chat_url?: string | null;
  category: CategoryKey;
  is_free?: boolean;
  recurrence: Recurrence;
  edit_token: string;
  status: SeriesStatus;
};

export type UpdateSeriesInput = Partial<
  Omit<CreateSeriesInput, "slug" | "edit_token">
>;

export type CreateMemberInput = {
  series_id: string;
  name: string;
  telegram?: string | null;
};

export type UpsertMarkInput = {
  meeting_id: string;
  member_id: string;
  status: MarkStatus;
};
