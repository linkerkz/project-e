import { Platform } from "react-native";

export function buildActivityPublicUrl(slug: string) {
  const path = `/a/${slug}`;
  if (Platform.OS !== "web" || typeof window === "undefined") return path;

  return `${window.location.origin}${path}`;
}
