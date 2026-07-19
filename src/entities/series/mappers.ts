import {
  toDateTimeLocalInputValue,
  toIsoDate,
} from "../../shared/lib/datetime";
import { generateEditToken, generateSlug } from "../../shared/lib/publicLink";
import type {
  CreateSeriesForm,
  JoinSeriesForm,
  UpdateSeriesForm,
  UpdateSeriesFormInput,
} from "./schemas";
import type {
  CreateMemberInput,
  CreateSeriesInput,
  Series,
  UpdateSeriesInput,
} from "./types";

export function mapCreateSeriesFormToInput(
  form: CreateSeriesForm,
): CreateSeriesInput {
  return {
    ...form,
    starts_at: toIsoDate(form.starts_at),
    slug: generateSlug(form.title, "series"),
    edit_token: generateEditToken(),
    status: "active",
  };
}

export function mapUpdateSeriesFormToInput(
  form: UpdateSeriesForm,
): UpdateSeriesInput {
  return {
    ...form,
    starts_at: toIsoDate(form.starts_at),
  };
}

export function mapJoinFormToMemberInput(
  seriesId: string,
  form: JoinSeriesForm,
): CreateMemberInput {
  return {
    series_id: seriesId,
    name: form.name,
    telegram: form.telegram || null,
  };
}

export function mapSeriesToUpdateForm(series: Series): UpdateSeriesFormInput {
  return {
    title: series.title,
    description: series.description ?? "",
    city: series.city,
    location_text: series.location_text ?? "",
    starts_at: toDateTimeLocalInputValue(series.starts_at),
    capacity: series.capacity,
    cover_url: series.cover_url ?? "",
    chat_url: series.chat_url ?? "",
    category: series.category ?? "",
    recurrence: series.recurrence,
    status: series.status,
  };
}
