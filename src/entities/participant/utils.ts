import type { Participant } from "./types";

export function getParticipantStatusText(status: string) {
  if (status === "going") return "иду";
  if (status === "maybe") return "может быть";
  if (status === "cant") return "не могу";
  return status;
}

export function countParticipantsByStatus(
  participants: Participant[],
  status: string,
) {
  return participants.filter((participant) => participant.status === status)
    .length;
}

export function getParticipantStats(participants: Participant[]) {
  return {
    going: countParticipantsByStatus(participants, "going"),
    maybe: countParticipantsByStatus(participants, "maybe"),
    cant: countParticipantsByStatus(participants, "cant"),
  };
}
