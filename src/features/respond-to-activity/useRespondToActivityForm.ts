import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import { useActivityBySlug } from "../../entities/activity/hooks";
import type { Activity } from "../../entities/activity/types";
import {
  useCreateParticipant,
  useParticipants,
  useTrackMyResponse,
} from "../../entities/participant/hooks";
import { mapParticipantFormToInput } from "../../entities/participant/mappers";
import {
  type ParticipantForm,
  participantSchema,
} from "../../entities/participant/schemas";
import { getParticipantStats } from "../../entities/participant/utils";
import { setFormServerError } from "../../shared/lib/setFormServerError";
import { useRespondedFlag } from "./useRespondedFlag";

const emptyResponse: ParticipantForm = {
  name: "",
  telegram: "",
  status: "going",
};

export function useRespondToActivityForm() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const activityQuery = useActivityBySlug(slug);
  const activity = activityQuery.data;
  const participantsQuery = useParticipants(activity?.id);
  const mutation = useCreateParticipant();
  const track = useTrackMyResponse();
  const form = useForm<ParticipantForm>({
    resolver: zodResolver(participantSchema),
    defaultValues: emptyResponse,
  });

  const { hasResponded, markResponded } = useRespondedFlag(activity?.id);

  const participants = participantsQuery.data ?? [];
  const stats = getParticipantStats(participants);

  async function submit(values: ParticipantForm) {
    if (!activity) return;

    try {
      form.clearErrors("root.server");
      await mutation.mutateAsync(
        mapParticipantFormToInput(activity.id, values),
      );
      form.reset(emptyResponse);
      await markResponded();
      await rememberResponse(activity, values.status);
    } catch (error) {
      setFormServerError(form.setError, "Не удалось отправить отклик", error);
    }
  }

  // Локальный список «Посещено» не критичен: сбой записи не должен ронять
  // успешный отклик.
  async function rememberResponse(
    activity: Activity,
    status: ParticipantForm["status"],
  ) {
    try {
      await track.mutateAsync({
        slug: activity.slug,
        title: activity.title,
        city: activity.city,
        startsAt: activity.starts_at,
        status,
      });
    } catch {}
  }

  return {
    activity,
    isLoading: activityQuery.isLoading,
    loadError: activityQuery.error,
    participants,
    participantsLoading: participantsQuery.isLoading,
    stats,
    form,
    submit,
    isSaving: mutation.isPending,
    hasResponded,
  };
}
