import { describe, expect, it } from "vitest";
import {
  getCapacityState,
  getNextActivityStatus,
  splitByStartsAt,
  telegramToChatUrl,
} from "./utils";

describe("activity/utils", () => {
  it("нормализует Telegram-хэндл в t.me ссылку", () => {
    expect(telegramToChatUrl("@anna")).toBe("https://t.me/anna");
    expect(telegramToChatUrl("anna")).toBe("https://t.me/anna");
    expect(telegramToChatUrl("t.me/anna")).toBe("https://t.me/anna");
    expect(telegramToChatUrl("https://t.me/anna")).toBe("https://t.me/anna");
    expect(telegramToChatUrl("")).toBe("");
    expect(telegramToChatUrl(null)).toBe("");
  });

  it("возвращает следующий статус активности", () => {
    expect(getNextActivityStatus("active")).toBe("cancelled");
    expect(getNextActivityStatus("cancelled")).toBe("active");
  });

  it("считает остаток мест из capacity", () => {
    expect(getCapacityState({ capacity: null, going: 3 })).toEqual({
      kind: "unlimited",
    });
    expect(getCapacityState({ capacity: 10, going: 4 })).toEqual({
      kind: "available",
      left: 6,
    });
    expect(getCapacityState({ capacity: 5, going: 5 })).toEqual({
      kind: "full",
    });
  });

  it("делит список на предстоящие и прошедшие по startsAt", () => {
    const now = new Date("2026-06-15T12:00:00.000Z");
    const future = { startsAt: "2026-06-16T12:00:00.000Z" };
    const past = { startsAt: "2026-06-14T12:00:00.000Z" };
    const exactlyNow = { startsAt: "2026-06-15T12:00:00.000Z" };

    expect(splitByStartsAt([future, past, exactlyNow], now)).toEqual({
      upcoming: [future],
      past: [past, exactlyNow],
    });
  });
});
