import { beforeEach, describe, expect, it, vi } from "vitest";

// Хранилище устройства подменяем in-memory: тестируем чистую логику дедупа.
const store = new Map<string, unknown>();

vi.mock("../../shared/lib/storage", () => ({
  readDeviceJson: async (key: string) => store.get(key) ?? null,
  writeDeviceJson: async (key: string, value: unknown) => {
    store.set(key, value);
  },
}));

import {
  addMembership,
  addMySeries,
  findMembership,
  readMemberships,
  readMySeries,
  removeMembership,
} from "./local";
import type { Series } from "./types";

const series: Series = {
  id: "1",
  slug: "speaking-club",
  title: "Speaking club",
  description: null,
  city: "Алматы",
  location_text: null,
  starts_at: "2026-07-01T19:00:00Z",
  capacity: null,
  cover_url: null,
  chat_url: null,
  category: null,
  recurrence: {
    interval: 1,
    unit: "week",
    weekdays: [1],
    end: { kind: "never" },
  },
  edit_token: "token",
  status: "active",
  created_at: "",
  updated_at: "",
};

describe("series/local мои серии", () => {
  beforeEach(() => store.clear());

  it("повторное добавление того же slug не дублирует запись", async () => {
    await addMySeries(series);
    await addMySeries(series);

    expect(await readMySeries()).toHaveLength(1);
  });
});

describe("series/local хожу постоянно", () => {
  beforeEach(() => store.clear());

  it("повторная запись в ту же серию не дублирует membership", async () => {
    await addMembership({ seriesSlug: "speaking-club", memberId: "m1" });
    await addMembership({ seriesSlug: "speaking-club", memberId: "m2" });

    expect(await readMemberships()).toHaveLength(1);
  });

  it("выход убирает membership и находит по slug", async () => {
    await addMembership({ seriesSlug: "speaking-club", memberId: "m1" });

    expect(await findMembership("speaking-club")).toMatchObject({
      memberId: "m1",
    });

    await removeMembership("speaking-club");

    expect(await findMembership("speaking-club")).toBeNull();
  });
});
