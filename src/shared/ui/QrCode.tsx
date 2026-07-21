import { Text, View } from "react-native";
import QRCodeSvg from "react-native-qrcode-svg";

type Props = {
  url: string;
};

export function QrCode({ url }: Props) {
  return (
    <View className="items-center gap-2 py-2">
      <QRCodeSvg value={url} size={200} />
      <Text className="text-gray-600">{url}</Text>
    </View>
  );
}
