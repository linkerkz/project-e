import { Link, useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { BackLink, SITE_PAGES } from "../_layout";

export default function ArticlePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const title = slug ? slug.replaceAll("-", " ") : "article";

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="gap-4 p-5">
        <BackLink />
        <Text className="text-2xl font-bold capitalize text-gray-950">{title}</Text>
        <Text className="text-base leading-6 text-gray-700">
          Dynamic route: /a/{slug}. This page proves nested pages render on web and have a backlink
          to the all-pages index.
        </Text>

        <View className="gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Text className="text-lg font-bold text-gray-950">Other pages</Text>
          {SITE_PAGES.filter((page) => page.href !== `/a/${slug}`).map((page) => (
            <Link key={page.href} href={page.href} asChild>
              <Text className="text-base text-blue-600 underline">{page.label}</Text>
            </Link>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
