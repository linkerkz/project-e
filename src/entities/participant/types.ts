export type ParticipantStatus = "going" | "maybe" | "cant";

export type Participant = {
  id: string;
  activity_id: string;
  name: string;
  telegram: string | null;
  status: ParticipantStatus;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateParticipantInput = {
  activity_id: string;
  name: string;
  telegram?: string | null;
  status: ParticipantStatus;
};
