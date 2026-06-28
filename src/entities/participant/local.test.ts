import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем чистую логику дедупа.
const store = new Map<string, unknown>();

vi.mock("../../shared/lib/storage", () => ({
  readDeviceJson: async (key: string) => store.get(key) ?? null,
  writeDeviceJson: async (key: string, value: unknown) => {
    store.set(key, value);
  },
}));

import { addMyResponse, type MyResponse, readMyResponses } from "./local";

const response: MyResponse = {
  slug: "party",
  title: "Вечеринка",
  city: "Алматы",
  startsAt: "2026-07-01T10:00:00Z",
  status: "going",
};

describe("participant/local мои отклики", () => {
  beforeEach(() => store.clear());

  it("повторный отклик на тот же slug не дублирует запись", async () => {
    await addMyResponse(response);
    await addMyResponse(response);

    expect(await readMyResponses()).toHaveLength(1);
  });
});
