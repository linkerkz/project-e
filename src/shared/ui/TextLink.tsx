import { Link } from "expo-router";
import type { ComponentProps } from "react";
import { Text } from "react-native";
import { blurActiveElement } from "../lib/blurActiveElement";

type Props = {
  href: ComponentProps<typeof Link>["href"];
  children: string;
};

export function TextLink({ href, children }: Props) {
  return (
    <Link href={href} asChild onPress={blurActiveElement}>
      <Text className="text-blue-700 underline">{children}</Text>
    </Link>
  );
}
