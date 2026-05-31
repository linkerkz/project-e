import { Text } from "react-native";
import { getParticipantStatusText } from "../../src/entities/participant/utils";
import { ManageActivityForm } from "../../src/features/manage-activity/ManageActivityForm";
import { useManageActivityForm } from "../../src/features/manage-activity/useManageActivityForm";
import { ActivityNotFound } from "../../src/shared/ui/ActivityNotFound";
import { BackLink } from "../../src/shared/ui/BackLink";
import { LoadingPage } from "../../src/shared/ui/LoadingPage";
import { Page } from "../../src/shared/ui/Page";
import { ParticipantList } from "../../src/shared/ui/ParticipantList";

export default function ManagePage() {
  const {
    activity,
    isLoading,
    loadError,
    participants,
    participantsLoading,
    publicUrl,
    form,
    submit,
    toggleStatus,
    isSaving,
  } = useManageActivityForm();

  if (isLoading) return <LoadingPage />;
  if (!activity) return <ActivityNotFound error={loadError} />;

  return (
    <Page>
      <BackLink />
      <Text className="text-2xl font-bold">Управление активностью</Text>
      <Text>Публичная ссылка: {publicUrl}</Text>
      <Text>Копируй и отправляй вручную</Text>
      <ManageActivityForm
        form={form}
        status={activity.status}
        isSaving={isSaving}
        onSubmit={submit}
        onToggleStatus={toggleStatus}
      />
      <ParticipantList
        participants={participants}
        loading={participantsLoading}
        statusText={getParticipantStatusText}
      />
    </Page>
  );
}
