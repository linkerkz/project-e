import { describe, expect, it, vi } from "vitest";

vi.mock("react-native", () => ({ Platform: { OS: "ios" } }));

import { buildIcs } from "./calendar";

const event = {
  slug: "party",
  title: "Вечеринка",
  description: "Приходи с друзьями",
  location: "Кафе «Утро»",
  startsAt: "2026-08-01T19:00:00+05:00",
  url: "https://venty.app/a/party",
};

describe("buildIcs", () => {
  it("собирает VCALENDAR с одним VEVENT и CRLF-переносами", () => {
    const ics = buildIcs(event);
    const lines = ics.split("\r\n");

    expect(lines[0]).toBe("BEGIN:VCALENDAR");
    expect(lines.at(-1)).toBe("END:VCALENDAR");
    expect(lines).toContain("BEGIN:VEVENT");
    expect(lines).toContain("UID:party@venty");
    expect(lines).toContain("SUMMARY:Вечеринка");
    expect(lines).toContain("URL:https://venty.app/a/party");
    expect(ics).toMatch(/DTSTAMP:\d{8}T\d{6}Z/);
  });

  it("переводит дату старта в UTC и ставит конец через 2 часа", () => {
    const ics = buildIcs(event);

    expect(ics).toContain("DTSTART:20260801T140000Z");
    expect(ics).toContain("DTEND:20260801T160000Z");
  });

  it("экранирует спецсимволы текста по RFC 5545", () => {
    const ics = buildIcs({
      ...event,
      title: "Пикник; шашлык, огонь",
      description: "Взять:\nплед \\ зонт",
    });

    expect(ics).toContain("SUMMARY:Пикник\\; шашлык\\, огонь");
    expect(ics).toContain("DESCRIPTION:Взять:\\nплед \\\\ зонт");
  });

  it("null описание и место не попадают в файл", () => {
    const ics = buildIcs({ ...event, description: null, location: null });

    expect(ics).not.toContain("DESCRIPTION");
    expect(ics).not.toContain("LOCATION");
  });
});
