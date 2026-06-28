import { Text } from "react-native";
import { EditProfileForm } from "../../src/features/edit-profile/EditProfileForm";
import { useEditProfileForm } from "../../src/features/edit-profile/useEditProfileForm";
import { BackLink } from "../../src/shared/ui/BackLink";
import { LoadingPage } from "../../src/shared/ui/LoadingPage";
import { Page } from "../../src/shared/ui/Page";

export default function EditProfilePage() {
  const { form, submit, isLoading, isSaving } = useEditProfileForm();

  if (isLoading) return <LoadingPage />;

  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Редактировать профиль</Text>
      <EditProfileForm form={form} isSaving={isSaving} onSubmit={submit} />
    </Page>
  );
}
