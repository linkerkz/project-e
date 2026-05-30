import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Platform } from "react-native";
import {
  useActivityByEditToken,
  useUpdateActivity,
} from "../../entities/activity/hooks";
import { mapUpdateActivityFormToInput } from "../../entities/activity/mappers";
import {
  type UpdateActivityForm,
  type UpdateActivityFormInput,
  updateActivitySchema,
} from "../../entities/activity/schemas";
import {
  getNextActivityStatus,
  toDateTimeLocalInputValue,
} from "../../entities/activity/utils";
import { useParticipants } from "../../entities/participant/hooks";
import { getRussianErrorMessage } from "../../shared/errors/getRussianErrorMessage";

export function useManageActivityForm() {
  const { editToken } = useLocalSearchParams<{ editToken: string }>();
  const activityQuery = useActivityByEditToken(editToken);
  const activity = activityQuery.data;
  const participantsQuery = useParticipants(activity?.id);
  const mutation = useUpdateActivity();
  const form = useForm<UpdateActivityFormInput, unknown, UpdateActivityForm>({
    resolver: zodResolver(updateActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      location_text: "",
      starts_at: "",
      capacity: null,
      cover_url: "",
      status: "active",
    },
  });

  const didInit = useRef(false);

  useEffect(() => {
    if (activity && !didInit.current) {
      form.reset({
        title: activity.title,
        description: activity.description ?? "",
        city: activity.city,
        location_text: activity.location_text ?? "",
        starts_at: toDateTimeLocalInputValue(activity.starts_at),
        capacity: activity.capacity,
        cover_url: activity.cover_url ?? "",
        status: activity.status,
      });
      didInit.current = true;
    }
  }, [activity, form.reset]);

  const path = activity ? `/a/${activity.slug}` : "";
  const publicUrl =
    Platform.OS === "web" && typeof window !== "undefined" && path
      ? `${window.location.origin}${path}`
      : path;

  async function submit(values: UpdateActivityForm) {
    const currentActivity = activity;
    if (!currentActivity) return;

    try {
      form.clearErrors("root.server");
      await mutation.mutateAsync({
        id: currentActivity.id,
        input: mapUpdateActivityFormToInput(values),
      });
      await activityQuery.refetch();
    } catch (error) {
      form.setError("root.server", {
        message: getRussianErrorMessage(error, {
          fallback: "Не удалось сохранить активность",
        }),
      });
    }
  }

  function toggleStatus() {
    if (!activity) return;

    const next = getNextActivityStatus(activity.status);
    form.setValue("status", next);
    mutation.mutate(
      { id: activity.id, input: { status: next } },
      {
        onSuccess: () => activityQuery.refetch(),
        onError: (error) => {
          form.setError("root.server", {
            message: getRussianErrorMessage(error, {
              fallback: "Не удалось изменить статус активности",
            }),
          });
        },
      },
    );
  }

  return {
    activity,
    activityQuery,
    participants: participantsQuery.data ?? [],
    participantsQuery,
    publicUrl,
    form,
    submit,
    toggleStatus,
    mutation,
  };
}
