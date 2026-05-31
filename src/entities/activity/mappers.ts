import type {
  CreateActivityForm,
  UpdateActivityForm,
  UpdateActivityFormInput,
} from "./schemas";
import type {
  Activity,
  CreateActivityInput,
  UpdateActivityInput,
} from "./types";
import {
  generateActivitySlug,
  generateEditToken,
  toDateTimeLocalInputValue,
  toIsoDate,
} from "./utils";

export function mapCreateActivityFormToInput(
  form: CreateActivityForm,
): CreateActivityInput {
  return {
    ...form,
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
  };
}

export function mapActivityToUpdateForm(
  activity: Activity,
): UpdateActivityFormInput {
  return {
    title: activity.title,
    description: activity.description ?? "",
    city: activity.city,
    location_text: activity.location_text ?? "",
    starts_at: toDateTimeLocalInputValue(activity.starts_at),
    capacity: activity.capacity,
    cover_url: activity.cover_url ?? "",
    status: activity.status,
  };
}
