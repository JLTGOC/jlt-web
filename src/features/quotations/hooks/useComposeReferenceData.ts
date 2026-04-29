import { useQuery } from "@tanstack/react-query";
import {
  fetchComposeBillingSettings,
  fetchComposeQuotationClientInputs,
  fetchComposeMessageTemplates,
  fetchComposeQuotationTemplate,
  fetchComposeQuotationTemplates,
  fetchComposeStandardTemplate,
  fetchComposeStandardTemplates,
  composeReferenceQueryKeys,
} from "@/features/quotations/api/composeReference.api";
import type { ComposeTemplateType } from "@/features/quotations/api/quotations-api/compose.api";

export function useComposeQuotationTemplates(
  templateType?: ComposeTemplateType,
) {
  return useQuery({
    queryKey: composeReferenceQueryKeys.quotationTemplates(templateType),
    queryFn: () => fetchComposeQuotationTemplates(templateType),
    enabled: Boolean(templateType),
  });
}

export function useComposeQuotationTemplate(templateId?: string) {
  return useQuery({
    queryKey: composeReferenceQueryKeys.quotationTemplate(templateId),
    queryFn: () => {
      if (!templateId) {
        throw new Error("Missing template id.");
      }

      return fetchComposeQuotationTemplate(templateId);
    },
    enabled: Boolean(templateId),
  });
}

export function useComposeBillingSettings() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.billingSettings(),
    queryFn: fetchComposeBillingSettings,
  });
}

export function useComposeMessageTemplates() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.messageTemplates(),
    queryFn: fetchComposeMessageTemplates,
  });
}

export function useComposeStandardTemplates() {
  return useQuery({
    queryKey: composeReferenceQueryKeys.standardTemplates(),
    queryFn: fetchComposeStandardTemplates,
  });
}

export function useComposeStandardTemplate(templateId?: string) {
  return useQuery({
    queryKey: composeReferenceQueryKeys.standardTemplate(templateId),
    queryFn: () => {
      if (!templateId) {
        throw new Error("Missing standard template id.");
      }

      return fetchComposeStandardTemplate(templateId);
    },
    enabled: Boolean(templateId),
  });
}

export function useComposeQuotationClientInputs(
  quotationId?: string,
  templateId?: string,
) {
  return useQuery({
    queryKey: composeReferenceQueryKeys.clientInputs(quotationId, templateId),
    queryFn: () => {
      if (!quotationId || !templateId) {
        throw new Error("Missing quotation or template id.");
      }

      return fetchComposeQuotationClientInputs(quotationId, templateId);
    },
    enabled: Boolean(quotationId && templateId),
  });
}
