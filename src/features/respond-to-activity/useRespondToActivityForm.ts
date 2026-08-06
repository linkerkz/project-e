import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
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
  createParticipantSchema,
  type ParticipantForm,
} from "../../entities/participant/schemas";
import { getParticipantStats } from "../../entities/participant/utils";
import {
  cancelReminder,
  scheduleReminder,
} from "../../entities/reminder/schedule";
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
  const allowMaybe = activity?.allow_maybe ?? true;
  const form = useForm<ParticipantForm>({
    resolver: zodResolver(createParticipantSchema(allowMaybe)),
    defaultValues: emptyResponse,
  });

  const { hasResponded, markResponded } = useRespondedFlag(activity?.id);
  const [reminderScheduled, setReminderScheduled] = useState(false);

  const participants = participantsQuery.data ?? [];
  const stats = getParticipantStats(participants);

  useEffect(() => {
    if (activity?.status !== "cancelled") return;
    cancelReminder(activity.slug).catch(() => {});
  }, [activity?.status, activity?.slug]);

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
      setReminderScheduled(await planReminder(activity));
    } catch (error) {
      setFormServerError(form.setError, "Не удалось отправить отклик", error);
    }
  }

  async function planReminder(activity: Activity) {
    try {
      return await scheduleReminder({
        slug: activity.slug,
        title: activity.title,
        startsAt: activity.starts_at,
      });
    } catch {
      return false;
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
    allowMaybe,
    form,
    submit,
    isSaving: mutation.isPending,
    hasResponded,
    reminderScheduled,
  };
}
