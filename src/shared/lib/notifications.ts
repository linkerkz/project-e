import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Техническая обёртка над expo-notifications без домена: разрешение,
// планирование по дате, отмена. На web уведомлений нет — везде тихий no-op.

const reminderChannelId = "reminders";

export async function ensureNotificationPermission() {
  if (Platform.OS === "web") return false;
  await ensureAndroidChannel();

  return await requestPermissionIfNeeded();
}

// Планирует уведомление на конкретный момент. Возврат null — «не запланировано»
// (web или момент уже в прошлом). Разрешение вызывающий проверяет отдельно.
export async function scheduleNotificationAt(
  date: Date,
  title: string,
  body: string,
): Promise<string | null> {
  if (Platform.OS === "web") return null;
  if (date.getTime() <= Date.now()) return null;

  return await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date,
      channelId: reminderChannelId,
    },
  });
}

export async function cancelNotification(id: string) {
  if (Platform.OS === "web") return;
  await Notifications.cancelScheduledNotificationAsync(id);
}

// Android 13+ показывает запрос разрешения только после создания канала.
async function ensureAndroidChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(reminderChannelId, {
    name: "Напоминания",
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}

async function requestPermissionIfNeeded() {
  const { status } = await Notifications.getPermissionsAsync();
  if (status === Notifications.PermissionStatus.GRANTED) return true;

  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === Notifications.PermissionStatus.GRANTED;
}
