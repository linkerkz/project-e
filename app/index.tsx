import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useActivities } from "../src/entities/activity/hooks";
import type { Activity } from "../src/entities/activity/types";
import { useSelectedCity } from "../src/entities/city/hooks";
import { useProfile } from "../src/entities/profile/hooks";
import { useSeries } from "../src/entities/series/hooks";
import type { SeriesWithMeetings } from "../src/entities/series/types";
import {
  formatRecurrenceText,
  listOccurrences,
} from "../src/entities/series/utils";
import { type CategoryKey, categoryLabel } from "../src/shared/lib/categories";
import { isToday } from "../src/shared/lib/datetime";
import { toggleItem } from "../src/shared/lib/toggleItem";
import { CategorySelect } from "../src/shared/ui/CategorySelect";
import { Chip } from "../src/shared/ui/Chip";
import { CitySelect } from "../src/shared/ui/CitySelect";
import type { CoverHue } from "../src/shared/ui/CoverPlaceholder";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { FeedCard, type FeedCardProps } from "../src/shared/ui/FeedCard";
import { LoadingText } from "../src/shared/ui/LoadingText";
import { SearchField } from "../src/shared/ui/SearchField";
import { TabBar } from "../src/shared/ui/TabBar";

type CardData = Omit<FeedCardProps, "hue" | "big">;
type FeedItem = {
  key: string;
  date: number;
  isFree: boolean;
  categoryKey: CategoryKey | null;
  card: CardData;
};

type QuickFilter = "forYou" | "today" | "free";

const quickFilters: { value: QuickFilter; label: string }[] = [
  { value: "forYou", label: "Для тебя" },
  { value: "today", label: "Сегодня" },
  { value: "free", label: "Бесплатно" },
];

// Обложки чередуются по фирменным цветам: первая карточка крупная и лаймовая.
const hues: CoverHue[] = ["lime", "ink", "coral", "cream"];

export default function HomePage() {
  const { city, cities, setCity } = useSelectedCity();
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<CategoryKey[]>([]);
  const [quick, setQuick] = useState<QuickFilter[]>([]);
  const interests = useProfile().data?.categories ?? [];
  const filter = { city, query: query.trim(), categories };
  const activities = useActivities(filter);
  const series = useSeries(filter);
  const feed = buildFeed(activities.data ?? [], series.data ?? []);
  const items = applyQuickFilters(feed, quick, interests);
  const isLoading = activities.isLoading || series.isLoading;

  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="gap-4 px-4 pb-32 pt-4">
        <Header
          city={city}
          cities={cities.map((item) => item.name)}
          onCityChange={setCity}
        />
        <View className="gap-3">
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Speaking clubs, спорт, музыка…"
          />
          <Filters
            categories={categories}
            onCategoriesChange={setCategories}
            quick={quick}
            onQuickChange={setQuick}
            interests={interests}
          />
        </View>

        <View className="flex-row items-baseline justify-between pt-2">
          <Text className="font-display text-2xl tracking-tighter text-ink">
            Ближайшие
          </Text>
          <Text className="font-mono text-[11px] uppercase tracking-widest text-muted">
            {items.length} ивентов
          </Text>
        </View>

        {isLoading ? <LoadingText /> : null}
        <ErrorText
          error={activities.error ?? series.error}
          fallback="Не удалось загрузить ленту"
        />
        {!isLoading && items.length === 0 ? (
          <Text className="text-muted">Мероприятий пока нет.</Text>
        ) : null}

        {items.map((item, index) => (
          <FeedCard
            key={item.key}
            hue={hues[index % hues.length]}
            big={index === 0}
            {...item.card}
          />
        ))}
      </ScrollView>
      <TabBar active="feed" />
    </View>
  );
}

type HeaderProps = {
  city: string;
  cities: string[];
  onCityChange: (name: string) => void;
};

function Header({ city, cities, onCityChange }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between pt-2">
      <View className="flex-row items-center gap-1">
        <Text className="font-display text-3xl tracking-tighter text-ink">
          venty
        </Text>
        <View className="mt-3 h-2.5 w-2.5 rounded-full bg-lime" />
      </View>
      <CitySelect city={city} cities={cities} onChange={onCityChange} />
    </View>
  );
}

type FiltersProps = {
  categories: CategoryKey[];
  onCategoriesChange: (values: CategoryKey[]) => void;
  quick: QuickFilter[];
  onQuickChange: (values: QuickFilter[]) => void;
  interests: CategoryKey[];
};

