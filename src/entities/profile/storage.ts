import {
  type CategoryKey,
  categoryKeys,
  categoryOptions,
} from "../../shared/lib/categories";
import {
  readDeviceJson,
  removeDeviceValue,
  writeDeviceJson,
} from "../../shared/lib/storage";
import type { Profile, SaveProfileInput } from "./types";

const profileKey = "venty.profile";

export async function readProfile() {
  const profile = await readDeviceJson<Profile>(profileKey);
  if (profile == null) return null;
  return { ...profile, categories: migrateCategories(profile.categories) };
}

// Старые профили хранили русские подписи («Спорт») вместо ключей. При чтении
// подпись → ключ, ключ оставляем как есть, неизвестное отбрасываем (интересы
// были декоративны, потеря не критична).
function migrateCategories(stored: string[] | undefined): CategoryKey[] {
  if (stored == null) return [];
  return stored
    .map((value) => keyByAlias.get(value))
    .filter((key): key is CategoryKey => key != null);
}

// Псевдоним → ключ: и сам ключ, и русская подпись ведут к ключу словаря.
const keyByAlias = new Map<string, CategoryKey>([
  ...categoryKeys.map((key): [string, CategoryKey] => [key, key]),
  ...categoryOptions.map(({ value, label }): [string, CategoryKey] => [
    label,
    value,
  ]),
]);

export async function writeProfile(input: SaveProfileInput): Promise<Profile> {
  const registeredAt = await keepRegisteredAt();
  const profile = { ...input, registeredAt };
  await writeDeviceJson(profileKey, profile);
  return profile;
}

export function removeProfile() {
  return removeDeviceValue(profileKey);
}

// Дата регистрации = первое сохранение на устройстве, при правках не меняется.
async function keepRegisteredAt() {
  const existing = await readProfile();
  return existing?.registeredAt ?? new Date().toISOString();
}
