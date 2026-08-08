import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { getCurrentCoords } from "../../shared/lib/geolocation";
import { listCities } from "./api";
import { readSelectedCity, writeSelectedCity } from "./local";
import type { City } from "./types";
import { nearestCity } from "./utils";

export const cityKeys = {
  all: ["cities"] as const,
  list: ["cities", "list"] as const,
  selected: ["cities", "selected"] as const,
};

export function useCities() {
  return useQuery({ queryKey: cityKeys.list, queryFn: listCities });
}

// Готовое состояние города для ленты: справочник + сохранённый выбор + однократный
// детект по гео. Приоритет предвыбора: ручной выбор → сохранённый pref → ближайший
// по гео → дефолт (первый по sort). После ручного выбора гео не перетирает pref.
export function useSelectedCity() {
  const { data: cities = [] } = useCities();
  const saved = useQuery({
    queryKey: cityKeys.selected,
    queryFn: readSelectedCity,
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const didDetect = useRef(false);

  useEffect(() => {
    if (selected != null || saved.isLoading || cities.length === 0) return;
    if (saved.data != null) return setSelected(saved.data);
    if (didDetect.current) return;
    didDetect.current = true;
    setIsDetecting(true);
    detectCity(cities)
      .then((name) => setSelected(name ?? cities[0].name))
      .finally(() => setIsDetecting(false));
  }, [selected, saved.isLoading, saved.data, cities]);

  const queryClient = useQueryClient();
  const setCity = useCallback(
    (name: string) => {
      setSelected(name);
      writeSelectedCity(name).then(() =>
        queryClient.invalidateQueries({ queryKey: cityKeys.selected }),
      );
    },
    [queryClient],
  );

  return { city: selected ?? "", cities, setCity, isDetecting };
}

// Ближайший город по координатам устройства. Гео недоступно → null, решение о
// дефолте принимает вызывающий.
async function detectCity(cities: City[]) {
  const coords = await getCurrentCoords();
  if (coords == null) return null;
  return nearestCity(coords, cities)?.name ?? null;
}