function Filters({
  categories,
  onCategoriesChange,
  quick,
  onQuickChange,
  interests,
}: FiltersProps) {
  const available = quickFilters.filter(
    (item) => item.value !== "forYou" || interests.length > 0,
  );

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-4"
      className="-mx-4"
    >
      <CategorySelect values={categories} onChange={onCategoriesChange} />
      {available.map((item) => (
        <Chip
          key={item.value}
          label={item.label}
          active={quick.includes(item.value)}
          onPress={() => onQuickChange(toggleItem(quick, item.value))}
        />
      ))}
    </ScrollView>
  );
}

function applyQuickFilters(
  items: FeedItem[],
  quick: QuickFilter[],
  interests: CategoryKey[],
): FeedItem[] {
  return items.filter((item) =>
    quick.every((filter) => matchesQuick(item, filter, interests)),
  );
}

function matchesQuick(
  item: FeedItem,
  filter: QuickFilter,
  interests: CategoryKey[],
): boolean {
  if (filter === "today") return isToday(item.date);
  if (filter === "free") return item.isFree;
  return item.categoryKey != null && interests.includes(item.categoryKey);
}

// Активности и серии в одной ленте по возрастанию даты ближайшей встречи.
function buildFeed(
  activities: Activity[],
  series: SeriesWithMeetings[],
): FeedItem[] {
  const activityItems = activities.map(toActivityItem);
  const seriesItems = series.map(toSeriesItem);
  return [...activityItems, ...seriesItems].sort((a, b) => a.date - b.date);
}

function toActivityItem(activity: Activity): FeedItem {
  const startsAt = new Date(activity.starts_at);
  const label =
    activity.category != null ? categoryLabel(activity.category) : null;
  return {
    key: `activity-${activity.id}`,
    date: startsAt.getTime(),
    isFree: activity.is_free,
    categoryKey: activity.category,
    card: {
      href: `/a/${activity.slug}`,
      coverLabel: label ?? "Ивент",
      coverUrl: activity.cover_url,
      category: label,
      title: activity.title,
      timeText: formatWhen(startsAt),
      place: formatPlace(activity.location_text, activity.city),
      priceLabel: activity.is_free ? "Бесплатно" : null,
    },
  };
}

function toSeriesItem(series: SeriesWithMeetings): FeedItem {
  const next = nextMeetingDate(series);
  const label = series.category != null ? categoryLabel(series.category) : null;
  return {
    key: `series-${series.id}`,
    date: next?.getTime() ?? Number.POSITIVE_INFINITY,
    isFree: series.is_free,
    categoryKey: series.category,
    card: {
      href: `/s/${series.slug}`,
      coverLabel: label ?? "Серия",
      coverUrl: series.cover_url,
      category: label,
      title: series.title,
      timeText: next ? formatWhen(next) : "ближайших встреч нет",
      place: formatPlace(series.location_text, series.city),
      priceLabel: series.is_free ? "Бесплатно" : null,
      badge: formatRecurrenceText(series.recurrence, series.starts_at),
    },
  };
}

// Место карточки: конкретный адрес и город вместе («Café Bardak · Алматы»),
// чтобы место не терялось за городом. Адреса нет — показываем только город.
function formatPlace(locationText: string | null, city: string): string {
  return locationText != null ? `${locationText} · ${city}` : city;
}

// Ближайшая встреча в будущем: активный слот или следующая дата по правилу.
// Будущих встреч нет — возвращаем null, чтобы не поднимать серию прошедшим стартом.
function nextMeetingDate(series: SeriesWithMeetings): Date | null {
  const now = Date.now();
  const fromMeetings = series.meetings
    .filter((meeting) => meeting.status === "active")
    .map((meeting) => new Date(meeting.starts_at).getTime());
  const fromRule = listOccurrences(series.recurrence, series.starts_at).map(
    (iso) => new Date(iso).getTime(),
  );
  const upcoming = [...fromMeetings, ...fromRule]
    .filter((time) => time >= now)
    .sort((a, b) => a - b);
  return upcoming.length > 0 ? new Date(upcoming[0]) : null;
}

// Короткая подпись даты для карточки: «вт · 19:00».
function formatWhen(date: Date): string {
  const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" });
  const time = date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${weekday} · ${time}`;
}
