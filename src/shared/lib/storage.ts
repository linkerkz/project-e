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
