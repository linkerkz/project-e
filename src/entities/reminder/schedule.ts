import {
  cancelNotification,
  ensureNotificationPermission,
  scheduleNotificationAt,
} from "../../shared/lib/notifications";
import { addReminder, readReminders, removeReminder } from "./local";
import { readReminderSettings } from "./settings";
import { getReminderDate, hoursWord } from "./utils";

// Композиция домена напоминаний с системным адаптером уведомлений. Домен-нейтрально:
// цель — плоский `{slug, title, startsAt}`, слайс активности/серии сюда не течёт.
type Target = {
  slug: string;
  title: string;
  startsAt: string;
};

// Планирует напоминание на старт минус смещение из настройки. false — не
// запланировано (напоминания выключены, web, момент в прошлом или отказ в
// разрешении). Дедуп по slug — одна цель держит одно напоминание.
export async function scheduleReminder(target: Target): Promise<boolean> {
  const { enabled, offsetHours } = await readReminderSettings();
  if (!enabled) return false;

  const remindAt = getReminderDate(target.startsAt, offsetHours);
  if (remindAt == null) return false;

  const granted = await ensureNotificationPermission();
  if (!granted) return false;

  const notificationId = await scheduleNotificationAt(
    remindAt,
    target.title,
    `Начало через ${offsetHours} ${hoursWord(offsetHours)}`,
  );
  if (notificationId == null) return false;

  await addReminder({
    slug: target.slug,
    notificationId,
    startsAt: target.startsAt,
  });
  return true;
}

export async function cancelReminder(slug: string): Promise<void> {
  const reminders = await readReminders();
  const reminder = reminders.find((item) => item.slug === slug);
  if (reminder == null) return;

  await cancelNotification(reminder.notificationId);
  await removeReminder(slug);
}
