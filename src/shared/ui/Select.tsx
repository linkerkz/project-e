import type { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "./Button";
import { FieldShell } from "./FieldShell";

type SelectOption<Value extends string> = {
  value: Value;
  label: ReactNode;
};

type SelectProps<Value extends string> = {
  label: ReactNode;
  value: Value;
  onChange: (value: Value) => void;
  options: SelectOption<Value>[];
  error?: string;
};

export function Select<Value extends string>({
  label,
  value,
  onChange,
  options,
  error,
}: SelectProps<Value>) {
  return (
    <FieldShell label={label} error={error}>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            title={`${value === option.value ? "[x]" : "[ ]"} ${option.label}`}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>
    </FieldShell>
  );
}
