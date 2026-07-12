import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем чистую логику дедупа.
const store = new Map<string, unknown>();

vi.mock("../../shared/lib/storage", () => ({
  readDeviceJson: async (key: string) => store.get(key) ?? null,
  writeDeviceJson: async (key: string, value: unknown) => {
    store.set(key, value);
  },
  updateDeviceJson: async (
    key: string,
    update: (current: unknown) => unknown,
  ) => {
    const next = update(store.get(key) ?? null);
    store.set(key, next);
    return next;
  },
}));

import { addReminder, readReminders, removeReminder } from "./local";
import type { Reminder } from "./types";

const reminder = (over: Partial<Reminder>): Reminder => ({
  slug: "party",
  notificationId: "n1",
  startsAt: "2026-07-01T10:00:00Z",
  ...over,
});

describe("reminder/local", () => {
  beforeEach(() => store.clear());

  it("повторное напоминание того же slug не дублирует, берёт новый id", async () => {
    await addReminder(reminder({ notificationId: "n1" }));
    await addReminder(reminder({ notificationId: "n2" }));

    const list = await readReminders();
    expect(list).toHaveLength(1);
    expect(list[0].notificationId).toBe("n2");
  });

  it("удаление по slug убирает запись", async () => {
    await addReminder(reminder({ slug: "party" }));
    await addReminder(reminder({ slug: "run" }));
    await removeReminder("party");

    expect(await readReminders()).toEqual([reminder({ slug: "run" })]);
  });
});
