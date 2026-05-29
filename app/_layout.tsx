import "../global.css";

import { Link, Stack } from "expo-router";
import { Text, View } from "react-native";

export const SITE_PAGES = [
  { href: "/", label: "Home" },
  { href: "/create", label: "Create" },
  { href: "/a/welcome", label: "Welcome article" },
  { href: "/a/supabase", label: "Supabase article" },
] as const;

const linkClassName = "text-base text-blue-600 underline";

export function PageLinks() {
  return (
    <View className="flex-row flex-wrap gap-3">
      {SITE_PAGES.map((page) => (
        <Link key={page.href} href={page.href} asChild>
          <Text className={linkClassName}>{page.label}</Text>
        </Link>
      ))}
    </View>
  );
}

export function BackLink() {
  return (
    <Link href="/" asChild>
      <Text className="mb-4 text-base text-blue-600 underline">← Back to all pages</Text>
    </Link>
  );
}

export default function RootLayout() {
  return (
    <>
      <View className="gap-3 border-b border-gray-200 bg-white px-5 pb-4 pt-6">
        <Text className="text-3xl font-bold text-gray-950">Venty</Text>
        <PageLinks />
      </View>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
