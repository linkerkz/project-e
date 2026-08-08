import { useState } from "react";
import { Modal, Pressable, ScrollView, Text } from "react-native";
import { Icon } from "./Icon";

type Props = {
  city: string;
  cities: string[];
  onChange: (name: string) => void;
};

// Пилюля-триггер «📍 Город ▾» → модальный список городов. Работает с именами
// (строками справочника) — слой shared не знает о сущности city.
export function CitySelect({ city, cities, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const pick = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  return (
    <>
      <Trigger city={city} onPress={() => setIsOpen(true)} />
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <CityList
          city={city}
          cities={cities}
          onPick={pick}
          onClose={() => setIsOpen(false)}
        />
      </Modal>
    </>
  );
}

function Trigger({ city, onPress }: { city: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-1.5 self-start rounded-full border border-line bg-cream px-3 py-1.5"
    >
      <Icon name="pin" size={14} color="#0E0F0B" />
      <Text className="font-display tracking-tight text-ink">
        {city || "Выбрать город"}
      </Text>
      <Text className="font-mono text-xs text-muted">▾</Text>
    </Pressable>
  );
}

type ListProps = {
  city: string;
  cities: string[];
  onPick: (name: string) => void;
  onClose: () => void;
};

function CityList({ city, cities, onPick, onClose }: ListProps) {
  return (
    <Pressable
      onPress={onClose}
      className="flex-1 justify-end bg-ink/40 px-4 pb-8"
    >
      <Pressable className="max-h-[70%] gap-1 rounded-3xl border border-line bg-paper p-4">
        <Text className="px-1 pb-2 font-mono text-[11px] uppercase tracking-widest text-muted">
          Город
        </Text>
        <ScrollView>
          {cities.map((name) => (
            <CityRow
              key={name}
              name={name}
              active={name === city}
              onPress={() => onPick(name)}
            />
          ))}
        </ScrollView>
      </Pressable>
    </Pressable>
  );
}

type RowProps = { name: string; active: boolean; onPress: () => void };

function CityRow({ name, active, onPress }: RowProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-2xl px-3 py-3 ${active ? "bg-cream" : ""}`}
    >
      <Text className="font-display tracking-tight text-ink">{name}</Text>
      {active ? <Icon name="pin" size={16} color="#0E0F0B" /> : null}
    </Pressable>
  );
}
