import { Platform, Text, View } from "react-native";
import { Button } from "./Button";

type Props = {
  path: string;
};

// Показывается только на вебе: ведёт по кастомной схеме `venty://` в приложение.
// Детекта установки нет — если приложения нет, переход просто не сработает.
export function OpenInAppBanner({ path }: Props) {
  if (Platform.OS !== "web" || typeof window === "undefined") return null;

  const appUrl = `venty://${path}`;

  return (
    <View className="gap-1 border border-gray-400 p-3">
      <Text>Установлено приложение Venty?</Text>
      <Button
        title="Открыть в приложении"
        onPress={() => {
          window.location.href = appUrl;
        }}
      />
    </View>
  );
}
