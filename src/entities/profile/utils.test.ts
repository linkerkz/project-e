import { describe, expect, it } from "vitest";
import type { ProfileSocials } from "./types";
import { formatRegisteredAt, getFilledSocials } from "./utils";

describe("profile/utils", () => {
  it("возвращает только заполненные соц.ссылки в порядке словаря", () => {
    const socials: ProfileSocials = {
      website: "https://anna.dev",
      telegram: "@anna",
      instagram: null,
      whatsapp: null,
    };

    expect(getFilledSocials(socials)).toEqual([
      { key: "telegram", label: "Telegram", url: "@anna" },
      { key: "website", label: "Сайт", url: "https://anna.dev" },
    ]);
  });

  it("форматирует дату регистрации, мусор отдаёт как есть", () => {
    expect(formatRegisteredAt("2026-03-05T10:00")).toBe("05.03.2026");
    expect(formatRegisteredAt("не дата")).toBe("не дата");
  });
});
