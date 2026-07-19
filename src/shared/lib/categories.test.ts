import { describe, expect, it } from "vitest";

import { categoryLabel, categoryOptions } from "./categories";

describe("shared/categories", () => {
  it("возвращает русскую подпись по ключу категории", () => {
    expect(categoryLabel("sport")).toBe("Спорт");
    expect(categoryLabel("volunteering")).toBe("Волонтёрство");
  });

  it("неизвестный ключ отдаёт как есть", () => {
    expect(categoryLabel("unknown-key")).toBe("unknown-key");
    expect(categoryLabel("")).toBe("");
  });

  it("словарь опций содержит все категории с подписями", () => {
    expect(categoryOptions).toHaveLength(10);
    expect(categoryOptions[0]).toEqual({ value: "sport", label: "Спорт" });
  });
});
