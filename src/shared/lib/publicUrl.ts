import { Platform } from "react-native";

export function buildActivityPublicUrl(slug: string) {
  return buildPublicUrl(`/a/${slug}`);
}

export function buildSeriesPublicUrl(slug: string) {
  return buildPublicUrl(`/s/${slug}`);
}

function buildPublicUrl(path: string) {
  const origin = resolveOrigin();
  return origin === "" ? path : `${origin}${path}`;
}

function resolveOrigin() {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return window.location.origin;
  }

  const canonical = process.env.EXPO_PUBLIC_WEB_URL ?? "";
  return canonical.replace(/\/+$/, "");
}
