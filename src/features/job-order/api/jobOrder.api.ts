import { apiClient } from "@/lib/api/client";

import type { FetchJobOrdersParams } from "../types/jobOrder";

export async function fetchJobOrders(
  params: FetchJobOrdersParams,
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