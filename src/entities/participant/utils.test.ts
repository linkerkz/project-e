import { describe, expect, it } from "vitest";
import type { Participant } from "./types";
import { getParticipantStats, getParticipantStatusText } from "./utils";

const participants: Participant[] = [
  {
    id: "1",
    activity_id: "a1",
    name: "Анна",
    telegram: null,
    status: "going",
    comment: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "2",
    activity_id: "a1",
    name: "Борис",
    telegram: null,
    status: "maybe",
    comment: null,
    created_at: "",
    updated_at: "",
  },
  {
    id: "3",
    activity_id: "a1",
    name: "Вера",
    telegram: null,
    status: "going",
    comment: null,
    created_at: "",
    updated_at: "",
  },
];

describe("participant/utils", () => {
  it("возвращает русский текст статуса", () => {
    expect(getParticipantStatusText("going")).toBe("иду");
    expect(getParticipantStatusText("maybe")).toBe("может быть");
    expect(getParticipantStatusText("cant")).toBe("не могу");
    expect(getParticipantStatusText("unknown")).toBe("unknown");
  });

  it("возвращает статистику участников", () => {
    expect(getParticipantStats(participants)).toEqual({
      going: 2,
      maybe: 1,
      cant: 0,
    });
  });
});
