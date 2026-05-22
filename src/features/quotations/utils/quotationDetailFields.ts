import type { CustomField } from "@/features/quotations/types/compose.types";

export const RATE_VALIDITY_FIELD: CustomField = {
  id: "rate_validity",
  label: "Rate Validity",
  type: "date",
};

export function isRateValidityField(field: {
  id: string;
  label: string;
}): boolean {
  return (
    field.id === RATE_VALIDITY_FIELD.id ||
    field.label === RATE_VALIDITY_FIELD.label
  );
}

export function formatQuotationDetailDate(value?: string | null): string {
  if (!value || !value.trim()) {
    return "—";
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return value;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
