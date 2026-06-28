import { readDeviceJson, writeDeviceJson } from "../../shared/lib/storage";
import type { ParticipantStatus } from "./types";

// Локальный список активностей, где устройство откликнулось — данные для счётчика
// «Посещено» в профиле. Серверного аккаунта нет, это device-local проекция отклика.
export type MyResponse = {
  slug: string;
  title: string;
  city: string;
  startsAt: string;
  status: ParticipantStatus;
};

const myResponsesKey = "venty.my-responses";

export async function readMyResponses(): Promise<MyResponse[]> {
  const list = await readDeviceJson<MyResponse[]>(myResponsesKey);
  return list ?? [];
}

export async function addMyResponse(response: MyResponse) {
  const list = await readMyResponses();
  if (list.some((item) => item.slug === response.slug)) return list;
  const next = [response, ...list];
  await writeDeviceJson(myResponsesKey, next);
  return next;
}
