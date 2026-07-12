import { readDeviceJson, updateDeviceJson } from "../../shared/lib/storage";
import type { Reminder } from "./types";

// Device-local список запланированных напоминаний: slug → notificationId.
// Дедуп по slug — одна активность не держит два напоминания.
const remindersKey = "venty.reminders";

export async function readReminders(): Promise<Reminder[]> {
  const list = await readDeviceJson<Reminder[]>(remindersKey);
  return list ?? [];
}

export async function addReminder(reminder: Reminder) {
  return updateDeviceJson<Reminder[]>(remindersKey, (current) => {
    const list = current ?? [];
    return [reminder, ...list.filter((item) => item.slug !== reminder.slug)];
  });
}

export async function removeReminder(slug: string) {
  return updateDeviceJson<Reminder[]>(remindersKey, (current) => {
    const list = current ?? [];
    return list.filter((item) => item.slug !== slug);
  });
}
