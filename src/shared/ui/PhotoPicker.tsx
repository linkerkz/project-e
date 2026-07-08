import * as ImagePicker from "expo-image-picker";
import type { ReactNode } from "react";
import { Image, Text, View } from "react-native";
import { Button } from "./Button";
import { FieldShell } from "./FieldShell";

type Props = {
  label: ReactNode;
  value: string;
  onChange: (uri: string) => void;
  error?: string;
};

export function PhotoPicker({ label, value, onChange, error }: Props) {
  return (
    <FieldShell label={label} error={error}>
      {value ? (
        <Image
          source={{ uri: value }}
          className="h-24 w-24 border border-gray-400"
        />
      ) : (
        <Text className="text-gray-500">Фото не выбрано</Text>
      )}
      <View className="flex-row gap-2">
        <Button title="Выбрать фото" onPress={() => pickPhoto(onChange)} />
        {value ? <Button title="Убрать" onPress={() => onChange("")} /> : null}
      </View>
    </FieldShell>
  );
}

// Открывает галерею и кладёт локальный URI выбранного фото. Отмену и сбой
// (отказ в доступе) проглатываем: для профиля фото необязательно.
async function pickPhoto(onChange: (uri: string) => void) {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 1,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  } catch {}
}
