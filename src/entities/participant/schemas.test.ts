import { describe, expect, it } from "vitest";
import { participantSchema } from "./schemas";

describe("participant/schemas", () => {
  it("принимает отклик с обязательным именем и статусом «иду»", () => {
    const result = participantSchema.parse({ name: "Анна", status: "going" });

    expect(result.status).toBe("going");
    expect(result.telegram).toBeUndefined();
  });

  it("требует непустое имя", () => {
    const bad = participantSchema.safeParse({ name: "   ", status: "going" });

    expect(bad.success).toBe(false);
  });

  it("разрешает только статус «иду»", () => {
    const bad = participantSchema.safeParse({ name: "Анна", status: "maybe" });

    expect(bad.success).toBe(false);
  });
});
