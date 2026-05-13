import { apiClient } from "@/lib/api/client";

import type {
  FetchJobOrdersParams,
  JobOrdersResponse,
  JobOrderQuotationDetailsResponse,
} from "../types/jobOrder";

export {
  acceptJobOrder,
  reassignRequestJobOrder,
  reassignJobOrder,
  reassignJobOrderDetails,
} from "./operations.api";

export async function fetchJobOrders(
  params: FetchJobOrdersParams,
): Promise<JobOrdersResponse> {
  const response = await apiClient.get<{ data: JobOrdersResponse }>(
    "/job-orders",
    {
      params: {
        ...(params["filter[assignment_status]"]
          ? { "filter[assignment_status]": params["filter[assignment_status]"] }
          : {}),
        ...(params["filter[service]"]
          ? { "filter[service]": params["filter[service]"] }
          : {}),
        ...(params["filter[service_type]"]
          ? { "filter[service_type]": params["filter[service_type]"] }
          : {}),
        ...(params.search ? { search: params.search } : {}),
        ...(params.ops_search ? { ops_search: params.ops_search } : {}),
        // ...(params.client_type ? { client_type: params.client_type } : {}),
        ...(params.per_page ? { per_page: params.per_page } : {}),
        ...(params.my_per_page ? { my_per_page: params.my_per_page } : {}),
        ...(params.page ? { page: params.page } : {}),
        ...(params.my_page ? { my_page: params.my_page } : {}),
      },
    },
  );

  return response.data.data;
}

export async function fetchJobOrderQuotation(
  quotationID: number,
): Promise<JobOrderQuotationDetailsResponse> {
  const response = await apiClient.get<{
    data: JobOrderQuotationDetailsResponse;
  }>(`/job-orders/${quotationID}/quotation`);

  return response.data.data;
}
