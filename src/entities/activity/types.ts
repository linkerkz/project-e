import type { CategoryKey } from "../../shared/lib/categories";

export type ActivityStatus = "active" | "cancelled";

export type Activity = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  city: string;
  location_text: string | null;
  starts_at: string;
  capacity: number | null;
  cover_url: string | null;
  chat_url: string | null;
  category: CategoryKey | null;
  edit_token: string;
  status: ActivityStatus;
  created_at: string;
  updated_at: string;
};

export type CreateActivityInput = {
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
  edit_token: string;
  status: ActivityStatus;
};

export type UpdateActivityInput = Partial<
  Omit<CreateActivityInput, "slug" | "edit_token">
>;
