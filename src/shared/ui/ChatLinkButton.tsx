import { Linking } from "react-native";
import { Button } from "./Button";

type Props = {
  url: string;
};

export function ChatLinkButton({ url }: Props) {
  function openChat() {
    Linking.openURL(url).catch(() => {});
  }

  return <Button title="Перейти в чат" onPress={openChat} />;
}
