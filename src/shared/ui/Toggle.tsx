import { Pressable, View } from "react-native";

type Props = {
  value: boolean;
  onValueChange: (value: boolean) => void;
};

// Переключатель-пилюля из макета: тёмная дорожка и лаймовый бегунок во
// включённом состоянии. Позиция бегунка — через self-start/self-end, без
// transform, чтобы читалось как обычный флекс.
export function Toggle({ value, onValueChange }: Props) {
  const track = value ? "bg-ink" : "bg-muted";
  const knob = value ? "self-end bg-lime" : "self-start bg-cream";

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      className={`h-8 w-[52px] justify-center rounded-full p-1 ${track}`}
    >
      <View className={`h-6 w-6 rounded-full ${knob}`} />
    </Pressable>
  );
}
