import { describe, expect, it } from "vitest";
import {
  generateActivitySlug,
  generateEditToken,
  getNextActivityStatus,
  isValidActivityDateTime,
  slugifyTitle,
  toDateTimeLocalInputValue,
  toIsoDate,
} from "./utils";

describe("activity/utils", () => {
  it("преобразует название в slug", () => {
    expect(slugifyTitle("  My Cool Activity!  ")).toBe("my-cool-activity");
    expect(slugifyTitle("!!!")).toBe("activity");
  });

  it("генерирует slug с коротким случайным суффиксом", () => {
    const slug = generateActivitySlug("My Activity");

    expect(slug).toMatch(/^my-activity-[a-z0-9]{6}$/);
  });

  it("генерирует edit token из 18 символов", () => {
    expect(generateEditToken()).toMatch(/^[a-z0-9]{18}$/);
  });

  it("проверяет корректность даты", () => {
    expect(isValidActivityDateTime("2026-05-30T12:30")).toBe(true);
    expect(isValidActivityDateTime("12 мая")).toBe(false);
    expect(isValidActivityDateTime("")).toBe(false);
  });

  it("преобразует дату в ISO, если дата корректна", () => {
    expect(toIsoDate("2026-05-30T12:30")).toBe(
      new Date("2026-05-30T12:30").toISOString(),
    );
    expect(toIsoDate("12 мая")).toBe("12 мая");
  });

  it("преобразует дату с бэка в значение для datetime-local", () => {
    expect(toDateTimeLocalInputValue("2006-02-01T06:22:00+00:00")).toMatch(
      /^2006-02-01T\d{2}:22$/,
    );
    expect(toDateTimeLocalInputValue("не дата")).toBe("не дата");
  });

  it("возвращает следующий статус активности", () => {
    expect(getNextActivityStatus("active")).toBe("cancelled");
    expect(getNextActivityStatus("cancelled")).toBe("active");
  });
});
