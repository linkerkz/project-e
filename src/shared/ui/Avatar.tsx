import { Image, Text, View } from "react-native";

type Props = {
  photoUrl: string | null;
  name: string;
};

export function Avatar({ photoUrl, name }: Props) {
  if (photoUrl != null) {
    return (
      <Image
        source={{ uri: photoUrl }}
        className="h-20 w-20 border border-gray-400"
      />
    );
  }

  return (
    <View className="h-20 w-20 items-center justify-center border border-gray-400">
      <Text className="text-3xl font-bold">{firstLetter(name)}</Text>
    </View>
  );
}

function firstLetter(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}
