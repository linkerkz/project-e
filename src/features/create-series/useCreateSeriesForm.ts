import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { telegramToChatUrl } from "../../entities/activity/utils";
import { useProfile } from "../../entities/profile/hooks";
import { useCreateSeries, useTrackMySeries } from "../../entities/series/hooks";
import { mapCreateSeriesFormToInput } from "../../entities/series/mappers";
import {
  type CreateSeriesForm,
  type CreateSeriesFormInput,
  createSeriesSchema,
} from "../../entities/series/schemas";
import type { Series } from "../../entities/series/types";
import { setFormServerError } from "../../shared/lib/setFormServerError";

const emptyForm: CreateSeriesFormInput = {
  title: "",
  description: "",
  city: "",
  location_text: "",
  starts_at: "",
  capacity: null,
  cover_url: "",
  chat_url: "",
  recurrence: {
    interval: 1,
    unit: "week",
    weekdays: [],
    end: { kind: "never" },
  },
};

export function useCreateSeriesForm() {
  const router = useRouter();
  const mutation = useCreateSeries();
  const track = useTrackMySeries();
  const { data: profile } = useProfile();
  // Тир 1: чат обычно один на всю серию — дефолтим ссылку из Telegram профиля.
  // Профиль грузится асинхронно (через `values`), keepDirtyValues не затирает ввод.
  const prefill = profile
    ? { ...emptyForm, chat_url: telegramToChatUrl(profile.socials.telegram) }
    : undefined;
  const form = useForm<CreateSeriesFormInput, unknown, CreateSeriesForm>({
    resolver: zodResolver(createSeriesSchema),
    defaultValues: emptyForm,
    values: prefill,
    resetOptions: { keepDirtyValues: true },
  });

  async function submit(values: CreateSeriesForm) {
    try {
      form.clearErrors("root.server");
      const series = await mutation.mutateAsync(
        mapCreateSeriesFormToInput(values),
      );
      await rememberCreated(series);
      router.replace(`/manage/series/${series.edit_token}`);
    } catch (error) {
      setFormServerError(form.setError, "Не удалось создать серию", error);
    }
  }

  // Локальный список «Мои ивенты» не критичен: сбой записи не должен ронять
  // успешное создание серии.
  async function rememberCreated(series: Series) {
    try {
      await track.mutateAsync(series);
    } catch {}
  }

  return {
    form,
    submit,
    isSaving: mutation.isPending,
  };
}
