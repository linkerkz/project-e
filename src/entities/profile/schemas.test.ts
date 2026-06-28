import { describe, expect, it } from "vitest";
import { profileSchema } from "./schemas";

const emptySocials = {
  telegram: "",
  instagram: "",
  tiktok: "",
  whatsapp: "",
  discord: "",
  website: "",
};

describe("profile/schemas", () => {
  it("пустые текстовые поля и соц.ссылки превращает в null", () => {
    const result = profileSchema.parse({
      fullName: "Анна",
      city: "",
      photoUrl: "",
      socials: emptySocials,
    });

    expect(result).toEqual({
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
    });
  });

  it("сохраняет заполненные поля и интересы", () => {
    const result = profileSchema.parse({
      fullName: "Анна",
      city: "Москва",
      categories: ["Спорт"],
      photoUrl: "https://example.com/p.jpg",
      socials: { ...emptySocials, telegram: "@anna" },
    });

    expect(result.city).toBe("Москва");
    expect(result.categories).toEqual(["Спорт"]);
    expect(result.photoUrl).toBe("https://example.com/p.jpg");
    expect(result.socials.telegram).toBe("@anna");
    expect(result.socials.instagram).toBeNull();
  });

  it("принимает локальный URI фото и отклоняет пустое имя", () => {
    const base = { fullName: "Анна", city: "", socials: emptySocials };

    expect(
      profileSchema.safeParse({ ...base, photoUrl: "file:///photo.jpg" })
        .success,
    ).toBe(true);
    expect(
      profileSchema.safeParse({ ...base, fullName: "  ", photoUrl: "" })
        .success,
    ).toBe(false);
  });
});
