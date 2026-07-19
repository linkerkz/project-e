import {
  toDateTimeLocalInputValue,
  toIsoDate,
} from "../../shared/lib/datetime";
import { generateEditToken, generateSlug } from "../../shared/lib/publicLink";
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

export function mapCreateActivityFormToInput(
  form: CreateActivityForm,
): CreateActivityInput {
  return {
    ...form,
    starts_at: toIsoDate(form.starts_at),
    slug: generateSlug(form.title),
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
    chat_url: activity.chat_url ?? "",
    category: activity.category ?? "",
    status: activity.status,
  };
}
