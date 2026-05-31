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
