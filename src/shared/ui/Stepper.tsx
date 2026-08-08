import { Pressable, Text, View } from "react-native";

type Props = {
  label: string;
  value: string;
  onDecrement: () => void;
  onIncrement: () => void;
};

// Кремовая карточка-счётчик из макета: mono-лейбл и значение слева, круглые
// кнопки «−» / «+» справа. Значение и шаг задаёт владелец (форма).
export function Stepper({ label, value, onDecrement, onIncrement }: Props) {
  return (
    <View className="flex-row items-center justify-between rounded-2xl bg-cream px-4 py-3.5">
      <View>
        <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
          {label}
        </Text>
        <Text className="font-sans-semibold text-[15px] text-ink">{value}</Text>
      </View>
      <View className="flex-row gap-2">
        <RoundButton label="−" onPress={onDecrement} />
        <RoundButton label="+" onPress={onIncrement} />
      </View>
    </View>
  );
}

function RoundButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="h-9 w-9 items-center justify-center rounded-full border border-line bg-paper"
    >
      <Text className="font-sans-semibold text-lg text-ink">{label}</Text>
    </Pressable>
  );
}
