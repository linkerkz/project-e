import AsyncStorage from "@react-native-async-storage/async-storage";

// Локальное хранилище устройства (на web — localStorage).
// Булевы флаги вида «это устройство уже сделало X», без серверной проверки.
export async function readDeviceFlag(key: string) {
  const value = await AsyncStorage.getItem(key);
  return value === "1";
}

export async function writeDeviceFlag(key: string) {
  await AsyncStorage.setItem(key, "1");
}

// Произвольное JSON-значение устройства (поверх булевых флагов).
// Битый JSON трактуем как «значения нет», не роняем чтение.
export async function readDeviceJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (raw == null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function writeDeviceJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function removeDeviceValue(key: string) {
  await AsyncStorage.removeItem(key);
}
