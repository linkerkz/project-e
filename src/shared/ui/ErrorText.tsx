import { Text } from "react-native";

export function ErrorText({ children }: { children?: string | null }) {
  return children ? <Text className="text-red-700">{children}</Text> : null;
}
