import { Text } from "react-native";
import { LoadingText } from "./LoadingText";

type ParticipantRow = {
  id: string;
  name: string;
  status: string;
  telegram: string | null;
};

type Props = {
  participants: ParticipantRow[];
  loading: boolean;
  statusText: (status: string) => string;
};

export function ParticipantList({ participants, loading, statusText }: Props) {
  return (
    <>
      <Text className="text-xl font-bold">Список участников</Text>
      {loading ? <LoadingText /> : null}
      {participants.length === 0 ? <Text>Откликов пока нет.</Text> : null}
      {participants.map((participant) => (
        <Text key={participant.id}>
          - {participant.name} / {statusText(participant.status)} /{" "}
          {participant.telegram || ""}
        </Text>
      ))}
    </>
  );
}
