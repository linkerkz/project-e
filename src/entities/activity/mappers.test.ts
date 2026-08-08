import { describe, expect, it, vi } from "vitest";

vi.mock("expo-crypto", () => ({
  randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
}));

import {
  mapActivityToDuplicateForm,
  mapActivityToUpdateForm,
  mapCreateActivityFormToInput,
  mapUpdateActivityFormToInput,
} from "./mappers";
import type { Activity } from "./types";

describe("activity/mappers", () => {
  it("преобразует форму создания в payload для API", () => {
    const input = mapCreateActivityFormToInput({
      title: "Тестовая активность",
      description: null,
      city: "Москва",
      location_text: null,
      starts_at: "2026-05-30T12:30",
      capacity: null,
      cover_url: null,
      chat_url: null,
      category: "sport",
      allow_maybe: true,
      is_free: true,
    });

    expect(input).toMatchObject({
      title: "Тестовая активность",
      description: null,
      city: "Москва",
      location_text: null,
      capacity: null,
      cover_url: null,
      chat_url: null,
      category: "sport",
      status: "active",
    });
    expect(input.starts_at).toBe(new Date("2026-05-30T12:30").toISOString());
    expect(input.slug).toMatch(/^тестовая-активность-[a-z0-9]{6}$/);
    expect(input.edit_token).toMatch(/^[a-f0-9]{32}$/);
  });

  it("сохраняет заполненные необязательные поля при создании", () => {
    const input = mapCreateActivityFormToInput({
      title: "Activity",
      description: "Описание",
      city: "Москва",
      location_text: "Парк",
      starts_at: "2026-05-30T12:30",
      capacity: 10,
      cover_url: "https://example.com/image.jpg",
      chat_url: "https://t.me/club",
      category: "music",
      allow_maybe: true,
      is_free: false,
    });

    expect(input.is_free).toBe(false);
    expect(input.category).toBe("music");
    expect(input.description).toBe("Описание");
    expect(input.location_text).toBe("Парк");
    expect(input.capacity).toBe(10);
    expect(input.cover_url).toBe("https://example.com/image.jpg");
    expect(input.chat_url).toBe("https://t.me/club");
  });

  it("преобразует форму обновления в payload для API", () => {
    const input = mapUpdateActivityFormToInput({
      title: "Activity",
      description: null,
      city: "Москва",
      location_text: null,
      starts_at: "2026-05-30T12:30",
      capacity: null,
      cover_url: null,
      chat_url: null,
      category: "sport",
      allow_maybe: true,
      is_free: true,
      status: "cancelled",
    });

    expect(input).toEqual({
      title: "Activity",
      description: null,
      city: "Москва",
      location_text: null,
      starts_at: new Date("2026-05-30T12:30").toISOString(),
      capacity: null,
      cover_url: null,
      chat_url: null,
      category: "sport",
      allow_maybe: true,
      is_free: true,
      status: "cancelled",
    });
  });

  it("преобразует null chat_url в пустую строку для формы управления", () => {
    const form = mapActivityToUpdateForm(buildActivity({ chat_url: null }));

    expect(form.chat_url).toBe("");
  });

  it("сохраняет заполненный chat_url в форме управления", () => {
    const form = mapActivityToUpdateForm(
      buildActivity({ chat_url: "https://t.me/club" }),
    );

    expect(form.chat_url).toBe("https://t.me/club");
  });

  it("преобразует null category легаси в пустую строку для формы", () => {
    const form = mapActivityToUpdateForm(buildActivity({ category: null }));

    expect(form.category).toBe("");
  });

  it("сохраняет заполненную категорию в форме управления", () => {
    const form = mapActivityToUpdateForm(buildActivity({ category: "tech" }));

    expect(form.category).toBe("tech");
  });

  it("преобразует активность в форму дублирования: дата пустая, статус отсутствует", () => {
    const form = mapActivityToDuplicateForm(
      buildActivity({ description: "Описание", chat_url: "https://t.me/club" }),
    );

    expect(form).toEqual({
      title: "Activity",
      description: "Описание",
      city: "Москва",
      location_text: "",
      starts_at: "",
      capacity: null,
      cover_url: "",
      chat_url: "https://t.me/club",
      category: "",
      allow_maybe: true,
      is_free: true,
    });
    expect(form).not.toHaveProperty("status");
  });

  it("сохраняет признак «бесплатно» в форме дублирования", () => {
    const form = mapActivityToDuplicateForm(buildActivity({ is_free: false }));

    expect(form.is_free).toBe(false);
  });
});

function buildActivity(overrides: Partial<Activity>): Activity {
  return {
    id: "1",
    slug: "activity",
    title: "Activity",
    description: null,
    city: "Москва",
    location_text: null,
    starts_at: "2026-05-30T12:30:00.000Z",
    capacity: null,
    cover_url: null,
    chat_url: null,
    category: null,
    allow_maybe: true,
    is_free: true,
    edit_token: "token",
    status: "active",
    created_at: "2026-05-01T00:00:00.000Z",
    updated_at: "2026-05-01T00:00:00.000Z",
    ...overrides,
  };
}
