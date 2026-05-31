import type { ComponentProps } from "react";
import { Pressable, Text } from "react-native";

type ButtonProps = ComponentProps<typeof Pressable> & {
  title?: string;
  children?: never;
};

export function Button({ title, ...props }: ButtonProps) {
  return (
    <Pressable
      className="border border-gray-700 bg-gray-200 px-3 py-2"
      {...props}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}
