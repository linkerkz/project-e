import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";
import { TextLink } from "../src/shared/ui/TextLink";

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <View className="border-b border-gray-500 p-4">
        <Text className="text-3xl font-bold">Венти</Text>
        <View className="flex-row gap-4">
          <TextLink href="/">Главная</TextLink>
          <TextLink href="/create">Создать</TextLink>
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
