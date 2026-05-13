import { AxiosError } from "axios";

type FormFieldErrors = Partial<Record<"template_name" | "message", string>>;

interface ApiErrorBody {
  message?: string;
  errors?: Record<string, string[]>;
}

export function parseMessageTemplateErrors(error: unknown): {
  message: string;
  fieldErrors: FormFieldErrors;
} {
  const fallback = {
    message: "Something went wrong. Please try again.",
    fieldErrors: {},
  };

  if (!(error instanceof AxiosError)) {
    return fallback;
  }

  const data = error.response?.data as ApiErrorBody | undefined;
  const validationErrors = data?.errors ?? {};
  const fieldErrors: FormFieldErrors = {
    template_name: validationErrors.template_name?.[0],
    message: validationErrors.message?.[0],
  };

  const errorMessage =
    data?.message ||
    fieldErrors.template_name ||
    fieldErrors.message ||
    fallback.message;

  return {
    message: errorMessage,
    fieldErrors,
  };
}

export type { FormFieldErrors };
