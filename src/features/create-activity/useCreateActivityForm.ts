import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  useActivityByEditToken,
  useCreateActivity,
  useTrackMyActivity,
} from "../../entities/activity/hooks";
import {
  mapActivityToDuplicateForm,
  mapCreateActivityFormToInput,
} from "../../entities/activity/mappers";
import {
  type CreateActivityForm,
  type CreateActivityFormInput,
  createActivitySchema,
} from "../../entities/activity/schemas";
import type { Activity } from "../../entities/activity/types";
import { telegramToChatUrl } from "../../entities/activity/utils";
import { useProfile } from "../../entities/profile/hooks";
import type { Profile } from "../../entities/profile/types";
import { setFormServerError } from "../../shared/lib/setFormServerError";

const emptyForm: CreateActivityFormInput = {
  title: "",
  description: "",
  city: "",
  location_text: "",
  starts_at: "",
  capacity: null,
  cover_url: "",
  chat_url: "",
  category: "",
  allow_maybe: true,
};

export function useCreateActivityForm(duplicateFrom?: string) {
  const router = useRouter();
  const mutation = useCreateActivity();
  const track = useTrackMyActivity();
  const { data: profile } = useProfile();
  const duplicateSourceQuery = useActivityByEditToken(duplicateFrom);
  // Профиль и (при дублировании) источник грузятся асинхронно, поэтому через
  // `values`; keepDirtyValues не затирает то, что организатор уже ввёл вручную.
  const prefill = buildPrefill({
    profile,
    duplicateFrom,
    duplicateSource: duplicateSourceQuery.data,
  });
  const form = useForm<CreateActivityFormInput, unknown, CreateActivityForm>({
    resolver: zodResolver(createActivitySchema),
    defaultValues: emptyForm,
    values: prefill,
    resetOptions: { keepDirtyValues: true },
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

type PrefillParams = {
  profile: Profile | null | undefined;
  duplicateFrom: string | undefined;
  duplicateSource: Activity | null | undefined;
};

// Дублирование ждёт загрузки источника — иначе форма мигнёт пустыми полями
// перед подстановкой данных. Источник не найден (битый/чужой edit_token) —
// тихий откат к обычному пустому созданию, не блокируем сценарий с нуля.
function buildPrefill({
  profile,
  duplicateFrom,
  duplicateSource,
}: PrefillParams) {
  if (duplicateFrom && duplicateSource === undefined) return undefined;

  if (duplicateFrom && duplicateSource) {
    const chatUrl =
      duplicateSource.chat_url ?? telegramToChatUrl(profile?.socials.telegram);
    return {
      ...mapActivityToDuplicateForm(duplicateSource),
      chat_url: chatUrl,
    };
  }

  // Тир 1: чат у организатора обычно один на все встречи — дефолтим ссылку
  // из Telegram профиля.
  return profile
    ? { ...emptyForm, chat_url: telegramToChatUrl(profile.socials.telegram) }
    : undefined;
}
