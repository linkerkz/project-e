import { Pressable, Text, View } from "react-native";
import { Icon } from "./Icon";

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
};

// Главный CTA из макета: тёмная плашка, лаймовый заголовок и лаймовый круг со
// стрелкой справа. Используется как кнопка отправки формы.
export function PrimaryButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`flex-row items-center justify-between rounded-3xl bg-ink px-5 py-4 ${disabled ? "opacity-60" : ""}`}
    >
      <Text className="font-display text-xl tracking-tight text-lime">
        {title}
      </Text>
      <View className="h-11 w-11 items-center justify-center rounded-full bg-lime">
        <Icon name="arrow" color="#0E0F0B" />
      </View>
    </Pressable>
  );
}
