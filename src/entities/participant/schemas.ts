import { z } from "zod";

export const participantSchema = z.object({
  name: z.string().trim().min(1, "Имя обязательно"),
  telegram: z.string().optional(),
  status: z.literal("going"),
});

export type ParticipantForm = z.infer<typeof participantSchema>;
