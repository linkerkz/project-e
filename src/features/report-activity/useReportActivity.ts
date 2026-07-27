import { useState } from "react";
import { useCreateReport } from "../../entities/report/hooks";
import { getRussianErrorMessage } from "../../shared/errors/getRussianErrorMessage";
import { useReportedFlag } from "./useReportedFlag";

export function useReportActivity(activityId?: string) {
  const mutation = useCreateReport();
  const { hasReported, markReported } = useReportedFlag(activityId);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function report() {
    if (activityId == null || hasReported) return;
    setErrorMessage(null);
    try {
      await mutation.mutateAsync({ activity_id: activityId });
      await markReported();
    } catch (error) {
      setErrorMessage(
        getRussianErrorMessage(error, {
          fallback: "Не удалось отправить жалобу. Попробуйте позже.",
        }),
      );
    }
  }

  return {
    hasReported,
    report,
    isReporting: mutation.isPending,
    errorMessage,
  };
}
