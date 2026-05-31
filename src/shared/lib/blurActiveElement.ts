import { Platform } from "react-native";

export function blurActiveElement() {
  if (Platform.OS !== "web" || typeof document === "undefined") return;

  const activeElement = document.activeElement;
  if (activeElement instanceof HTMLElement) {
    activeElement.blur();
  }
}
