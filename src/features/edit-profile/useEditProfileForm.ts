import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { useProfile, useSaveProfile } from "../../entities/profile/hooks";
import { mapProfileToForm } from "../../entities/profile/mappers";
import {
  type ProfileForm,
  type ProfileFormInput,
  profileSchema,
} from "../../entities/profile/schemas";
import { setFormServerError } from "../../shared/lib/setFormServerError";

const emptyProfile: ProfileFormInput = {
  fullName: "",
  city: "",
  categories: [],
  photoUrl: "",
  socials: {
    telegram: "",
    instagram: "",
    tiktok: "",
    whatsapp: "",
    discord: "",
    website: "",
  },
};

export function useEditProfileForm() {
  const router = useRouter();
  const profileQuery = useProfile();
  const profile = profileQuery.data;
  const mutation = useSaveProfile();
  const form = useForm<ProfileFormInput, unknown, ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyProfile,
    values: profile ? mapProfileToForm(profile) : undefined,
    resetOptions: { keepDirtyValues: true },
  });

  // Провалидированная форма по структуре совпадает с payload сохранения —
  // отдельный маппер не нужен, отдаём значения напрямую в хранилище.
  async function submit(values: ProfileForm) {
    try {
      form.clearErrors("root.server");
      await mutation.mutateAsync(values);
      router.replace("/profile");
    } catch (error) {
      setFormServerError(form.setError, "Не удалось сохранить профиль", error);
    }
  }

  return {
    form,
    submit,
    isLoading: profileQuery.isLoading,
    isSaving: mutation.isPending,
  };
}
