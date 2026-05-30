import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import type { ComponentType } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text } from "react-native";
import { useCreateActivity } from "../src/entities/activity/hooks";
import {
  type CreateActivityForm,
  type CreateActivityFormInput,
  createActivitySchema,
} from "../src/entities/activity/schemas";
import {
  generateActivitySlug,
  generateEditToken,
  toIsoDate,
} from "../src/entities/activity/utils";
import { Button } from "../src/shared/ui/Button";
import { ErrorText } from "../src/shared/ui/ErrorText";
import { Input, type InputProps } from "../src/shared/ui/Input";
import { Page } from "../src/shared/ui/Page";
import { Textarea } from "../src/shared/ui/Textarea";
import { BackLink } from "./_layout";

export default function CreatePage() {
  const router = useRouter();
  const m = useCreateActivity();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateActivityFormInput, unknown, CreateActivityForm>({
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
  async function submit(v: CreateActivityForm) {
    const row = await m.mutateAsync({
      ...v,
      description: v.description || null,
      location_text: v.location_text || null,
      cover_url: v.cover_url || null,
      capacity: v.capacity ?? null,
      starts_at: toIsoDate(v.starts_at),
      slug: generateActivitySlug(v.title),
      edit_token: generateEditToken(),
      status: "active",
    });
    router.replace(`/manage/${row.edit_token}`);
  }
  const field = (
    name: keyof CreateActivityForm,
    label: string,
    C: ComponentType<InputProps> = Input,
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <C
          label={label}
          value={field.value == null ? "" : String(field.value)}
          onChangeText={field.onChange}
          error={(errors[name]?.message as string) || ""}
        />
      )}
    />
  );
  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Создать активность</Text>
      {field("title", "название, обязательно")}
      {field("description", "описание", Textarea)}
      {field("city", "город, обязательно")}
      {field("location_text", "место текстом")}
      {field("starts_at", "дата и время, обязательно")}
      {field("capacity", "лимит мест, число или пусто")}
      {field("cover_url", "ссылка на обложку")}
      <Button
        title={m.isPending ? "Сохраняем..." : "Создать"}
        onPress={handleSubmit(submit)}
      />
      <ErrorText>{m.error instanceof Error ? m.error.message : null}</ErrorText>
    </Page>
  );
}
