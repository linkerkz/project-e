import type { ReactNode } from "react";
import { Text, View } from "react-native";

type Props = {
  label: ReactNode;
  error?: string;
  children: ReactNode;
};

export function FieldShell({ label, error, children }: Props) {
  return (
    <View className="gap-1">
      <Text className="font-bold">{label}</Text>
      {children}
      {error ? <Text className="text-red-700">{error}</Text> : null}
    </View>
  );
}
