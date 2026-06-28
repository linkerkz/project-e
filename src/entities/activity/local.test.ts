import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем чистую логику тоггла.
const store = new Map<string, unknown>();

vi.mock("../../shared/lib/storage", () => ({
  readDeviceJson: async (key: string) => store.get(key) ?? null,
  writeDeviceJson: async (key: string, value: unknown) => {
    store.set(key, value);
  },
}));

import { readLikedSlugs, toggleLike } from "./local";

describe("activity/local лайки", () => {
  beforeEach(() => store.clear());

  it("добавляет и убирает slug при повторном тоггле", async () => {
    expect(await toggleLike("party")).toEqual(["party"]);
    expect(await toggleLike("party")).toEqual([]);
    expect(await readLikedSlugs()).toEqual([]);
  });

  it("тоггл идемпотентен: один slug не дублируется", async () => {
    await toggleLike("run");
    await toggleLike("yoga");

    expect(await readLikedSlugs()).toEqual(["yoga", "run"]);
  });
});
