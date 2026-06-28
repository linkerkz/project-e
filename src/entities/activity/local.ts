import { readDeviceJson, writeDeviceJson } from "../../shared/lib/storage";
import type { Activity } from "./types";

// Локальный список созданных на устройстве активностей — данные для экрана
// «Мои ивенты». Серверного владения нет, это device-local проекция активности.
export type MyActivity = {
  slug: string;
  editToken: string;
  title: string;
  city: string;
  startsAt: string;
};

const myActivitiesKey = "venty.my-activities";

export async function readMyActivities(): Promise<MyActivity[]> {
  const list = await readDeviceJson<MyActivity[]>(myActivitiesKey);
  return list ?? [];
}

export async function addMyActivity(activity: Activity) {
  const list = await readMyActivities();
  if (list.some((item) => item.slug === activity.slug)) return list;
  const next = [toMyActivity(activity), ...list];
  await writeDeviceJson(myActivitiesKey, next);
  return next;
}

function toMyActivity(activity: Activity): MyActivity {
  return {
    slug: activity.slug,
    editToken: activity.edit_token,
    title: activity.title,
    city: activity.city,
    startsAt: activity.starts_at,
  };
}
