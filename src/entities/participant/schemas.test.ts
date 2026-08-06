import { describe, expect, it } from "vitest";
import { createParticipantSchema } from "./schemas";

describe("participant/schemas", () => {
  it("принимает отклик с обязательным именем и статусом «иду»", () => {
    const result = createParticipantSchema(true).parse({
      name: "Анна",
      status: "going",
    });

    expect(result.status).toBe("going");
    expect(result.telegram).toBeUndefined();
  });

  it("требует непустое имя", () => {
    const bad = createParticipantSchema(true).safeParse({
      name: "   ",
      status: "going",
    });

    expect(bad.success).toBe(false);
  });

  it("при allowMaybe: true принимает статус «может быть»", () => {
    const result = createParticipantSchema(true).safeParse({
      name: "Анна",
      status: "maybe",
    });

    expect(result.success).toBe(true);
  });

  it("при allowMaybe: false отклоняет статус «может быть»", () => {
    const bad = createParticipantSchema(false).safeParse({
      name: "Анна",
      status: "maybe",
    });

    expect(bad.success).toBe(false);
  });
});
