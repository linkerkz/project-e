import { describe, expect, it } from "vitest";
import { getRussianErrorMessage } from "./getRussianErrorMessage";

describe("getRussianErrorMessage", () => {
  it("переводит известные технические ошибки", () => {
    expect(
      getRussianErrorMessage(
        new Error(
          'invalid input syntax for type timestamp with time zone: "12 мая"',
        ),
        { fallback: "Ошибка" },
      ),
    ).toBe("Введите корректные дату и время");

    expect(
      getRussianErrorMessage(new Error("Network request failed"), {
        fallback: "Ошибка",
      }),
    ).toBe("Ошибка сети. Проверьте подключение к интернету");
  });

  it("возвращает fallback для неизвестной ошибки", () => {
    expect(
      getRussianErrorMessage(new Error("Some backend error"), {
        fallback: "Ошибка",
      }),
    ).toBe("Ошибка");
    expect(getRussianErrorMessage("строка", { fallback: "Ошибка" })).toBe(
      "Ошибка",
    );
  });
});
