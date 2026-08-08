import { describe, expect, it } from "vitest";
import type { City } from "./types";
import { nearestCity } from "./utils";

function city(name: string, lat: number, lng: number, sort: number): City {
  return { id: name, slug: name, name, lat, lng, country: "KZ", sort };
}

const almaty = city("Алматы", 43.238, 76.8829, 1);
const astana = city("Астана", 51.1694, 71.4491, 2);

describe("city/utils nearestCity", () => {
  it("возвращает ближайший город из списка", () => {
    const near = { lat: 43.3, lng: 76.9 };
    expect(nearestCity(near, [astana, almaty])?.name).toBe("Алматы");
  });

  it("пустой список отдаёт null", () => {
    expect(nearestCity({ lat: 43.2, lng: 76.9 }, [])).toBeNull();
  });

  it("при равных расстояниях выбирает первый в списке", () => {
    const left = city("Левый", 0, -1, 1);
    const right = city("Правый", 0, 1, 2);
    expect(nearestCity({ lat: 0, lng: 0 }, [left, right])?.name).toBe("Левый");
  });
});
