import { useState } from "react";
import { Text, View } from "react-native";
import { type ShareResult, shareActivity } from "../lib/shareActivity";
import { Button } from "./Button";

type Props = {
  slug: string;
  title: string;
};

type Notice = { text: string; isError: boolean };

export function ShareButton({ slug, title }: Props) {
  const [notice, setNotice] = useState<Notice | null>(null);

  async function share() {
    const result = await shareActivity({ slug, title });
    setNotice(noticeFor(result));
  }

  return (
    <View className="gap-1">
      <Button title="Поделиться" onPress={share} />
      {notice ? (
        <Text className={notice.isError ? "text-red-700" : "text-gray-600"}>
          {notice.text}
        </Text>
      ) : null}
    </View>
  );
}

function noticeFor(result: ShareResult): Notice | null {
  if (result.kind === "copied")
    return { text: "Ссылка скопирована", isError: false };
  if (result.kind === "error") return { text: result.message, isError: true };

  return null;
}
