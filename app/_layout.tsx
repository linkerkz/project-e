import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export function BackLink() {
  return (
    <Link href="/" asChild>
      <Text className="text-blue-700 underline">← На главную</Text>
    </Link>
  );
}

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <View className="border-b border-gray-500 p-4">
        <Text className="text-3xl font-bold">Венти</Text>
        <View className="flex-row gap-4">
          <Link href="/" asChild>
            <Text className="text-blue-700 underline">Главная</Text>
          </Link>
          <Link href="/create" asChild>
            <Text className="text-blue-700 underline">Создать</Text>
          </Link>
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
