import { Text, TextInput, View } from "react-native";
import type { InputProps } from "./Input";

// Поле-карточка в стиле макета: кремовая плашка, мелкий mono-лейбл сверху,
// значение — крупным полужирным. Форма совпадает с InputProps, поэтому Field
// подставляется как `component` в FormField и как обёртка вокруг Controller.
export function Field({ label, error, multiline, ...props }: InputProps) {
  return (
    <View className="gap-1">
      <View className="rounded-2xl bg-cream px-4 py-2.5">
        <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {label}
        </Text>
        <TextInput
          className={`font-sans-semibold text-[15px] text-ink ${multiline ? "min-h-20" : ""}`}
          placeholderTextColor="#6D6960"
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "auto"}
          {...props}
        />
      </View>
      {error ? (
        <Text className="font-sans text-[13px] text-coral">{error}</Text>
      ) : null}
    </View>
  );
}

// Многострочный вариант для описания: тот же Field с включённым multiline.
export function MultilineField(props: InputProps) {
  return <Field {...props} multiline />;
}
