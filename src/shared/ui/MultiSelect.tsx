import type { ReactNode } from "react";
import { View } from "react-native";
import { Button } from "./Button";
import { FieldShell } from "./FieldShell";

type Option<Value extends string> = {
  value: Value;
  label: string;
};

type Props<Value extends string> = {
  label: ReactNode;
  values: Value[];
  onChange: (values: Value[]) => void;
  options: Option<Value>[];
  error?: string;
};

export function MultiSelect<Value extends string>({
  label,
  values,
  onChange,
  options,
  error,
}: Props<Value>) {
  return (
    <FieldShell label={label} error={error}>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            title={`${values.includes(option.value) ? "[x]" : "[ ]"} ${option.label}`}
            onPress={() => onChange(toggle(values, option.value))}
          />
        ))}
      </View>
    </FieldShell>
  );
}

function toggle<Value extends string>(values: Value[], value: Value) {
  return values.includes(value)
    ? values.filter((item) => item !== value)
    : [...values, value];
}
