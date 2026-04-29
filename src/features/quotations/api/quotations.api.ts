import { apiClient } from "@/lib/api/client";
import type {
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
  reassignRequest
} from "./quotations-api/requested.api";

export {
  fetchRespondedQuotations,
  type FetchRespondedQuotationsParams,
} from "./quotations-api/responded.api";

export { fetchAcceptedQuotations } from "./quotations-api/accepted.api";

export { fetchDiscardedQuotations } from "./quotations-api/discarded.api";

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
