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

// Read-modify-write по ключу, сериализованный в очередь: параллельные апдейты
// не затирают друг друга, а выполняются по одному. Возвращает новое значение.
export async function updateDeviceJson<T>(
  key: string,
  update: (current: T | null) => T,
): Promise<T> {
  const run = async () => {
    const next = update(await readDeviceJson<T>(key));
    await writeDeviceJson(key, next);
    return next;
  };
  const result = (writeQueues.get(key) ?? Promise.resolve())
    .catch(() => {})
    .then(run);
  writeQueues.set(
    key,
    result.catch(() => {}),
  );
  return result;
}

const writeQueues = new Map<string, Promise<unknown>>();

export async function removeDeviceValue(key: string) {
  await AsyncStorage.removeItem(key);
}
