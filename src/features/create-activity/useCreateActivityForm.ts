import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useCreateActivity } from "../../entities/activity/hooks";
import { mapCreateActivityFormToInput } from "../../entities/activity/mappers";
import {
  type CreateActivityForm,
  type CreateActivityFormInput,
  createActivitySchema,
} from "../../entities/activity/schemas";
import { setFormServerError } from "../../shared/lib/setFormServerError";

export function useCreateActivityForm() {
  const router = useRouter();
  const mutation = useCreateActivity();
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
      router.replace(`/manage/${activity.edit_token}`);
    } catch (error) {
      setFormServerError(form.setError, "Не удалось создать активность", error);
    }
  }

  return {
    form,
    submit,
    isSaving: mutation.isPending,
  };
}
