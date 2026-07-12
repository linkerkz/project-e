import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { readReminderSettings, writeReminderSettings } from "./settings";

export const reminderKeys = {
  settings: ["reminder-settings"] as const,
};

export function useReminderSettings() {
  return useQuery({
    queryKey: reminderKeys.settings,
    queryFn: readReminderSettings,
  });
}

export function useSaveReminderSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: writeReminderSettings,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: reminderKeys.settings }),
  });
}
