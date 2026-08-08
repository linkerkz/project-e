import { type Href, Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { type CoverHue, CoverPlaceholder } from "./CoverPlaceholder";
import { Icon } from "./Icon";

export type FeedCardProps = Props;

type Props = {
  href: Href;
  hue: CoverHue;
  coverLabel: string;
  coverUrl?: string | null;
  category: string | null;
  title: string;
  timeText: string;
  place: string;
  badge?: string | null;
  priceLabel?: string | null;
  big?: boolean;
};

export function FeedCard({
  href,
  hue,
  coverLabel,
  coverUrl,
  category,
  title,
  timeText,
  place,
  badge,
  priceLabel,
  big,
}: Props) {
  return (
    <Link href={href} asChild>
      <Pressable className="overflow-hidden rounded-3xl border border-line bg-cream">
        <View className="relative">
          <CoverPlaceholder
            label={coverLabel}
            hue={hue}
            coverUrl={coverUrl}
            big={big}
          />
          {badge != null ? (
            <View className="absolute left-3.5 top-3.5 rounded-2xl bg-ink px-2.5 py-1.5">
              <Text className="font-mono text-[10px] uppercase tracking-widest text-lime">
                {badge}
              </Text>
            </View>
          ) : null}
          {priceLabel != null ? (
            <View className="absolute bottom-3 right-3 rounded-xl bg-paper px-2.5 py-1.5">
              <Text className="font-sans-semibold text-xs text-ink">
                {priceLabel}
              </Text>
            </View>
          ) : null}
        </View>

        <View className="gap-2.5 px-4 pb-4 pt-3.5">
          {category != null ? (
            <Text className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {category}
            </Text>
          ) : null}
          <Text
            className={`font-display tracking-tighter text-ink ${big ? "text-2xl" : "text-lg"}`}
            numberOfLines={2}
          >
            {title}
          </Text>

          <View className="flex-row items-center gap-4">
            <MetaRow icon="clock" text={timeText} />
            <MetaRow icon="pin" text={place} />
          </View>

          <View className="flex-row items-center justify-end gap-1.5">
            <Text className="font-sans-semibold text-xs text-ink">Открыть</Text>
            <Icon name="arrow" size={14} color="#0E0F0B" />
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

function MetaRow({ icon, text }: { icon: "clock" | "pin"; text: string }) {
  return (
    <View className="flex-1 flex-row items-center gap-1.5">
      <Icon name={icon} size={14} color="#6D6960" />
      <Text
        className="flex-1 font-sans text-[13px] text-muted"
        numberOfLines={1}
      >
        {text}
      </Text>
    </View>
  );
}
