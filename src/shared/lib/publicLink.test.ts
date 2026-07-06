import { describe, expect, it, vi } from "vitest";

vi.mock("expo-crypto", () => ({
  randomUUID: () => "123e4567-e89b-12d3-a456-426614174000",
}));

import { generateEditToken, generateSlug, slugifyTitle } from "./publicLink";

describe("shared/publicLink", () => {
  it("преобразует название в slug", () => {
    expect(slugifyTitle("  My Cool Activity!  ")).toBe("my-cool-activity");
    expect(slugifyTitle("  Кириллица 123!  ")).toBe("кириллица-123");
    expect(slugifyTitle("!!!")).toBe("activity");
    expect(slugifyTitle("!!!", "series")).toBe("series");
  });

  it("генерирует slug с коротким случайным суффиксом", () => {
    expect(generateSlug("My Activity")).toMatch(/^my-activity-[a-z0-9]{6}$/);
  });

  it("генерирует edit token из UUID без дефисов", () => {
    expect(generateEditToken()).toMatch(/^[a-f0-9]{32}$/);
  });
});
