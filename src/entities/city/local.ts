import { readDeviceJson, writeDeviceJson } from "../../shared/lib/storage";

// Выбранный город — device-local pref (имя города, строка). Источник для фильтра
// ленты; отдельно от Profile.city (синхронизацию в MVP не делаем).
const selectedCityKey = "venty.city";

export async function readSelectedCity() {
  return readDeviceJson<string>(selectedCityKey);
}

export async function writeSelectedCity(name: string) {
  await writeDeviceJson(selectedCityKey, name);
  return name;
}
