import type { Participant, ParticipantStatus } from "./types";

export const participantStatusLabels: Record<ParticipantStatus, string> = {
  going: "иду",
  maybe: "может быть",
  cant: "не могу",
};

export function getParticipantStatusText(status: string) {
  return isParticipantStatus(status) ? participantStatusLabels[status] : status;
}

export function getParticipantStats(participants: Participant[]) {
  const stats = { going: 0, maybe: 0, cant: 0 };
  for (const { status } of participants) stats[status] += 1;
  return stats;
}

function isParticipantStatus(status: string): status is ParticipantStatus {
  return Object.hasOwn(participantStatusLabels, status);
}
