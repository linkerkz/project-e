import { describe, expect, it } from "vitest";
import { createSeriesSchema, updateSeriesSchema } from "./schemas";

const validForm = {
  title: "Speaking club",
  description: "",
  city: "Алматы",
  location_text: "",
  starts_at: "2026-07-01T19:00",
  capacity: "",
  cover_url: "",
  chat_url: "",
  category: "networking",
  recurrence: {
    interval: 1,
    unit: "week",
    weekdays: [1],
    end: { kind: "never" },
  },
};

describe("series/schemas", () => {
  it("чистит пустые необязательные поля в null", () => {
    const result = createSeriesSchema.parse(validForm);

    expect(result.description).toBeNull();
    expect(result.location_text).toBeNull();
    expect(result.capacity).toBeNull();
    expect(result.cover_url).toBeNull();
    expect(result.chat_url).toBeNull();
  });

  it("требует название, город и корректную дату", () => {
    expect(
      createSeriesSchema.safeParse({ ...validForm, title: "  " }).success,
    ).toBe(false);
    expect(
      createSeriesSchema.safeParse({ ...validForm, city: "" }).success,
    ).toBe(false);
    const badDate = { ...validForm, starts_at: "1 июля" };
    expect(createSeriesSchema.safeParse(badDate).success).toBe(false);
  });

  it("недельное правило требует хотя бы один день недели", () => {
    const recurrence = { ...validForm.recurrence, weekdays: [] };

    expect(
      createSeriesSchema.safeParse({ ...validForm, recurrence }).success,
    ).toBe(false);
  });

  it("отклоняет неположительный интервал правила", () => {
    const recurrence = { ...validForm.recurrence, interval: 0 };

    expect(
      createSeriesSchema.safeParse({ ...validForm, recurrence }).success,
    ).toBe(false);
  });

  it("отклоняет неположительное число встреч в окончании", () => {
    const recurrence = {
      ...validForm.recurrence,
      end: { kind: "count", count: 0 },
    };

    expect(
      createSeriesSchema.safeParse({ ...validForm, recurrence }).success,
    ).toBe(false);
  });

  it("требует категорию и отклоняет неизвестный ключ", () => {
    expect(
      createSeriesSchema.safeParse({ ...validForm, category: "" }).success,
    ).toBe(false);
    expect(
      createSeriesSchema.safeParse({ ...validForm, category: "мусор" }).success,
    ).toBe(false);
  });

  it("is_free по умолчанию true без явного значения", () => {
    const result = createSeriesSchema.parse(validForm);

    expect(result.is_free).toBe(true);
  });

  it("пробрасывает is_free: false", () => {
    const result = createSeriesSchema.parse({ ...validForm, is_free: false });

    expect(result.is_free).toBe(false);
  });

  it("в форме обновления добавляет статус", () => {
    const ok = updateSeriesSchema.safeParse({
      ...validForm,
      status: "finished",
    });
    const bad = updateSeriesSchema.safeParse({
      ...validForm,
      status: "paused",
    });

    expect(ok.success).toBe(true);
    expect(bad.success).toBe(false);
  });
});
