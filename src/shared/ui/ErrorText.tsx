import type { ReactNode } from "react";
import { Text } from "react-native";

export function ErrorText({ children }: { children?: ReactNode }) {
  return children ? (
    <Text className="text-red-700">{String(children)}</Text>
  ) : null;
}
