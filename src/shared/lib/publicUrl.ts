import { Platform } from "react-native";

export function buildActivityPublicUrl(slug: string) {
  return buildPublicUrl(`/a/${slug}`);
}

export function buildSeriesPublicUrl(slug: string) {
  return buildPublicUrl(`/s/${slug}`);
}

function buildPublicUrl(path: string) {
  if (Platform.OS !== "web" || typeof window === "undefined") return path;

  return `${window.location.origin}${path}`;
}
