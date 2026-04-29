import {
  fetchBillingConfigurations,
  fetchMessageTemplates,
  fetchQuotationClientInputs,
  fetchQuotationTemplate,
  fetchQuotationTemplates,
  fetchStandardTemplate,
  fetchStandardTemplates,
  type ComposeTemplateType,
} from "@/features/quotations/api/quotations-api/compose.api";
import type {
  ClientInformationValue,
  GlobalBillingSettings,
  MessageTemplate,
  QuotationTemplate,
  StandardTemplate,
  StandardTemplateSummary,
} from "@/features/quotations/types/compose.types";
import {
  mapQuotationTemplateDetailToComposeTemplate,
  mapQuotationTemplateSummaryToComposeTemplate,
} from "@/features/quotations/utils/quotationTemplateMapper";

export const composeReferenceQueryKeys = {
  root: () => ["compose-reference"] as const,
  quotationTemplates: (templateType?: ComposeTemplateType) =>
    [
      ...composeReferenceQueryKeys.root(),
      "quotation-templates",
      templateType ?? "all",
    ] as const,
  quotationTemplate: (templateId?: string) =>
    [
      ...composeReferenceQueryKeys.root(),
      "quotation-template",
      templateId,
    ] as const,
  billingSettings: () =>
    [...composeReferenceQueryKeys.root(), "billing-settings"] as const,
  messageTemplates: () =>
    [...composeReferenceQueryKeys.root(), "message-templates"] as const,
  standardTemplates: () =>
    [...composeReferenceQueryKeys.root(), "standard-templates"] as const,
  standardTemplate: (templateId?: string) =>
    [
      ...composeReferenceQueryKeys.root(),
      "standard-template",
      templateId,
    ] as const,
  clientInputs: (quotationId?: string, templateId?: string) =>
    [
      ...composeReferenceQueryKeys.root(),
      "client-inputs",
      quotationId,
      templateId,
    ] as const,
};

export async function fetchComposeQuotationTemplates(
  templateType?: ComposeTemplateType,
): Promise<QuotationTemplate[]> {
  const templates = await fetchQuotationTemplates(templateType);

  return templates.map(mapQuotationTemplateSummaryToComposeTemplate);
}

export async function fetchComposeQuotationTemplate(
  templateId: string,
): Promise<QuotationTemplate> {
  const template = await fetchQuotationTemplate(templateId);

  return mapQuotationTemplateDetailToComposeTemplate(template);
}

export async function fetchComposeBillingSettings(): Promise<GlobalBillingSettings> {
  const data = await fetchBillingConfigurations();

  const receiptCharges = data["RECEIPT CHARGES"] ?? [];
  const currencies = data.CURRENCY ?? [];
  const uoms = data.UOM ?? [];

  return {
    receipt_charges: receiptCharges.map((item) => item.label),
    currencies: currencies.map((item) => item.label),
    uoms: uoms.map((item) => item.label),
  };
}

export async function fetchComposeMessageTemplates(): Promise<
  MessageTemplate[]
> {
  const templates = await fetchMessageTemplates();

  return templates.map((template) => ({
    id: String(template.id),
    label: template.template_name,
    content: template.message,
  }));
}

export async function fetchComposeStandardTemplates(): Promise<
  StandardTemplateSummary[]
> {
  const templates = await fetchStandardTemplates();

  return templates.map((template) => ({
    id: String(template.id),
    name: template.template_name,
  }));
}

export async function fetchComposeStandardTemplate(
  templateId: string,
): Promise<StandardTemplate> {
  const template = await fetchStandardTemplate(templateId);

  return {
    id: String(template.id),
    name: template.template_name,
    policies: template.policies,
    terms_and_condition: template.terms_and_conditions,
    banking_details: template.banking_details,
    footer: template.footer,
  };
}

export async function fetchComposeQuotationClientInputs(
  quotationId: string,
  templateId: string,
): Promise<ClientInformationValue[]> {
  const inputs = await fetchQuotationClientInputs(quotationId, templateId);

  return inputs.map((input) => ({
    label: input.label,
    value: input.value,
  }));
}
