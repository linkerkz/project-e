import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { CreateActivityForm } from "../src/features/create-activity/CreateActivityForm";
import { CreateSeriesForm } from "../src/features/create-series/CreateSeriesForm";
import { Chip } from "../src/shared/ui/Chip";
import { Icon } from "../src/shared/ui/Icon";
import { TabBar } from "../src/shared/ui/TabBar";

type Mode = "activity" | "series";

const modeOptions: { value: Mode; label: string }[] = [
  { value: "activity", label: "Разовое" },
  { value: "series", label: "Регулярное" },
];

export default function CreatePage() {
  const { duplicateFrom } = useLocalSearchParams<{ duplicateFrom?: string }>();
  const [mode, setMode] = useState<Mode>("activity");
  const isDuplicating = Boolean(duplicateFrom);

  return (
    <View className="flex-1 bg-paper">
      <ScrollView contentContainerClassName="gap-5 px-4 pb-32 pt-4">
        <Header />
        {isDuplicating ? null : (
          <View className="flex-row gap-2">
            {modeOptions.map((option) => (
              <Chip
                key={option.value}
                label={option.label}
                active={mode === option.value}
                onPress={() => setMode(option.value)}
              />
            ))}
          </View>
        )}
        {isDuplicating || mode === "activity" ? (
          <CreateActivityForm duplicateFrom={duplicateFrom} />
        ) : (
          <CreateSeriesForm />
        )}
      </ScrollView>
      <TabBar active="plus" />
    </View>
  );
}

function Header() {
  const router = useRouter();
  const goBack = () =>
    router.canGoBack() ? router.back() : router.replace("/");

  return (
    <View className="gap-4 pt-2">
      <Pressable
        onPress={goBack}
        className="h-9 w-9 items-center justify-center rounded-full bg-cream"
      >
        <View className="rotate-180">
          <Icon name="arrow" size={18} color="#0E0F0B" />
        </View>
      </Pressable>
      <View>
        <Text className="font-display text-3xl tracking-tighter text-ink">
          Что происходит?
        </Text>
        <Text className="mt-1 font-sans text-sm text-muted">
          Меньше минуты — и ивент в ленте.
        </Text>
      </View>
    </View>
  );
}
