import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  telegram: z.string().optional(),
  status: z.enum(["going", "maybe", "cant"]),
  comment: z.string().optional(),
});

export type ParticipantForm = z.infer<typeof participantSchema>;
