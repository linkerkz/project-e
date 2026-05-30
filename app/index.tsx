import { Link } from "expo-router";
import { Text, View } from "react-native";
import { useActivities } from "../src/entities/activity/hooks";
import { getRussianErrorMessage } from "../src/shared/errors/getRussianErrorMessage";
import { blurActiveElement } from "../src/shared/lib/blurActiveElement";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { LoadingText } from "../src/shared/ui/LoadingText";
import { Page } from "../src/shared/ui/Page";

export default function HomePage() {
  const q = useActivities();
  return (
    <Page>
      <Text className="text-4xl font-bold">Венти</Text>
      <Text>Уродливые ссылки на активности, чтобы делать что-то с людьми</Text>
      <Link href="/create" asChild onPress={blurActiveElement}>
        <Text className="text-blue-700 underline text-lg">
          [Создать активность]
        </Text>
      </Link>
      <Text className="text-2xl font-bold">Последние активности:</Text>
      {q.isLoading ? <LoadingText /> : null}
      <ErrorText>
        {q.error
          ? getRussianErrorMessage(q.error, {
              fallback: "Не удалось загрузить активности",
            })
          : null}
      </ErrorText>
      {q.data?.length === 0 ? <Text>Активностей пока нет.</Text> : null}
      <View className="gap-2">
        {q.data?.map((a) => (
          <View key={a.id} className="border-b border-gray-300 py-2">
            <Text>
              {a.title} — {a.city} — {new Date(a.starts_at).toLocaleString()}
            </Text>
            <Link href={`/a/${a.slug}`} asChild onPress={blurActiveElement}>
              <Text className="text-blue-700 underline">открыть</Text>
            </Link>
          </View>
        ))}
      </View>
    </Page>
  );
}
