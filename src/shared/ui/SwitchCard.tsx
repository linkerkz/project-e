import { Text, View } from "react-native";
import { Toggle } from "./Toggle";

type Props = {
  label: string;
  title: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// Кремовая карточка-переключатель: mono-лейбл сверху, крупный заголовок и
// необязательное пояснение слева, тумблер справа. Для булевых полей формы.
export function SwitchCard({
  label,
  title,
  description,
  value,
  onValueChange,
}: Props) {
  return (
    <View className="flex-row items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3.5">
      <View className="flex-1">
        <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {label}
        </Text>
        <Text className="font-sans-semibold text-[15px] text-ink">{title}</Text>
        {description ? (
          <Text className="mt-0.5 font-sans text-[12px] text-muted">
            {description}
          </Text>
        ) : null}
      </View>
      <Toggle value={value} onValueChange={onValueChange} />
    </View>
  );
}
