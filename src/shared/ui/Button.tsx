import type { ComponentProps, ReactNode } from "react";
import { Pressable, Text } from "react-native";

type ButtonProps = ComponentProps<typeof Pressable> & {
  title?: ReactNode;
  children?: ReactNode;
};

export function Button({ title, children, ...props }: ButtonProps) {
  return (
    <Pressable
      className="border border-gray-700 bg-gray-200 px-3 py-2"
      {...props}
    >
      <Text>{title ?? children}</Text>
    </Pressable>
  );
}
