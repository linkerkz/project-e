import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readProfile, removeProfile, writeProfile } from "./storage";

export const profileKeys = {
  all: ["profile"] as const,
};

export function useProfile() {
  return useQuery({ queryKey: profileKeys.all, queryFn: readProfile });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: writeProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}

export function useResetProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeProfile,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: profileKeys.all }),
  });
}
