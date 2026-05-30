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
import { getRussianErrorMessage } from "../../shared/errors/getRussianErrorMessage";

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
      const row = await mutation.mutateAsync(
        mapCreateActivityFormToInput(values),
      );
      router.replace(`/manage/${row.edit_token}`);
    } catch (error) {
      form.setError("root.server", {
        message: getRussianErrorMessage(error, {
          fallback: "Не удалось создать активность",
        }),
      });
    }
  }

  return {
    form,
    submit,
    mutation,
  };
}
