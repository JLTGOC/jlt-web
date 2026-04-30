import { apiClient } from "@/lib/api/client";
import type {
  QuotationsIndexResponse,
  QuotationResource,
  QuotationStatus,
  FetchRequestedQuotationsParams,
  QuotationsResponse,
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


export async function fetchQuotations(
  params: FetchRequestedQuotationsParams,
): Promise<QuotationsResponse> {
  const response = await apiClient.get<{
    data: QuotationsResponse | [];
  }>("/quotations", {
    params: {
      ...(params["filter[status]"]
        ? { "filter[status]": params["filter[status]"] }
        : {}),
      ...(params["filter[assignment_status]"]
        ? { "filter[assignment_status]": params["filter[assignment_status]"] }
        : {}),
      ...(params["filter[created_at]"]
        ? { "filter[created_at]": params["filter[created_at]"] }
        : {}),
      ...(params["filter[service]"]
        ? { "filter[service]": params["filter[service]"] }
        : {}),
      ...(params.search ? { search: params.search } : {}),
      ...(params.as_search ? { as_search: params.as_search } : {}),
      ...(params.client_type ? { client_type: params.client_type } : {}),
      ...(params.per_page ? { per_page: params.per_page } : {}),
      ...(params.my_per_page ? { my_per_page: params.per_page } : {}),
      ...(params.page ? { page: params.page } : {}),
      ...(params.my_page ? { my_page: params.page } : {}),
    },
  });

  if (Array.isArray(response.data.data)) {
    return {
      counts: {
        all_quotations: 0,
        old_user_quotations: 0,
        new_user_quotations: 0,
      },
      quotations: [],
      my_quotations: [],
      pagination: {
        current_page: 0,
        total_pages: 0,
        count: 0,
        per_page: params.per_page ?? 10,
        total: 0,
      },
      my_quotations_pagination: {
        current_page: 0,
        total_pages: 0,
        count: 0,
        per_page: params.per_page ?? 10,
        total: 0,
      },
    };
  }

  return response.data.data;
}


export interface FetchQuotationsParams {
  status: QuotationStatus;
  search?: string;
  perPage?: number;
  clientId?: number;
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
