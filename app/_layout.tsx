import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Notifications from "expo-notifications";
import { Stack } from "expo-router";
import { useState } from "react";
import { Platform, Text, View } from "react-native";
import { TextLink } from "../src/shared/ui/TextLink";

// Показ запланированного напоминания, пока приложение на переднем плане.
// На web expo-notifications нет — обработчик ставим только на нативе.
if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export default function RootLayout() {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <View className="border-b border-gray-500 p-4">
        <Text className="text-3xl font-bold">Venty</Text>
        <View className="flex-row gap-4">
          <TextLink href="/">Главная</TextLink>
          <TextLink href="/create">Создать</TextLink>
          <TextLink href="/profile">Профиль</TextLink>
        </View>
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}
