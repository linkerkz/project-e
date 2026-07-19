import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем миграцию чтения.
const store = new Map<string, unknown>();

vi.mock("../../shared/lib/storage", () => ({
  readDeviceJson: async (key: string) => store.get(key) ?? null,
  writeDeviceJson: async (key: string, value: unknown) => {
    store.set(key, value);
  },
  removeDeviceValue: async (key: string) => {
    store.delete(key);
  },
}));

import { readProfile } from "./storage";
import type { Profile } from "./types";

const baseProfile: Omit<Profile, "categories"> = {
  fullName: "Анна",
  city: null,
  photoUrl: null,
  socials: {
    telegram: null,
    instagram: null,
    tiktok: null,
    whatsapp: null,
    discord: null,
    website: null,
  },
  registeredAt: "2026-01-01T00:00:00.000Z",
};

describe("profile/storage", () => {
  beforeEach(() => store.clear());

  it("старые русские подписи мапит в ключи, мусор отбрасывает", async () => {
    store.set("venty.profile", {
      ...baseProfile,
      categories: ["Спорт", "sport", "Марс"],
    });

    const profile = await readProfile();

    expect(profile?.categories).toEqual(["sport", "sport"]);
  });
});
