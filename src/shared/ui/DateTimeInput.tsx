import type { ChangeEvent } from "react";
import { Platform, Text, View } from "react-native";
import { Input, type InputProps } from "./Input";

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
        <Text className="font-bold">{label}</Text>
        <input
          id={inputId}
          name={inputId}
          className="border border-gray-500 bg-white p-2"
          type="datetime-local"
          value={String(value ?? "")}
          placeholder={placeholder}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            onChangeText?.(event.target.value)
          }
        />
        {error ? <Text className="text-red-700">{error}</Text> : null}
      </View>
    );
  }

  return (
    <Input
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
