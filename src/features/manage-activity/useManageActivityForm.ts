import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useForm } from "react-hook-form";
import {
  useActivityByEditToken,
  useUpdateActivity,
} from "../../entities/activity/hooks";
import {
  mapActivityToUpdateForm,
  mapUpdateActivityFormToInput,
} from "../../entities/activity/mappers";
import {
  type UpdateActivityForm,
  type UpdateActivityFormInput,
  updateActivitySchema,
} from "../../entities/activity/schemas";
import { getNextActivityStatus } from "../../entities/activity/utils";
import { useParticipants } from "../../entities/participant/hooks";
import { buildActivityPublicUrl } from "../../shared/lib/buildActivityPublicUrl";
import { setFormServerError } from "../../shared/lib/setFormServerError";

export function useManageActivityForm() {
  const { editToken } = useLocalSearchParams<{ editToken: string }>();
  const activityQuery = useActivityByEditToken(editToken);
  const activity = activityQuery.data;
  const participantsQuery = useParticipants(activity?.id);
  const mutation = useUpdateActivity();
  const form = useForm<UpdateActivityFormInput, unknown, UpdateActivityForm>({
    resolver: zodResolver(updateActivitySchema),
    values: activity ? mapActivityToUpdateForm(activity) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  const publicUrl = activity ? buildActivityPublicUrl(activity.slug) : "";

  async function submit(values: UpdateActivityForm) {
    if (!activity) return;

    try {
      form.clearErrors("root.server");
      await mutation.mutateAsync({
        id: activity.id,
        input: mapUpdateActivityFormToInput(values),
      });
    } catch (error) {
      setFormServerError(
        form.setError,
        "Не удалось сохранить активность",
        error,
      );
    }
  }

  async function toggleStatus() {
    if (!activity) return;

    const previous = activity.status;
    const next = getNextActivityStatus(previous);
    form.setValue("status", next);
    try {
      form.clearErrors("root.server");
      await mutation.mutateAsync({ id: activity.id, input: { status: next } });
    } catch (error) {
      form.setValue("status", previous);
      setFormServerError(
        form.setError,
        "Не удалось изменить статус активности",
        error,
      );
    }
  }

  return {
    activity,
    isLoading: activityQuery.isLoading,
    loadError: activityQuery.error,
    participants: participantsQuery.data ?? [],
    participantsLoading: participantsQuery.isLoading,
    publicUrl,
    form,
    submit,
    toggleStatus,
    isSaving: mutation.isPending,
  };
}
