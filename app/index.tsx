import { Text, View } from "react-native";
import { useActivities } from "../src/entities/activity/hooks";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { LoadingText } from "../src/shared/ui/LoadingText";
import { Page } from "../src/shared/ui/Page";
import { TextLink } from "../src/shared/ui/TextLink";

export default function HomePage() {
  const activities = useActivities();
  return (
    <Page>
      <Text className="text-4xl font-bold">Venty</Text>
      <Text>Уродливые ссылки на активности, чтобы делать что-то с людьми</Text>
      <TextLink href="/create">[Создать активность]</TextLink>
      <Text className="text-2xl font-bold">Последние активности:</Text>
      {activities.isLoading ? <LoadingText /> : null}
      <ErrorText
        error={activities.error}
        fallback="Не удалось загрузить активности"
      />
      {activities.data?.length === 0 ? (
        <Text>Активностей пока нет.</Text>
      ) : null}
      <View className="gap-2">
        {activities.data?.map((activity) => (
          <View key={activity.id} className="border-b border-gray-300 py-2">
            <Text>
              {activity.title} — {activity.city} —{" "}
              {new Date(activity.starts_at).toLocaleString()}
            </Text>
            <TextLink href={`/a/${activity.slug}`}>открыть</TextLink>
          </View>
        ))}
      </View>
    </Page>
  );
}
