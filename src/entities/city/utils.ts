import type { Coords } from "../../shared/lib/geolocation";
import type { City } from "./types";

// Ближайший к координатам город справочника по гаверсинусу. Берём точку из нашей
// таблицы, а не reverse-geocode: имя гарантированно совпадёт со словарём.
// Пустой список → null; при равных расстояниях выигрывает первый по порядку.
export function nearestCity(coords: Coords, cities: City[]): City | null {
  let nearest: City | null = null;
  let minDistance = Number.POSITIVE_INFINITY;
  for (const city of cities) {
    const distance = haversine(coords, city);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = city;
    }
  }
  return nearest;
}

// Расстояние по большому кругу в километрах. Радиус Земли постоянный — для
// сравнения городов достаточно относительной величины.
function haversine(from: Coords, to: { lat: number; lng: number }) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.asin(Math.sqrt(a));
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}
