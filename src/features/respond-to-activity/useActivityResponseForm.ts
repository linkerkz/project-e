import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { useActivityBySlug } from "../../entities/activity/hooks";
import {
  useCreateParticipant,
  useParticipants,
} from "../../entities/participant/hooks";
import { mapParticipantFormToInput } from "../../entities/participant/mappers";
import {
  type ParticipantForm,
  participantSchema,
} from "../../entities/participant/schemas";
import { getParticipantStats } from "../../entities/participant/utils";
import { getRussianErrorMessage } from "../../shared/errors/getRussianErrorMessage";

export function useActivityResponseForm() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const activityQuery = useActivityBySlug(slug);
  const activity = activityQuery.data;
  const participantsQuery = useParticipants(activity?.id);
  const mutation = useCreateParticipant(activity?.id ?? "");
  const form = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: { name: "", telegram: "", status: "going", comment: "" },
  });

  const participants = participantsQuery.data ?? [];
  const stats = getParticipantStats(participants);

  async function submit(values: ParticipantForm) {
    const currentActivity = activity;
    if (!currentActivity) return;

    try {
      form.clearErrors("root.server");
      await mutation.mutateAsync(
        mapParticipantFormToInput(currentActivity.id, values),
      );
      form.reset({ name: "", telegram: "", status: "going", comment: "" });
    } catch (error) {
      form.setError("root.server", {
        message: getRussianErrorMessage(error, {
          fallback: "Не удалось отправить отклик",
        }),
      });
    }
  }

  return {
    activity,
    activityQuery,
    participants,
    participantsQuery,
    stats,
    form,
    submit,
    mutation,
  };
}
