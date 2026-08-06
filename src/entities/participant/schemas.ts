import { z } from "zod";

export function createParticipantSchema(allowMaybe: boolean) {
  return z.object({
    name: z.string().trim().min(1, "Имя обязательно"),
    telegram: z.string().optional(),
    status: allowMaybe ? z.enum(["going", "maybe"]) : z.literal("going"),
  });
}

export type ParticipantForm = {
  name: string;
  telegram?: string;
  status: "going" | "maybe";
};
