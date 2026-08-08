import type { ChangeEvent } from "react";
import { Platform, Text, View } from "react-native";
import { Field } from "./Field";
import type { InputProps } from "./Input";

export function DateTimeInput({
  label,
  error,
  value,
  onChangeText,
  placeholder = "ГГГГ-ММ-ДД ЧЧ:ММ",
  nativeID,
  ...props
}: InputProps) {
  if (Platform.OS === "web") {
    const inputId = nativeID ? String(nativeID) : undefined;

    return (
      <View className="gap-1">
        <View className="rounded-2xl bg-cream px-4 py-2.5">
          <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
            {label}
          </Text>
          <input
            id={inputId}
            name={inputId}
            className="border-0 bg-transparent font-sans-semibold text-[15px] text-ink outline-none"
            type="datetime-local"
            value={String(value ?? "")}
            placeholder={placeholder}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChangeText?.(event.target.value)
            }
          />
        </View>
        {error ? (
          <Text className="font-sans text-[13px] text-coral">{error}</Text>
        ) : null}
      </View>
    );
  }

  return (
    <Field
      label={label}
      error={error}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      nativeID={nativeID}
      inputMode="text"
      {...props}
    />
  );
}
