import { apiClient } from "@/lib/api/client";
import type {
  IssuedQuotationResource,
  QuotationsIndexResponse,
  QuotationResource,
  QuotationStatus,
} from "../types/quotations.types";

export {
  fetchRequestedQuotations,
  acceptQuotation,
  reassignQuotationEnums,
  reassignQuotationSpecificDetails,
  reassignQuotation,
} from "./quotations-api/requested.api";

export {
  fetchRespondedQuotations,
  type FetchRespondedQuotationsParams,
} from "./quotations-api/responded.api";

export { fetchAcceptedQuotations } from "./quotations-api/accepted.api";

export { fetchDiscardedQuotations } from "./quotations-api/discarded.api";

export type ComposeTemplateType = "IMPORT" | "EXPORT" | "BUSINESS SOLUTION";

export interface QuotationTemplateSummaryApi {
  id: number;
  name: string;
  service_type: "REGULATORY" | "LOGISTICS";
  is_active: boolean;
}

export interface DetailsConfigOptionApi {
  id: number;
  name: string;
}

export interface DetailsConfigApi {
  id: number;
  label: string;
  type: "DROPDOWN" | "TEXT" | "DATE PICKER";
  dropdown_options?: DetailsConfigOptionApi[];
}

export interface BillingConfigApi {
  id: number;
  label: string;
  type: "RECEIPT CHARGES" | "CURRENCY" | "UOM";
}

export interface TemplateChargeApi {
  id: number;
  name: string;
  receipt_charge_options: BillingConfigApi[];
}

export interface QuotationTemplateDetailsApi extends QuotationTemplateSummaryApi {
  detail_configs: DetailsConfigApi[];
  template_charges: TemplateChargeApi[];
}

export interface MessageTemplateApi {
  id: number;
  template_name: string;
  message: string;
}

export interface StandardTemplateSummaryApi {
  id: number;
  template_name: string;
}

export interface StandardTemplateApi extends StandardTemplateSummaryApi {
  policies: string;
  terms_and_conditions: string;
  banking_details: string;
  footer: string;
}

export interface QuotationClientInputApi {
  label: string;
  value: string | number | boolean | null;
}

export interface FetchQuotationsParams {
  status: QuotationStatus;
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchQuotations(
  params: FetchQuotationsParams,
): Promise<QuotationsIndexResponse> {
  try {
    const response = await apiClient.get<{ data: QuotationsIndexResponse }>(
      "/quotations",
      {
        params: {
          "filter[status]": params.status,
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return (
      response.data.data || {
        quotations: [],
        pagination: { count: 0, per_page: params.perPage || 10, total: 0 },
      }
    );
  } catch {
    return {
      quotations: [],
      pagination: { count: 0, per_page: params.perPage || 10, total: 0 },
    };
  }
}

export async function fetchQuotation(id: string): Promise<QuotationResource> {
  const response = await apiClient.get<{ data: QuotationResource }>(
    `/quotations/${id}`,
  );
  return response.data.data;
}

export async function updateQuotationAssignee(
  id: string,
  asId: number,
): Promise<QuotationResource> {
  const response = await apiClient.put<{ data: QuotationResource }>(
    `/quotations/${id}/reassign-specialist`,
    {
      as_id: asId,
    },
  );
  return response.data.data;
}

export async function fetchQuotationTemplates(
  type?: ComposeTemplateType,
): Promise<QuotationTemplateSummaryApi[]> {
  const response = await apiClient.get<{ data: QuotationTemplateSummaryApi[] }>(
    "/templates",
    {
      params: {
        ...(type ? { type } : {}),
      },
    },
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchQuotationTemplate(
  templateId: string,
): Promise<QuotationTemplateDetailsApi> {
  const response = await apiClient.get<{ data: QuotationTemplateDetailsApi }>(
    `/templates/${templateId}`,
  );

  return response.data.data;
}

export async function fetchBillingConfigurations(): Promise<
  Record<string, BillingConfigApi[]>
> {
  const response = await apiClient.get<{
    data: Record<string, BillingConfigApi[]>;
  }>("/configs/billing");

  return response.data.data ?? {};
}

export async function fetchMessageTemplates(): Promise<MessageTemplateApi[]> {
  const response = await apiClient.get<{ data: MessageTemplateApi[] }>(
    "/message-templates",
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchStandardTemplates(): Promise<
  StandardTemplateSummaryApi[]
> {
  const response = await apiClient.get<{ data: StandardTemplateSummaryApi[] }>(
    "/configs/standard-templates",
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchStandardTemplate(
  templateId: string,
): Promise<StandardTemplateApi> {
  const response = await apiClient.get<{ data: StandardTemplateApi }>(
    `/configs/standard-templates/${templateId}`,
  );

  return response.data.data;
}

export async function fetchQuotationClientInputs(
  quotationId: string,
  templateId: string,
): Promise<QuotationClientInputApi[]> {
  const parsedTemplateId = Number(templateId);

  if (Number.isNaN(parsedTemplateId)) {
    throw new Error("Invalid template id.");
  }

  const response = await apiClient.get<{ data: QuotationClientInputApi[] }>(
    `/quotations/${quotationId}/client-inputs`,
    {
      params: { template_id: parsedTemplateId },
    },
  );

  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function createIssuedQuotation(
  quotationId: string,
  payload: FormData,
): Promise<IssuedQuotationResource> {
  const response = await apiClient.post<{ data: IssuedQuotationResource }>(
    `/quotations/${quotationId}/issued-quotations`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}

export async function updateIssuedQuotation(
  quotationId: string,
  issuedQuotationId: string,
  payload: FormData,
): Promise<IssuedQuotationResource> {
  const response = await apiClient.post<{ data: IssuedQuotationResource }>(
    `/quotations/${quotationId}/issued-quotations/${issuedQuotationId}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data.data;
}

export async function fetchIssuedQuotation(
  quotationId: string,
  issuedQuotationId: string,
): Promise<IssuedQuotationResource> {
  const response = await apiClient.get<{ data: IssuedQuotationResource }>(
    `/quotations/${quotationId}/issued-quotations/${issuedQuotationId}`,
  );

  return response.data.data;
}
