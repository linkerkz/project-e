import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { type CategoryKey, categoryOptions } from "../lib/categories";
import { toggleItem } from "../lib/toggleItem";

type Props = {
  values: CategoryKey[];
  onChange: (values: CategoryKey[]) => void;
};

export function CategorySelect({ values, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Trigger count={values.length} onPress={() => setIsOpen(true)} />
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <CategoryList
          values={values}
          onToggle={(key) => onChange(toggleItem(values, key))}
          onReset={() => onChange([])}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}

function Trigger({ count, onPress }: { count: number; onPress: () => void }) {
  const active = count > 0;
  const shell = active ? "border-ink bg-ink" : "border-line bg-transparent";
  const text = active ? "text-cream" : "text-ink";
  const chevron = active ? "text-cream" : "text-muted";

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center gap-1.5 rounded-2xl border px-3.5 py-2 ${shell}`}
    >
      <Text className={`font-sans-semibold text-[13px] ${text}`}>
        {active ? `Категории · ${count}` : "Категории"}
      </Text>
      <Text className={`font-mono text-xs ${chevron}`}>▾</Text>
    </Pressable>
  );
}

type ListProps = {
  values: CategoryKey[];
  onToggle: (key: CategoryKey) => void;
  onReset: () => void;
  onClose: () => void;
};

function CategoryList({ values, onToggle, onReset, onClose }: ListProps) {
  return (
    <Pressable
      onPress={onClose}
      className="flex-1 justify-end bg-ink/40 px-4 pb-8"
    >
      <Pressable className="max-h-[70%] gap-1 rounded-3xl border border-line bg-paper p-4">
        <View className="flex-row items-center justify-between px-1 pb-2">
          <Text className="font-mono text-[11px] uppercase tracking-widest text-muted">
            Категории
          </Text>
          {values.length > 0 ? (
            <Pressable onPress={onReset}>
              <Text className="font-sans-semibold text-[13px] text-muted">
                Сбросить
              </Text>
            </Pressable>
          ) : null}
        </View>
        <ScrollView>
          {categoryOptions.map((option) => (
            <CategoryRow
              key={option.value}
              label={option.label}
              active={values.includes(option.value)}
              onPress={() => onToggle(option.value)}
            />
          ))}
        </ScrollView>
        <Pressable
          onPress={onClose}
          className="mt-2 items-center rounded-2xl bg-ink py-3"
        >
          <Text className="font-sans-semibold text-[15px] text-cream">
            Готово
          </Text>
        </Pressable>
      </Pressable>
    </Pressable>
  );
}

type RowProps = { label: string; active: boolean; onPress: () => void };

function CategoryRow({ label, active, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-2xl px-3 py-3 ${active ? "bg-cream" : ""}`}
    >
      <Text className="font-display tracking-tight text-ink">{label}</Text>
      {active ? <View className="h-2.5 w-2.5 rounded-full bg-lime" /> : null}
    </Pressable>
  );
}
