import { Image, Text, View } from "react-native";
import { Defs, Line, Pattern, Rect, Svg } from "react-native-svg";

export type CoverHue = "lime" | "coral" | "ink" | "cream";

type Props = {
  label: string;
  hue: CoverHue;
  coverUrl?: string | null;
  big?: boolean;
};

export function CoverPlaceholder({ label, hue, coverUrl, big }: Props) {
  const height = big ? "h-52" : "h-36";

  if (coverUrl != null) {
    return <Image source={{ uri: coverUrl }} className={`w-full ${height}`} />;
  }

  const { bg, fg, mono, stripe } = palette[hue];
  return (
    <View className={`w-full ${height} justify-end overflow-hidden ${bg} p-4`}>
      <DiagonalStripes color={stripe} />
      <Text
        className={`absolute left-4 top-3.5 font-mono text-[10px] uppercase tracking-widest ${mono}`}
      >
        ◢ Cover · {label}
      </Text>
      <Text
        className={`font-display text-2xl tracking-tighter ${fg}`}
        numberOfLines={2}
      >
        {label}
      </Text>
    </View>
  );
}

// Диагональная штриховка обложки-заглушки — фирменный приём макета. Тонкие
// параллельные линии под 45° тайлятся паттерном без разрывов на любой ширине.
function DiagonalStripes({ color }: { color: string }) {
  const tile = 15;
  return (
    <Svg className="absolute inset-0 h-full w-full">
      <Defs>
        <Pattern
          id="cover-stripes"
          width={tile}
          height={tile}
          patternUnits="userSpaceOnUse"
        >
          <Line
            x1={0}
            y1={tile}
            x2={tile}
            y2={0}
            stroke={color}
            strokeWidth={1.5}
          />
        </Pattern>
      </Defs>
      <Rect width="100%" height="100%" fill="url(#cover-stripes)" />
    </Svg>
  );
}

const palette: Record<
  CoverHue,
  { bg: string; fg: string; mono: string; stripe: string }
> = {
  lime: {
    bg: "bg-lime",
    fg: "text-ink",
    mono: "text-ink/60",
    stripe: "rgba(14,15,11,0.13)",
  },
  coral: {
    bg: "bg-coral",
    fg: "text-ink",
    mono: "text-ink/60",
    stripe: "rgba(14,15,11,0.13)",
  },
  ink: {
    bg: "bg-ink",
    fg: "text-lime",
    mono: "text-lime/60",
    stripe: "rgba(206,255,61,0.13)",
  },
  cream: {
    bg: "bg-cream-deep",
    fg: "text-ink",
    mono: "text-ink/50",
    stripe: "rgba(14,15,11,0.08)",
  },
};
