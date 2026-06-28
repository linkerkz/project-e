import { describe, expect, it, vi } from "vitest";

// Системный лист шеринга подменяем: проверяем ветвление результата на нативе.
const { share } = vi.hoisted(() => ({ share: vi.fn() }));

vi.mock("react-native", () => ({
  Platform: { OS: "ios" },
  Share: { share },
}));

import { shareActivity } from "./shareActivity";

const params = { slug: "party", title: "Вечеринка" };

describe("shareActivity на нативе", () => {
  it("успешный шеринг возвращает kind «shared»", async () => {
    share.mockImplementation(async () => ({ action: "sharedAction" }));

    expect(await shareActivity(params)).toEqual({ kind: "shared" });
  });

  it("отмену листа (AbortError) не считает ошибкой", async () => {
    share.mockImplementation(async () => {
      const abort = new Error("dismissed");
      abort.name = "AbortError";
      throw abort;
    });

    expect(await shareActivity(params)).toEqual({ kind: "shared" });
  });

  it("прочую ошибку отдаёт с русским сообщением", async () => {
    share.mockImplementation(async () => {
      throw new Error("boom");
    });

    const result = await shareActivity(params);

    expect(result).toEqual({
      kind: "error",
      message: "Не удалось поделиться ссылкой",
    });
  });
});
