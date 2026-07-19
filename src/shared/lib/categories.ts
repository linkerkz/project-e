export type CategoryKey = (typeof categoryKeys)[number];

export const categoryKeys = [
  "sport",
  "music",
  "education",
  "networking",
  "games",
  "art",
  "food",
  "travel",
  "tech",
  "volunteering",
] as const;

const categoryLabels: Record<CategoryKey, string> = {
  sport: "Спорт",
  music: "Музыка",
  education: "Образование",
  networking: "Нетворкинг",
  games: "Игры",
  art: "Искусство",
  food: "Еда",
  travel: "Путешествия",
  tech: "Технологии",
  volunteering: "Волонтёрство",
};

export const categoryOptions = categoryKeys.map((value) => ({
  value,
  label: categoryLabels[value],
}));

export function categoryLabel(key: string) {
  const labels: Record<string, string | undefined> = categoryLabels;
  return labels[key] ?? key;
}
