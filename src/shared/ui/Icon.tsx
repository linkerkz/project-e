import { Circle, Path, Rect, Svg } from "react-native-svg";

export type IconName =
  | "feed"
  | "map"
  | "plus"
  | "chat"
  | "profile"
  | "clock"
  | "pin"
  | "arrow"
  | "bolt"
  | "search";

type Props = {
  name: IconName;
  size?: number;
  color?: string;
};

export function Icon({ name, size = 22, color = "#0E0F0B" }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {glyph(name, color)}
    </Svg>
  );
}

function glyph(name: IconName, c: string) {
  const stroke = { stroke: c, strokeWidth: 2 } as const;
  const round = { strokeLinecap: "round", strokeLinejoin: "round" } as const;

  switch (name) {
    case "feed":
      return (
        <>
          <Rect x="3" y="4" width="18" height="4" rx="1.5" {...stroke} />
          <Rect x="3" y="11" width="18" height="4" rx="1.5" {...stroke} />
          <Rect x="3" y="18" width="11" height="2.5" rx="1.2" fill={c} />
        </>
      );
    case "map":
      return (
        <>
          <Path
            d="M3 6L9 4L15 6L21 4V18L15 20L9 18L3 20V6Z"
            {...stroke}
            {...round}
          />
          <Path d="M9 4V18M15 6V20" {...stroke} />
        </>
      );
    case "plus":
      return (
        <Path d="M12 5V19M5 12H19" stroke={c} strokeWidth={2.5} {...round} />
      );
    case "chat":
      return (
        <Path
          d="M4 6C4 4.9 4.9 4 6 4H18C19.1 4 20 4.9 20 6V14C20 15.1 19.1 16 18 16H8L4 20V6Z"
          {...stroke}
          {...round}
        />
      );
    case "profile":
      return (
        <>
          <Circle cx="12" cy="8" r="4" {...stroke} />
          <Path
            d="M4 21C4 16.6 7.6 13 12 13C16.4 13 20 16.6 20 21"
            {...stroke}
            {...round}
          />
        </>
      );
    case "clock":
      return (
        <>
          <Circle cx="12" cy="12" r="9" {...stroke} />
          <Path d="M12 7V12L15 14" {...stroke} {...round} />
        </>
      );
    case "pin":
      return (
        <>
          <Path
            d="M12 22S4 14 4 9C4 4.6 7.6 1 12 1C16.4 1 20 4.6 20 9C20 14 12 22 12 22Z"
            {...stroke}
          />
          <Circle cx="12" cy="9" r="3" fill={c} />
        </>
      );
    case "arrow":
      return (
        <Path d="M5 12H19M19 12L13 6M19 12L13 18" {...stroke} {...round} />
      );
    case "bolt":
      return <Path d="M13 2L4 14H11L10 22L20 9H12L13 2Z" fill={c} />;
    case "search":
      return (
        <>
          <Circle cx="11" cy="11" r="7" {...stroke} />
          <Path d="M16 16L21 21" {...stroke} {...round} />
        </>
      );
  }
}
