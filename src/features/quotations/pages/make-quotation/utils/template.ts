import type { ComposeTemplateType } from "@/features/quotations/api/quotations-api/compose.api";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";

export function isTermsComplete(
  terms: TermsValues | null,
): terms is TermsValues {
  if (!terms) return false;
  return [
    terms.template_id,
    terms.template_name,
    terms.policies,
    terms.terms_and_condition,
    terms.banking_details,
    terms.footer,
  ].every((value) => Boolean(value?.trim()));
}

export function resolveTemplateType(
  service?: string,
  serviceType?: string,
): ComposeTemplateType | undefined {
  if (service === "REGULATORY") return "BUSINESS SOLUTION";
  if (serviceType === "IMPORT" || serviceType === "EXPORT") {
    return serviceType;
  }
  return undefined;
}
