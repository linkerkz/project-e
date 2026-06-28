import * as Crypto from "expo-crypto";
import type { ActivityStatus } from "./types";

const nonAlphanumericRun = /[^\p{L}\p{N}]+/gu;
const leadingTrailingHyphens = /^-+|-+$/g;

export function slugifyTitle(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(nonAlphanumericRun, "-")
      .replace(leadingTrailingHyphens, "") || "activity"
  );
}

export function generateActivitySlug(title: string) {
  return `${slugifyTitle(title)}-${shortRandom()}`;
}

export function generateEditToken() {
  return Crypto.randomUUID().replaceAll("-", "");
}

export function isValidActivityDateTime(value: string) {
  return parseDate(value) != null;
}

export function toIsoDate(value: string) {
  return parseDate(value)?.toISOString() ?? value;
}

export function toDateTimeLocalInputValue(value: string) {
  const date = parseDate(value);
  if (!date) return value;

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
    date.getDate(),
  )}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
}

export const activityStatusLabels: Record<ActivityStatus, string> = {
  active: "активна",
  cancelled: "отменена",
};

export const activityStatusOptions = (
  Object.keys(activityStatusLabels) as ActivityStatus[]
).map((value) => ({ value, label: activityStatusLabels[value] }));

export function getNextActivityStatus(status: ActivityStatus): ActivityStatus {
  return status === "active" ? "cancelled" : "active";
}

type CapacityState =
  | { kind: "unlimited" }
  | { kind: "available"; left: number }
  | { kind: "full" };

type CapacityParams = {
  capacity: number | null;
  going: number;
};

export function getCapacityState({
  capacity,
  going,
}: CapacityParams): CapacityState {
  if (capacity == null) return { kind: "unlimited" };

  const left = capacity - going;
  return left > 0 ? { kind: "available", left } : { kind: "full" };
}

// Telegram в профиле хранится как `@username` / `username` / ссылка, а chat_url
// требует полный URL — нормализуем хэндл в t.me-ссылку для префилла формы.
export function telegramToChatUrl(value: string | null | undefined) {
  const handle = value?.trim();
  if (!handle) return "";
  if (/^https?:\/\//i.test(handle)) return handle;
  if (/^(t\.me|telegram\.me|telegram\.dog)\//i.test(handle)) {
    return `https://${handle}`;
  }
  return `https://t.me/${handle.replace(/^@/, "")}`;
}

function parseDate(value: string) {
  const date = new Date(value.trim());
  return Number.isNaN(date.getTime()) ? null : date;
}

function shortRandom() {
  return Math.random().toString(36).slice(2, 8);
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}
