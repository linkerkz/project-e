import { describe, expect, it } from "vitest";
import {
  isToday,
  isValidDateTime,
  toDateTimeLocalInputValue,
  toIsoDate,
} from "./datetime";

describe("shared/datetime", () => {
  it("проверяет корректность даты", () => {
    expect(isValidDateTime("2026-05-30T12:30")).toBe(true);
    expect(isValidDateTime("12 мая")).toBe(false);
    expect(isValidDateTime("")).toBe(false);
  });

  it("преобразует дату в ISO, если дата корректна", () => {
    expect(toIsoDate("2026-05-30T12:30")).toBe(
      new Date("2026-05-30T12:30").toISOString(),
    );
    expect(toIsoDate("12 мая")).toBe("12 мая");
  });

  it("преобразует дату с бэка в значение для datetime-local", () => {
    const value = "2006-02-01T06:22:00+00:00";
    const date = new Date(value);
    const pad = (part: number) => String(part).padStart(2, "0");
    const expected = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

    expect(toDateTimeLocalInputValue(value)).toBe(expected);
    expect(toDateTimeLocalInputValue("не дата")).toBe("не дата");
  });

  it("сегодня — сегодня, вчера/завтра и мусор — нет", () => {
    const day = 24 * 60 * 60 * 1000;
    expect(isToday(Date.now())).toBe(true);
    expect(isToday(Date.now() - day)).toBe(false);
    expect(isToday(Date.now() + day)).toBe(false);
    expect(isToday(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
