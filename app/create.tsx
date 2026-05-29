import { Link } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { BackLink } from "./_layout";

export default function CreatePage() {
  return (
    <ScrollView className="flex-1 bg-slate-50">
      <View className="gap-4 p-5">
        <BackLink />
        <Text className="text-2xl font-bold text-gray-950">Create</Text>
        <Text className="text-base leading-6 text-gray-700">
          This page is wired into Expo Router and linked from the global navigation and home page.
        </Text>
        <View className="gap-3 rounded-xl border border-gray-200 bg-white p-4">
          <Text className="text-lg font-bold text-gray-950">Next step</Text>
          <Text className="text-base leading-6 text-gray-700">
            Add your form here, then insert rows into Supabase from this route.
          </Text>
          <Link href="/a/welcome" asChild>
            <Text className="text-base text-blue-600 underline">Open an article page</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}
