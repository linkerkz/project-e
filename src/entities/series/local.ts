import { readDeviceJson, writeDeviceJson } from "../../shared/lib/storage";
import type { Series } from "./types";

// Локальный список созданных на устройстве серий — данные для «Мои ивенты».
// Серверного владения нет, это device-local проекция серии.
export type MySeries = {
  slug: string;
  editToken: string;
  title: string;
  city: string;
  startsAt: string;
};

const mySeriesKey = "venty.my-series";

export async function readMySeries(): Promise<MySeries[]> {
  const list = await readDeviceJson<MySeries[]>(mySeriesKey);
  return list ?? [];
}

export async function addMySeries(series: Series) {
  const list = await readMySeries();
  if (list.some((item) => item.slug === series.slug)) return list;
  const next = [toMySeries(series), ...list];
  await writeDeviceJson(mySeriesKey, next);
  return next;
}

function toMySeries(series: Series): MySeries {
  return {
    slug: series.slug,
    editToken: series.edit_token,
    title: series.title,
    city: series.city,
    startsAt: series.starts_at,
  };
}

// Записи «ты ходишь постоянно»: memberId идентифицирует участника на устройстве —
// им же подписаны отметки иду/пропущу и выход из серии.
export type Membership = {
  seriesSlug: string;
  memberId: string;
};

const membershipsKey = "venty.my-memberships";

export async function readMemberships(): Promise<Membership[]> {
  const list = await readDeviceJson<Membership[]>(membershipsKey);
  return list ?? [];
}

export async function findMembership(seriesSlug: string) {
  const list = await readMemberships();
  return list.find((item) => item.seriesSlug === seriesSlug) ?? null;
}

export async function addMembership(membership: Membership) {
  const list = await readMemberships();
  if (list.some((item) => item.seriesSlug === membership.seriesSlug)) {
    return list;
  }
  const next = [membership, ...list];
  await writeDeviceJson(membershipsKey, next);
  return next;
}

export async function removeMembership(seriesSlug: string) {
  const list = await readMemberships();
  const next = list.filter((item) => item.seriesSlug !== seriesSlug);
  await writeDeviceJson(membershipsKey, next);
  return next;
}
