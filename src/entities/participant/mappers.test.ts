import { describe, expect, it } from "vitest";
import { mapParticipantFormToInput } from "./mappers";

describe("participant/mappers", () => {
  it("преобразует форму отклика в payload для API", () => {
    expect(
      mapParticipantFormToInput("activity-1", {
        name: "Анна",
        telegram: "",
        status: "going",
      }),
    ).toEqual({
      activity_id: "activity-1",
      name: "Анна",
      telegram: null,
      status: "going",
    });
  });

  it("сохраняет заполненные необязательные поля", () => {
    expect(
      mapParticipantFormToInput("activity-1", {
        name: "Анна",
        telegram: "@anna",
        status: "going",
      }),
    ).toEqual({
      activity_id: "activity-1",
      name: "Анна",
      telegram: "@anna",
      status: "going",
    });
  });
});
