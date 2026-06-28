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

// Локальный список лайкнутых активностей по slug. Счётчик лайков на MVP не
// показываем (нет серверной агрегации) — храним только состояние «лайкнуто/нет».
const likedSlugsKey = "venty.liked-slugs";

export async function readLikedSlugs(): Promise<string[]> {
  const list = await readDeviceJson<string[]>(likedSlugsKey);
  return list ?? [];
}

export async function toggleLike(slug: string): Promise<string[]> {
  const list = await readLikedSlugs();
  const next = list.includes(slug)
    ? list.filter((item) => item !== slug)
    : [slug, ...list];
  await writeDeviceJson(likedSlugsKey, next);
  return next;
}
