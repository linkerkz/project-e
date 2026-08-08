import * as Device from "expo-device";
import * as Location from "expo-location";
import { Platform } from "react-native";

export type Coords = { lat: number; lng: number };

// Координаты устройства для предвыбора ближайшего города. Детект необязателен:
// отказ в разрешении, ошибка или недоступность сенсора — всегда null, не бросаем.
export async function getCurrentCoords(): Promise<Coords | null> {
  if (isAndroidEmulator()) return null;
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") return null;
    const { coords } = await Location.getCurrentPositionAsync({});
    return { lat: coords.latitude, lng: coords.longitude };
  } catch {
    return null;
  }
}

// В Android-эмуляторе геолокация недоступна (виснет без фикса): не дёргаем сенсор.
function isAndroidEmulator() {
  return Platform.OS === "android" && !Device.isDevice;
}
