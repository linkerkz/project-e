import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем чистую логику тоггла.
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

import {
  addMyActivity,
  readLikedSlugs,
  readMyActivities,
  toggleLike,
} from "./local";
import type { Activity } from "./types";

const activity: Activity = {
  id: "1",
  slug: "party",
  title: "Вечеринка",
  description: null,
  city: "Алматы",
  location_text: null,
  starts_at: "2026-07-01T10:00:00Z",
  capacity: null,
  cover_url: null,
  chat_url: null,
  edit_token: "token",
  status: "active",
  created_at: "",
  updated_at: "",
};

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

describe("activity/local мои ивенты", () => {
  beforeEach(() => store.clear());

  it("повторное добавление того же slug не дублирует запись", async () => {
    await addMyActivity(activity);
    await addMyActivity(activity);

    expect(await readMyActivities()).toHaveLength(1);
  });
});
