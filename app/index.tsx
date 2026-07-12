import { useState } from "react";
import { Text, View } from "react-native";
import { useActivities } from "../src/entities/activity/hooks";
import type { Activity } from "../src/entities/activity/types";
import { useSeries } from "../src/entities/series/hooks";
import type { SeriesWithMeetings } from "../src/entities/series/types";
import {
  formatRecurrenceText,
  listOccurrences,
} from "../src/entities/series/utils";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { Input } from "../src/shared/ui/Input";
import { LoadingText } from "../src/shared/ui/LoadingText";
import { Page } from "../src/shared/ui/Page";
import { TextLink } from "../src/shared/ui/TextLink";

type FeedItem = { key: string; date: number; node: React.ReactNode };

export default function HomePage() {
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");
  const filter = { city: city.trim(), query: query.trim() };
  const activities = useActivities(filter);
  const series = useSeries(filter);
  const items = buildFeed(activities.data ?? [], series.data ?? []);
  const isLoading = activities.isLoading || series.isLoading;

  return (
    <Page>
      <Text className="text-4xl font-bold">Venty</Text>
      <Text>Уродливые ссылки на мероприятия, чтобы делать что-то с людьми</Text>
      <TextLink href="/create">[Создать мероприятие]</TextLink>
      <Input
        label="Город"
        value={city}
        onChangeText={setCity}
        placeholder="Например, Алматы"
      />
      <Input
        label="Поиск по названию"
        value={query}
        onChangeText={setQuery}
        placeholder="Что ищем?"
      />
      <Text className="text-2xl font-bold">Ближайшие мероприятия:</Text>
      {isLoading ? <LoadingText /> : null}
      <ErrorText
        error={activities.error ?? series.error}
        fallback="Не удалось загрузить ленту"
      />
      {!isLoading && items.length === 0 ? (
        <Text>Мероприятий пока нет.</Text>
      ) : null}
      <View className="gap-2">{items.map((item) => item.node)}</View>
    </Page>
  );
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
  return {
    key: `activity-${activity.id}`,
    date: startsAt.getTime(),
    node: (
      <View
        key={`activity-${activity.id}`}
        className="border-b border-gray-300 py-2"
      >
        <Text>
          {activity.title} — {activity.city} — {startsAt.toLocaleString()}
        </Text>
        <TextLink href={`/a/${activity.slug}`}>открыть</TextLink>
      </View>
    ),
  };
}

function toSeriesItem(series: SeriesWithMeetings): FeedItem {
  const next = nextMeetingDate(series);
  const schedule = formatRecurrenceText(series.recurrence, series.starts_at);
  return {
    key: `series-${series.id}`,
    date: next?.getTime() ?? Number.POSITIVE_INFINITY,
    node: (
      <View
        key={`series-${series.id}`}
        className="border-b border-gray-300 py-2"
      >
        <Text>
          {series.title} — {series.city} · серия
        </Text>
        <Text className="text-gray-600">
          {next
            ? `${schedule} · ближайшая: ${next.toLocaleString()}`
            : `${schedule} · ближайших встреч нет`}
        </Text>
        <TextLink href={`/s/${series.slug}`}>открыть</TextLink>
      </View>
    ),
  };
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
