import type { CreateActivityForm, UpdateActivityForm } from "./schemas";
import type { CreateActivityInput, UpdateActivityInput } from "./types";
import { generateActivitySlug, generateEditToken, toIsoDate } from "./utils";

export function mapCreateActivityFormToInput(
  form: CreateActivityForm,
): CreateActivityInput {
  return {
    ...form,
    description: form.description || null,
    location_text: form.location_text || null,
    cover_url: form.cover_url || null,
    capacity: form.capacity ?? null,
    starts_at: toIsoDate(form.starts_at),
    slug: generateActivitySlug(form.title),
    edit_token: generateEditToken(),
    status: "active",
  };
}

export function mapUpdateActivityFormToInput(
  form: UpdateActivityForm,
): UpdateActivityInput {
  return {
    ...form,
    starts_at: toIsoDate(form.starts_at),
    capacity: form.capacity ?? null,
    description: form.description || null,
    location_text: form.location_text || null,
    cover_url: form.cover_url || null,
  };
}
