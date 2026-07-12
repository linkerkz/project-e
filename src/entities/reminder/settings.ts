import { readDeviceJson, writeDeviceJson } from "../../shared/lib/storage";
import type { ReminderSettings } from "./types";
import { defaultOffsetHours } from "./utils";

// Device-local настройка напоминаний. По умолчанию включены со стартовым смещением.
const settingsKey = "venty.reminder-settings";

export const defaultReminderSettings: ReminderSettings = {
  enabled: true,
  offsetHours: defaultOffsetHours,
};

export async function readReminderSettings(): Promise<ReminderSettings> {
  const stored = await readDeviceJson<ReminderSettings>(settingsKey);
  return stored ?? defaultReminderSettings;
}

export async function writeReminderSettings(settings: ReminderSettings) {
  await writeDeviceJson(settingsKey, settings);
  return settings;
}
