import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { Button } from "./Button";

type SelectOption<Value extends string> = {
  value: Value;
  label: ReactNode;
};

type SelectProps<Value extends string> = {
  label: ReactNode;
  value: Value;
  onChange: (value: Value) => void;
  options: SelectOption<Value>[];
  error?: ReactNode;
};

export function Select<Value extends string>({
  label,
  value,
  onChange,
  options,
  error,
}: SelectProps<Value>) {
  return (
    <View className="gap-1">
      <Text className="font-bold">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            title={`${value === option.value ? "[x]" : "[ ]"} ${option.label}`}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
      {error ? <Text className="text-red-700">{error}</Text> : null}
    </View>
  );
}
