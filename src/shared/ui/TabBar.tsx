import { type Href, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Icon, type IconName } from "./Icon";

type Tab = "feed" | "map" | "plus" | "chat" | "profile";

type Props = {
  active: Tab;
};

type Item = { tab: Tab; icon: IconName; href: Href | null };

// Карта и чат — экранов ещё нет, поэтому их вкладки не ведут никуда.
const items: Item[] = [
  { tab: "feed", icon: "feed", href: "/" },
  { tab: "map", icon: "map", href: null },
  { tab: "plus", icon: "plus", href: "/create" },
  { tab: "chat", icon: "chat", href: null },
  { tab: "profile", icon: "profile", href: "/profile" },
];

export function TabBar({ active }: Props) {
  const router = useRouter();

  return (
    <View className="absolute inset-x-3 bottom-5 h-16 flex-row items-center justify-around rounded-full border border-line bg-cream px-4 shadow-lg">
      {items.map((item) =>
        item.icon === "plus" ? (
          <PlusButton key={item.tab} href={item.href} router={router} />
        ) : (
          <TabButton
            key={item.tab}
            item={item}
            active={item.tab === active}
            router={router}
          />
        ),
      )}
    </View>
  );
}

type Router = ReturnType<typeof useRouter>;

function TabButton({
  item,
  active,
  router,
}: {
  item: Item;
  active: boolean;
  router: Router;
}) {
  const color = active ? "#0E0F0B" : "#6D6960";

  return (
    <Pressable
      disabled={item.href == null}
      onPress={() => item.href != null && router.push(item.href)}
      className="h-11 w-11 items-center justify-center"
    >
      <Icon name={item.icon} color={color} />
      {active ? (
        <View className="absolute bottom-1.5 h-1 w-1 rounded-full bg-lime" />
      ) : null}
    </Pressable>
  );
}

function PlusButton({ href, router }: { href: Href | null; router: Router }) {
  return (
    <Pressable
      disabled={href == null}
      onPress={() => href != null && router.push(href)}
      className="h-12 w-12 items-center justify-center rounded-full bg-lime"
    >
      <Icon name="plus" color="#0E0F0B" />
    </Pressable>
  );
}
