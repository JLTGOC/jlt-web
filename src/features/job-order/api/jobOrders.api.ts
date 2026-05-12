import { apiClient } from "@/lib/api/client";
import type { JobOrderListItem } from "../types/jobOrder";

export interface FetchJobOrdersParams {
  search?: string;
  "filter[service]"?: string;
  "filter[trade_type]"?: string;
  "filter[person_in_charge]"?: string;
  "filter[status]"?: string;
  perPage?: number;
  page?: number;
}

export async function fetchJobOrders(
  params: FetchJobOrdersParams,
): Promise<{ jobOrders: JobOrderListItem[]; pagination?: any } | any> {
  const response = await apiClient.get<{ data: any }>("/job-orders", {
    params: {
      ...(params.search ? { search: params.search } : {}),
      ...(params["filter[service]"]
        ? { "filter[service]": params["filter[service]"] }
        : {}),
      ...(params["filter[trade_type]"]
        ? { "filter[trade_type]": params["filter[trade_type]"] }
        : {}),
      ...(params["filter[person_in_charge]"]
        ? { "filter[person_in_charge]": params["filter[person_in_charge]"] }
        : {}),
      ...(params["filter[status]"]
        ? { "filter[status]": params["filter[status]"] }
        : {}),
      ...(params.perPage ? { perPage: params.perPage } : {}),
      ...(params.page ? { page: params.page } : {}),
    },
  });

  // Backend may return a wrapped response similar to quotations API
  if (!response || !response.data) return { jobOrders: [], pagination: {} };

  // Try to return a normalized shape when possible
  if (response.data.data && Array.isArray(response.data.data.job_orders)) {
    return {
      jobOrders: response.data.data.job_orders as JobOrderListItem[],
      pagination: response.data.data.pagination,
    };
  }

  // Fallback: if API returns a plain array
  if (Array.isArray(response.data.data)) {
    return { jobOrders: response.data.data as JobOrderListItem[] };
  }

  return response.data.data;
}
