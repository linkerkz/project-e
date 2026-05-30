import { describe, expect, it } from "vitest";
import {
  mapCreateActivityFormToInput,
  mapUpdateActivityFormToInput,
} from "./mappers";

describe("activity/mappers", () => {
  it("преобразует форму создания в payload для API", () => {
    const input = mapCreateActivityFormToInput({
      title: "Тестовая активность",
      description: "",
      city: "Москва",
      location_text: "",
      starts_at: "2026-05-30T12:30",
      capacity: null,
      cover_url: "",
    });

    expect(input).toMatchObject({
      title: "Тестовая активность",
      description: null,
      city: "Москва",
      location_text: null,
      capacity: null,
      cover_url: null,
      status: "active",
    });
    expect(input.starts_at).toBe(new Date("2026-05-30T12:30").toISOString());
    expect(input.slug).toMatch(/^activity-[a-z0-9]{6}$/);
    expect(input.edit_token).toMatch(/^[a-z0-9]{18}$/);
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
    });

    expect(input.description).toBe("Описание");
    expect(input.location_text).toBe("Парк");
    expect(input.capacity).toBe(10);
    expect(input.cover_url).toBe("https://example.com/image.jpg");
  });

  it("преобразует форму обновления в payload для API", () => {
    const input = mapUpdateActivityFormToInput({
      title: "Activity",
      description: "",
      city: "Москва",
      location_text: "",
      starts_at: "2026-05-30T12:30",
      capacity: null,
      cover_url: "",
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
      status: "cancelled",
    });
  });
});
