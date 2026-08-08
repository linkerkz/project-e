import { describe, expect, it } from "vitest";
import { toggleItem } from "./toggleItem";

describe("shared/toggleItem", () => {
  it("добавляет отсутствующий элемент в конец", () => {
    expect(toggleItem(["a"], "b")).toEqual(["a", "b"]);
  });

  it("убирает присутствующий элемент", () => {
    expect(toggleItem(["a", "b"], "a")).toEqual(["b"]);
  });
});
