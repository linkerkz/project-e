import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createParticipant, listParticipants } from "./api";
import { addMyResponse, readMyResponses } from "./local";

export const participantKeys = {
  mine: ["participants", "mine"] as const,
  list: (activityId: string) => ["participants", activityId] as const,
};

export function useParticipants(activityId?: string) {
  return useQuery({
    queryKey: participantKeys.list(activityId ?? ""),
    queryFn: () => listParticipants(activityId ?? ""),
    enabled: Boolean(activityId),
  });
}

export function useMyResponses() {
  return useQuery({ queryKey: participantKeys.mine, queryFn: readMyResponses });
}

export function useTrackMyResponse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addMyResponse,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: participantKeys.mine }),
  });
}

export function useCreateParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createParticipant,
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({
        queryKey: participantKeys.list(variables.activity_id),
      }),
  });
}
