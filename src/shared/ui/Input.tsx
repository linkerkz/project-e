import type { ComponentProps, ReactNode } from "react";
import { Text, TextInput, View } from "react-native";

type InputProps = ComponentProps<typeof TextInput> & {
  label: ReactNode;
  error?: ReactNode;
};

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="gap-1">
      <Text className="font-bold">{label}</Text>
      <TextInput className="border border-gray-500 bg-white p-2" {...props} />
      {error ? <Text className="text-red-700">{error}</Text> : null}
    </View>
  );
}

export type { InputProps };
