import type { ComponentProps, ReactNode } from "react";
import { TextInput } from "react-native";
import { FieldShell } from "./FieldShell";

export type InputProps = ComponentProps<typeof TextInput> & {
  label: ReactNode;
  error?: string;
};

export function Input({ label, error, ...props }: InputProps) {
  return (
    <FieldShell label={label} error={error}>
      <TextInput className="border border-gray-500 bg-white p-2" {...props} />
    </FieldShell>
  );
}
