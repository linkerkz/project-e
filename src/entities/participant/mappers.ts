import type { ParticipantForm } from "./schemas";
import type { CreateParticipantInput } from "./types";

export function mapParticipantFormToInput(
  activityId: string,
  form: ParticipantForm,
): CreateParticipantInput {
  return {
    activity_id: activityId,
    ...form,
    telegram: form.telegram || null,
    comment: form.comment || null,
  };
}
