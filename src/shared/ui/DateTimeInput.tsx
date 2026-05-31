import type { ChangeEvent } from "react";
import { Platform } from "react-native";
import { FieldShell } from "./FieldShell";
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
      <FieldShell label={label} error={error}>
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
      </FieldShell>
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
