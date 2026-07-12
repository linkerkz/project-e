import { describe, expect, it } from "vitest";
import { getReminderDate, hoursWord } from "./utils";

const hourInMs = 60 * 60 * 1000;
const isoAfter = (hours: number) =>
  new Date(Date.now() + hours * hourInMs).toISOString();

describe("reminder/utils расчёт даты", () => {
  it("возвращает старт минус смещение для будущей активности", () => {
    const start = isoAfter(5);
    const remindAt = getReminderDate(start, 2);

    const expected = new Date(start).getTime() - 2 * hourInMs;
    expect(remindAt?.getTime()).toBe(expected);
  });

  it("момент напоминания уже в прошлом → null", () => {
    // Старт через час, смещение 2 часа — напомнить надо было час назад.
    expect(getReminderDate(isoAfter(1), 2)).toBeNull();
  });

  it("мусорную дату старта отдаёт null", () => {
    expect(getReminderDate("не дата", 2)).toBeNull();
  });
});

describe("reminder/utils форма слова «час»", () => {
  it("склоняет час по числу", () => {
    expect(hoursWord(1)).toBe("час");
    expect(hoursWord(2)).toBe("часа");
    expect(hoursWord(11)).toBe("часов");
    expect(hoursWord(24)).toBe("часа");
  });
});
