import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createParticipant, listParticipants } from "./api";

export const participantKeys = {
  list: (activityId: string) => ["participants", activityId] as const,
};

export function useParticipants(activityId?: string) {
  return useQuery({
    queryKey: participantKeys.list(activityId ?? ""),
    queryFn: () => listParticipants(activityId ?? ""),
    enabled: Boolean(activityId),
  });
}

export function useCreateParticipant(_activityId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createParticipant,
    onSuccess: (_data, variables) =>
      qc.invalidateQueries({
        queryKey: participantKeys.list(variables.activity_id),
      }),
  });
}
