import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export function Page({ children }: { children?: ReactNode }) {
  return (
    <ScrollView className="flex-1 bg-white">
      <View className="gap-4 p-4">{children}</View>
    </ScrollView>
  );
}
