import { TextInput, View } from "react-native";
import { Icon } from "./Icon";

type Props = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
};

// Компактная строка поиска в стиле ленты: кремовая таблетка с иконкой внутри,
// без заголовка поля — плейсхолдер подсказывает, что искать.
export function SearchField({ value, onChangeText, placeholder }: Props) {
  return (
    <View className="flex-row items-center gap-2.5 rounded-2xl bg-cream px-3.5 py-3">
      <Icon name="search" size={20} color="#6D6960" />
      <TextInput
        className="flex-1 font-sans text-[15px] text-ink"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6D6960"
      />
    </View>
  );
}
