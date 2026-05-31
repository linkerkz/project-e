import type { ComponentType } from "react";
import {
  type Control,
  Controller,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Input, type InputProps } from "./Input";

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  label: string;
  error?: string;
  component?: ComponentType<InputProps>;
};

export function FormField<T extends FieldValues>({
  control,
  name,
  label,
  error,
  component: Field = Input,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field
          label={label}
          nativeID={name}
          value={field.value == null ? "" : String(field.value)}
          onChangeText={field.onChange}
          error={error}
        />
      )}
    />
  );
}
