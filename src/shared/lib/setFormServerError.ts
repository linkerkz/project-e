import type { FieldValues, UseFormSetError } from "react-hook-form";
import { getRussianErrorMessage } from "../errors/getRussianErrorMessage";

export function setFormServerError<T extends FieldValues>(
  setError: UseFormSetError<T>,
  fallback: string,
  error: unknown,
) {
  setError("root.server", {
    message: getRussianErrorMessage(error, { fallback }),
  });
}
