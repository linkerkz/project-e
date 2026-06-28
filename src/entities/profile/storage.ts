import {
  readDeviceJson,
  removeDeviceValue,
  writeDeviceJson,
} from "../../shared/lib/storage";
import type { Profile, SaveProfileInput } from "./types";

const profileKey = "venty.profile";

export function readProfile() {
  return readDeviceJson<Profile>(profileKey);
}

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
