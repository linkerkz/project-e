import { describe, expect, it, vi } from "vitest";

vi.mock("expo-crypto", () => ({
  randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
}));

import {
  mapCreateSeriesFormToInput,
  mapJoinFormToMemberInput,
  mapSeriesToUpdateForm,
} from "./mappers";
import type { Recurrence, Series } from "./types";

const recurrence: Recurrence = {
  interval: 1,
  unit: "week",
  weekdays: [1],
  end: { kind: "never" },
};

describe("series/mappers", () => {
  it("преобразует форму создания в payload для API", () => {
    const input = mapCreateSeriesFormToInput({
      title: "Speaking club",
      description: null,
      city: "Алматы",
      location_text: null,
      starts_at: "2026-07-01T19:00",
      capacity: null,
      cover_url: null,
      chat_url: null,
      category: "networking",
      is_free: true,
      recurrence,
    });

    expect(input).toMatchObject({
      title: "Speaking club",
      description: null,
      city: "Алматы",
      category: "networking",
      recurrence,
      status: "active",
    });
    expect(input.starts_at).toBe(new Date("2026-07-01T19:00").toISOString());
    expect(input.slug).toMatch(/^speaking-club-[a-z0-9]{6}$/);
    expect(input.edit_token).toMatch(/^[a-f0-9]{32}$/);
  });

  it("преобразует форму записи в payload участника", () => {
    const withoutTelegram = mapJoinFormToMemberInput("s1", {
      name: "Анна",
      telegram: "",
    });
    const withTelegram = mapJoinFormToMemberInput("s1", {
      name: "Анна",
      telegram: "@anna",
    });

    expect(withoutTelegram).toEqual({
      series_id: "s1",
      name: "Анна",
      telegram: null,
    });
    expect(withTelegram.telegram).toBe("@anna");
  });

  it("преобразует null поля серии в пустые строки для формы управления", () => {
    const form = mapSeriesToUpdateForm(buildSeries({ chat_url: null }));

    expect(form.description).toBe("");
    expect(form.location_text).toBe("");
    expect(form.cover_url).toBe("");
    expect(form.chat_url).toBe("");
  });

  it("сохраняет заполненные поля серии в форме управления", () => {
    const form = mapSeriesToUpdateForm(
      buildSeries({ chat_url: "https://t.me/club", status: "finished" }),
    );

    expect(form.chat_url).toBe("https://t.me/club");
    expect(form.status).toBe("finished");
    expect(form.recurrence).toEqual(recurrence);
  });

  it("преобразует null category легаси в пустую строку для формы", () => {
    const form = mapSeriesToUpdateForm(buildSeries({ category: null }));

    expect(form.category).toBe("");
  });

  it("сохраняет заполненную категорию в форме управления", () => {
    const form = mapSeriesToUpdateForm(buildSeries({ category: "tech" }));

    expect(form.category).toBe("tech");
  });

  it("сохраняет признак «бесплатно» в форме управления", () => {
    const form = mapSeriesToUpdateForm(buildSeries({ is_free: false }));

    expect(form.is_free).toBe(false);
  });
});

function buildSeries(overrides: Partial<Series>): Series {
  return {
    id: "1",
    slug: "series",
    title: "Speaking club",
    description: null,
    city: "Алматы",
    location_text: null,
    starts_at: "2026-07-01T19:00:00.000Z",
    capacity: null,
    cover_url: null,
    chat_url: null,
    category: null,
    is_free: true,
    recurrence,
    edit_token: "token",
    status: "active",
    created_at: "2026-05-01T00:00:00.000Z",
    updated_at: "2026-05-01T00:00:00.000Z",
    ...overrides,
  };
}
