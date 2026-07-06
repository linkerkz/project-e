import { describe, expect, it } from "vitest";
import type { MeetingMark, Recurrence, SeriesMember } from "./types";
import { formatRecurrenceText, getGoingCount, listOccurrences } from "./utils";

const anchor = "2026-03-02T19:00"; // понедельник
const DAY = 86_400_000;

const rule = (over: Partial<Recurrence>): Recurrence => ({
  interval: 1,
  unit: "day",
  weekdays: [],
  end: { kind: "never" },
  ...over,
});

const ourWeekday = (iso: string) => (new Date(iso).getDay() + 6) % 7;
const spacing = (dates: string[], i: number) =>
  new Date(dates[i + 1]).getTime() - new Date(dates[i]).getTime();

describe("series/utils listOccurrences", () => {
  it("ежедневное правило даёт подряд идущие дни", () => {
    const dates = listOccurrences(rule({ unit: "day" }), anchor, {
      horizon: 3,
    });

    expect(dates).toHaveLength(3);
    expect(dates[0]).toBe(new Date(anchor).toISOString());
    expect(spacing(dates, 0)).toBe(DAY);
    expect(spacing(dates, 1)).toBe(DAY);
  });

  it("недельное правило по одному дню шагает через неделю", () => {
    const dates = listOccurrences(
      rule({ unit: "week", weekdays: [0] }),
      anchor,
      { horizon: 3 },
    );

    expect(dates.map(ourWeekday)).toEqual([0, 0, 0]);
    expect(spacing(dates, 0)).toBe(7 * DAY);
  });

  it("недельное правило по нескольким дням чередует дни недели", () => {
    const dates = listOccurrences(
      rule({ unit: "week", weekdays: [0, 2] }),
      anchor,
      { horizon: 4 },
    );

    expect(dates.map(ourWeekday)).toEqual([0, 2, 0, 2]);
  });

  it("интервал в 2 недели удваивает шаг", () => {
    const dates = listOccurrences(
      rule({ unit: "week", weekdays: [0], interval: 2 }),
      anchor,
      { horizon: 2 },
    );

    expect(spacing(dates, 0)).toBe(14 * DAY);
  });

  it("месячное правило сохраняет день месяца", () => {
    const dates = listOccurrences(rule({ unit: "month" }), anchor, {
      horizon: 3,
    });

    expect(dates.map((iso) => new Date(iso).getDate())).toEqual([2, 2, 2]);
  });

  it("окончание по числу встреч ограничивает количество", () => {
    const dates = listOccurrences(
      rule({ unit: "day", end: { kind: "count", count: 2 } }),
      anchor,
      { horizon: 5 },
    );

    expect(dates).toHaveLength(2);
  });

  it("окончание по дате обрезает по горизонту", () => {
    const until = new Date(new Date(anchor).getTime() + 2 * DAY).toISOString();
    const dates = listOccurrences(
      rule({ unit: "day", end: { kind: "until", date: until } }),
      anchor,
      { horizon: 10 },
    );

    expect(dates).toHaveLength(3);
  });

  it("мусорную дату старта отдаёт пустым списком", () => {
    expect(listOccurrences(rule({}), "не дата")).toEqual([]);
  });
});

describe("series/utils formatRecurrenceText", () => {
  it("описывает правило текстом для бейджа", () => {
    expect(formatRecurrenceText(rule({ unit: "day" }), anchor)).toBe(
      "каждый день · 19:00",
    );
    expect(
      formatRecurrenceText(rule({ unit: "week", weekdays: [1] }), anchor),
    ).toBe("каждый вт · 19:00");
    expect(
      formatRecurrenceText(rule({ unit: "week", weekdays: [0, 2] }), anchor),
    ).toBe("по пн, ср · 19:00");
  });
});

describe("series/utils getGoingCount", () => {
  it("считает идущих: без отметки идёт, пропуск вычитается", () => {
    const members = [{ id: "a" }, { id: "b" }, { id: "c" }] as SeriesMember[];
    const marks = [
      { member_id: "b", status: "skip" },
      { member_id: "a", status: "going" },
    ] as MeetingMark[];

    expect(getGoingCount(members, marks)).toBe(2);
  });
});
