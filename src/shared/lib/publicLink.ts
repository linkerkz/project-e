import * as Crypto from "expo-crypto";

const nonAlphanumericRun = /[^\p{L}\p{N}]+/gu;
const leadingTrailingHyphens = /^-+|-+$/g;

export function slugifyTitle(title: string, fallback = "activity") {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(nonAlphanumericRun, "-")
      .replace(leadingTrailingHyphens, "") || fallback
  );
}

export function generateSlug(title: string, fallback = "activity") {
  return `${slugifyTitle(title, fallback)}-${shortRandom()}`;
}

export function generateEditToken() {
  return Crypto.randomUUID().replaceAll("-", "");
}

function shortRandom() {
  return Math.random().toString(36).slice(2, 8);
}
