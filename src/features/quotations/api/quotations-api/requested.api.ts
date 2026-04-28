import { apiClient } from "@/lib/api/client";
import type {
  FetchRequestedQuotationsParams,
  RequestedQuotationsResponse,
  ReassignEnumsResponse,
  ReassignQuotationSpecificDetailsResponse
} from "../../types/quotations.types";

export async function fetchRequestedQuotations(
  params: FetchRequestedQuotationsParams,
): Promise<RequestedQuotationsResponse> {
  const response = await apiClient.get<{
    data: RequestedQuotationsResponse | [];
  }>("/quotations", {
    params: {
      "filter[status]": "REQUESTED",
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
      ...(params.perPage ? { perPage: params.perPage } : {}),
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
        count: 0,
        per_page: params.perPage ?? 10,
        total: 0,
      },
      my_quotations_pagination: {
        count: 0,
        per_page: params.perPage ?? 10,
        total: 0,
      },
    };
  }

  return response.data.data;
}

export async function acceptQuotation(quotationID: number | string): Promise<void> {
  await apiClient.put(`/quotations/${quotationID}/accept-assignment`);
}

export async function reassignQuotation(quotationID: number | string, status: string, as_id: number): Promise<void> {
  await apiClient.put(`/quotations/${quotationID}/reassign-specialist`, {
    status,
    as_id,
  });
}

export async function reassignQuotationSpecificDetails(reassignmentRequest: number | null): Promise<ReassignQuotationSpecificDetailsResponse> {
    const response = await apiClient.get<{data: ReassignQuotationSpecificDetailsResponse}>(
        `/reassignment-requests/${reassignmentRequest}`
    )
    return response.data.data;
}

export async function reassignQuotationEnums(
  as: string,
  ops: string,
  reasons: string,
): Promise<ReassignEnumsResponse> {
  const response = await apiClient.get<{ data: ReassignEnumsResponse }>(
    `/reassignment-requests/enums`,
    { params: { as, ops, reasons } },
  );
  return response.data.data;
}

