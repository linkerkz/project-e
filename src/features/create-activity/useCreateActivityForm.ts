import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  useCreateActivity,
  useTrackMyActivity,
} from "../../entities/activity/hooks";
import { mapCreateActivityFormToInput } from "../../entities/activity/mappers";
import {
  type CreateActivityForm,
  type CreateActivityFormInput,
  createActivitySchema,
} from "../../entities/activity/schemas";
import type { Activity } from "../../entities/activity/types";
import { setFormServerError } from "../../shared/lib/setFormServerError";

export function useCreateActivityForm() {
  const router = useRouter();
  const mutation = useCreateActivity();
  const track = useTrackMyActivity();
  const form = useForm<CreateActivityFormInput, unknown, CreateActivityForm>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: {
      title: "",
      description: "",
      city: "",
      location_text: "",
      starts_at: "",
      capacity: null,
      cover_url: "",
    },
  });

  async function submit(values: CreateActivityForm) {
    try {
      form.clearErrors("root.server");
      const activity = await mutation.mutateAsync(
        mapCreateActivityFormToInput(values),
      );
      await rememberCreated(activity);
      router.replace(`/manage/${activity.edit_token}`);
    } catch (error) {
      setFormServerError(form.setError, "Не удалось создать активность", error);
    }
  }

  // Локальный список «Мои ивенты» не критичен: сбой записи не должен ронять
  // успешное создание активности.
  async function rememberCreated(activity: Activity) {
    try {
      await track.mutateAsync(activity);
    } catch {}
  }

  return {
    form,
    submit,
    isSaving: mutation.isPending,
  };
}
