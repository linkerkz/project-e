import { Pressable, Text } from "react-native";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

// Таблетка-фильтр: активная — тёмная заливка, неактивная — контур по линии.
export function Chip({ label, active, onPress }: Props) {
  const shell = active ? "border-ink bg-ink" : "border-line bg-transparent";
  const text = active ? "text-cream" : "text-ink";

  return (
    <Pressable
      onPress={onPress}
      className={`rounded-2xl border px-3.5 py-2 ${shell}`}
    >
      <Text className={`font-sans-semibold text-[13px] ${text}`}>{label}</Text>
    </Pressable>
  );
}
