import { describe, expect, it } from "vitest";
import { mapProfileToForm } from "./mappers";
import type { Profile } from "./types";

describe("profile/mappers", () => {
  it("null в полях профиля превращает в пустую строку для формы", () => {
    const profile: Profile = {
      fullName: "Анна",
      city: null,
      categories: [],
      photoUrl: null,
      socials: {
        telegram: null,
        instagram: null,
        tiktok: null,
        whatsapp: null,
        discord: null,
        website: null,
      },
      registeredAt: "2026-01-01T00:00:00.000Z",
    };

    expect(mapProfileToForm(profile)).toEqual({
      fullName: "Анна",
      city: "",
      categories: [],
      photoUrl: "",
      socials: {
        telegram: "",
        instagram: "",
        tiktok: "",
        whatsapp: "",
        discord: "",
        website: "",
      },
    });
  });

  it("сохраняет заполненные поля и не тащит дату регистрации", () => {
    const form = mapProfileToForm({
      fullName: "Анна",
      city: "Москва",
      categories: ["Спорт"],
      photoUrl: "https://example.com/p.jpg",
      socials: {
        telegram: "@anna",
        instagram: null,
        tiktok: null,
        whatsapp: null,
        discord: null,
        website: null,
      },
      registeredAt: "2026-01-01T00:00:00.000Z",
    });

    expect(form.city).toBe("Москва");
    expect(form.socials.telegram).toBe("@anna");
    expect(form).not.toHaveProperty("registeredAt");
  });
});
