import { afterEach, describe, expect, it, vi } from "vitest";

const platform = vi.hoisted(() => ({ OS: "ios" }));

vi.mock("react-native", () => ({ Platform: platform }));

import { buildActivityPublicUrl, buildSeriesPublicUrl } from "./publicUrl";

afterEach(() => {
  platform.OS = "ios";
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("buildActivityPublicUrl", () => {
  it("на нативе берёт канонический origin из env", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://venty.app");

    expect(buildActivityPublicUrl("party")).toBe("https://venty.app/a/party");
  });

  it("завершающий слэш env не даёт двойного слэша", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://venty.app/");

    expect(buildActivityPublicUrl("party")).toBe("https://venty.app/a/party");
  });

  it("на нативе без env отдаёт голый путь", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "");

    expect(buildActivityPublicUrl("party")).toBe("/a/party");
  });

  it("на вебе берёт origin из адресной строки, а не из env", () => {
    platform.OS = "web";
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://venty.app");
    vi.stubGlobal("window", { location: { origin: "https://local.test" } });

    expect(buildActivityPublicUrl("party")).toBe("https://local.test/a/party");
  });
});

describe("buildSeriesPublicUrl", () => {
  it("строит ссылку серии по пути /s", () => {
    vi.stubEnv("EXPO_PUBLIC_WEB_URL", "https://venty.app");

    expect(buildSeriesPublicUrl("yoga")).toBe("https://venty.app/s/yoga");
  });
});
