import { Controller, type UseFormReturn } from "react-hook-form";
import { Text, View } from "react-native";
import type {
  ProfileForm,
  ProfileFormInput,
} from "../../entities/profile/schemas";
import { categoryOptions, socialOptions } from "../../entities/profile/utils";
import { Button } from "../../shared/ui/Button";
import { ErrorText } from "../../shared/ui/ErrorText";
import { FormField } from "../../shared/ui/FormField";
import { MultiSelect } from "../../shared/ui/MultiSelect";
import { PhotoPicker } from "../../shared/ui/PhotoPicker";

type Props = {
  form: UseFormReturn<ProfileFormInput, unknown, ProfileForm>;
  isSaving: boolean;
  onSubmit: (values: ProfileForm) => void;
};

export function EditProfileForm({ form, isSaving, onSubmit }: Props) {
  const { control, handleSubmit } = form;
  const { errors } = form.formState;

  return (
    <View className="gap-3 border border-gray-400 p-3">
      <FormField
        control={control}
        name="fullName"
        label="имя, обязательно"
        error={errors.fullName?.message}
      />
      <FormField
        control={control}
        name="city"
        label="город"
        error={errors.city?.message}
      />
      <Controller
        control={control}
        name="photoUrl"
        render={({ field }) => (
          <PhotoPicker
            label="фото"
            value={field.value == null ? "" : String(field.value)}
            onChange={field.onChange}
            error={errors.photoUrl?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="categories"
        render={({ field }) => (
          <MultiSelect
            label="интересы"
            values={field.value ?? []}
            onChange={field.onChange}
            options={categoryOptions}
            error={errors.categories?.message}
          />
        )}
      />
      <Text className="text-xl font-bold">Соцсети</Text>
      {socialOptions.map(({ key, label }) => (
        <FormField
          key={key}
          control={control}
          name={`socials.${key}`}
          label={label}
          error={errors.socials?.[key]?.message}
        />
      ))}
      <Button
        title={isSaving ? "Сохраняем..." : "Сохранить профиль"}
        onPress={handleSubmit(onSubmit)}
        disabled={isSaving}
      />
      <ErrorText>{errors.root?.server?.message}</ErrorText>
    </View>
  );
}
