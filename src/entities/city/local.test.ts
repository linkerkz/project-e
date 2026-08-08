import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем чистую логику pref.
const store = new Map<string, unknown>();

vi.mock("../../shared/lib/storage", () => ({
  readDeviceJson: async (key: string) => store.get(key) ?? null,
  writeDeviceJson: async (key: string, value: unknown) => {
    store.set(key, value);
  },
}));

import { readSelectedCity, writeSelectedCity } from "./local";

describe("city/local выбранный город", () => {
  beforeEach(() => store.clear());

  it("читает записанный город", async () => {
    await writeSelectedCity("Алматы");
    expect(await readSelectedCity()).toBe("Алматы");
  });

  it("нет выбора — null", async () => {
    expect(await readSelectedCity()).toBeNull();
  });

  it("повторная запись перетирает выбор", async () => {
    await writeSelectedCity("Алматы");
    await writeSelectedCity("Астана");
    expect(await readSelectedCity()).toBe("Астана");
  });
});
