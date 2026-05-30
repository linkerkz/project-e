import * as Crypto from "expo-crypto";

export function slugifyTitle(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "activity"
  );
}

export function shortRandom() {
  return Math.random().toString(36).slice(2, 8);
}

export function generateActivitySlug(title: string) {
  return `${slugifyTitle(title)}-${shortRandom()}`;
}

export function generateEditToken() {
  return Crypto.randomUUID().replaceAll("-", "");
}

function padDatePart(value: number) {
  return String(value).padStart(2, "0");
}

export function isValidActivityDateTime(value: string) {
  const trimmedValue = value.trim();
  if (!trimmedValue) return false;

  const date = new Date(trimmedValue);
  return !Number.isNaN(date.getTime());
}

export function toDateTimeLocalInputValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(
    date.getDate(),
  )}T${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`;
}

export function toIsoDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
}

export function getNextActivityStatus(status: string) {
  return status === "active" ? "cancelled" : "active";
}
