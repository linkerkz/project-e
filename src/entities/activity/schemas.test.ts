import { describe, expect, it, vi } from "vitest";

vi.mock("expo-crypto", () => ({
  randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
}));

import { createActivitySchema, updateActivitySchema } from "./schemas";

const validForm = {
  title: "Пробежка",
  description: "",
  city: "Алматы",
  location_text: "",
  starts_at: "2026-07-01T10:00",
  capacity: "",
  cover_url: "",
};

describe("activity/schemas", () => {
  it("чистит пустые необязательные поля в null", () => {
    const result = createActivitySchema.parse(validForm);

    expect(result.description).toBeNull();
    expect(result.location_text).toBeNull();
    expect(result.capacity).toBeNull();
    expect(result.cover_url).toBeNull();
  });

  it("приводит capacity к положительному числу", () => {
    const result = createActivitySchema.parse({ ...validForm, capacity: "12" });

    expect(result.capacity).toBe(12);
  });

  it("требует название, город и корректную дату", () => {
    expect(
      createActivitySchema.safeParse({ ...validForm, title: "  " }).success,
    ).toBe(false);
    expect(
      createActivitySchema.safeParse({ ...validForm, city: "" }).success,
    ).toBe(false);
    const badDate = { ...validForm, starts_at: "12 июля" };
    expect(createActivitySchema.safeParse(badDate).success).toBe(false);
  });

  it("отклоняет некорректную ссылку на обложку", () => {
    const bad = { ...validForm, cover_url: "не-ссылка" };

    expect(createActivitySchema.safeParse(bad).success).toBe(false);
  });

  it("в форме обновления добавляет статус", () => {
    const ok = updateActivitySchema.safeParse({
      ...validForm,
      status: "cancelled",
    });
    const bad = updateActivitySchema.safeParse({
      ...validForm,
      status: "deleted",
    });

    expect(ok.success).toBe(true);
    expect(bad.success).toBe(false);
  });
});
