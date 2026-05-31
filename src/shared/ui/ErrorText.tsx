import { Text } from "react-native";
import { getRussianErrorMessage } from "../errors/getRussianErrorMessage";

type Props = {
  error?: unknown;
  fallback?: string;
  children?: string | null;
};

export function ErrorText({ error, fallback = "", children }: Props) {
  const message =
    error != null ? getRussianErrorMessage(error, { fallback }) : children;
  if (!message) return null;

  return <Text className="text-red-700">{message}</Text>;
}
