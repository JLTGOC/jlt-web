import { apiClient } from "@/lib/api/client";
import type { JobOrderListItem } from "../types/jobOrder";
import type { JobOrderDetail } from "../types/jobOrderDetail";

export interface FetchJobOrdersParams {
  search?: string;
  ops_search?: string;
  "filter[service]"?: string;
  "filter[service_type]"?: string;
  "filter[assignment_status]"?: string;
  perPage?: number;
  page?: number;
}

type JobOrderListApiItem = {
  id: number | string;
  reference_number: string;
  client_full_name?: string;
  client?: string;
  client_type?: "OLD" | "NEW";
  created_at?: string;
  date_created?: string;
  service?: "Logistics" | "Regulatory";
  job_type?: "LOGISTICS" | "REGULATORY";
  commodity?: string;
  service_type?: string;
  transport_mode?: string;
  origin?: string;
  destination?: string;
  service_level?: string | null;
  bl_no?: string | null;
  eta?: string | null;
  etd?: string | null;
  quotation_id?: number | string;
  quotation_reference_number?: string;
  quotation_reference?: string;
  assignment_status?: string;
  status?: "Accepted" | "Pending";
  assigned_to?: string | null;
  ops_image?: string | null;
  application_type?: string;
  regulatory_assistance?: string;
};

type JobOrderListPagination = {
  current_page?: number;
  total_pages?: number;
  count?: number;
  per_page?: number;
  total?: number;
};

type JobOrderListWrappedData = {
  job_orders?: JobOrderListApiItem[];
  pagination?: JobOrderListPagination;
  counts?: {
    all_job_orders?: number;
    new_user_job_orders?: number;
    old_user_job_orders?: number;
  };
};

type JobOrderListResponse = {
  data?: JobOrderListWrappedData | JobOrderListApiItem[];
};

type JobOrderListResult = {
  jobOrders: JobOrderListItem[];
  pagination?: JobOrderListPagination;
  counts?: JobOrderListWrappedData["counts"];
};

function mapAssignmentStatus(status?: string) {
  if (status === "Accepted" || status === "Pending") return status;
  if (status === "ASSIGNED") return "Accepted";
  return "Pending";
}

function mapService(jobType?: string) {
  if (jobType === "Logistics" || jobType === "Regulatory") return jobType;
  return jobType === "REGULATORY" ? "Regulatory" : "Logistics";
}

function mapJobOrderListItem(item: JobOrderListApiItem): JobOrderListItem {
  const service = mapService(item.job_type);
  const status = mapAssignmentStatus(item.assignment_status);

  return {
    id: item.id,
    reference_number: item.reference_number,
    client: item.client ?? "",
    created_at: item.created_at ?? item.date_created ?? "",
    assignment_status: status,
    service: item.service ?? service,
    trade_type:
      item.service_type === "IMPORT" || item.service_type === "EXPORT"
        ? item.service_type === "IMPORT"
          ? "Import"
          : "Export"
        : undefined,
    status,
    logistics_service:
      service === "Logistics"
        ? {
            BL: item.bl_no ?? undefined,
            commodity: item.commodity ?? "",
            transport_mode: item.transport_mode ?? "",
            origin: item.origin ?? "",
            destination: item.destination ?? "",
            service_level: item.service_level ?? undefined,
            eta: item.eta ?? undefined,
            etd: item.etd ?? undefined,
          }
        : undefined,
    regulatory_service:
      service === "Regulatory"
        ? {
            application_type: item.application_type ?? "",
            regulatory_assistance: item.regulatory_assistance ?? undefined,
            client_type: item.client_type,
          }
        : undefined,
    person_in_charge: item.assigned_to
      ? {
          name: item.assigned_to,
          avatar_url: item.ops_image ?? undefined,
        }
      : undefined,
    quotation_reference:
      item.quotation_reference ?? item.quotation_reference_number,
    quotation_id: item.quotation_id,
  };
}

function mapJobOrderList(items: JobOrderListApiItem[]): JobOrderListItem[] {
  return items.map(mapJobOrderListItem);
}

export async function fetchJobOrders(
  params: FetchJobOrdersParams,
): Promise<JobOrderListResult> {
  const response = await apiClient.get<JobOrderListResponse>("/job-orders", {
    params: {
      ...(params.search ? { search: params.search } : {}),
      ...(params.ops_search ? { ops_search: params.ops_search } : {}),
      ...(params["filter[service]"]
        ? { "filter[service]": params["filter[service]"] }
        : {}),
      ...(params["filter[service_type]"]
        ? { "filter[service_type]": params["filter[service_type]"] }
        : {}),
      ...(params["filter[assignment_status]"]
        ? { "filter[assignment_status]": params["filter[assignment_status]"] }
        : {}),
      ...(params.perPage ? { per_page: params.perPage } : {}),
      ...(params.page ? { page: params.page } : {}),
    },
  });

  // Backend may return a wrapped response similar to quotations API
  if (!response || !response.data) {
    return { jobOrders: [], pagination: {} };
  }

  // Try to return a normalized shape when possible
  if (
    response.data.data &&
    !Array.isArray(response.data.data) &&
    Array.isArray(response.data.data.job_orders)
  ) {
    return {
      jobOrders: mapJobOrderList(
        response.data.data.job_orders as JobOrderListApiItem[],
      ),
      pagination: response.data.data.pagination,
      counts: response.data.data.counts,
    };
  }

  // Fallback: if API returns a plain array
  if (Array.isArray(response.data.data)) {
    return {
      jobOrders: mapJobOrderList(response.data.data as JobOrderListApiItem[]),
    };
  }

  return { jobOrders: [], pagination: {} };
}

export async function fetchAllJobOrders(
  params: Omit<FetchJobOrdersParams, "page" | "perPage"> & {
    perPage?: number;
  } = {},
): Promise<{ jobOrders: JobOrderListItem[] }> {
  const perPage = Math.min(params.perPage ?? 100, 100);
  let page = 1;
  let totalPages = 1;
  const allJobOrders: JobOrderListItem[] = [];

  do {
    const response = await fetchJobOrders({
      ...params,
      perPage,
      page,
    });

    const pageOrders = response?.jobOrders ?? [];
    allJobOrders.push(...pageOrders);

    totalPages = response?.pagination?.total_pages ?? 1;
    page += 1;
  } while (page <= totalPages);

  return { jobOrders: allJobOrders };
}

export async function fetchJobOrderDetail(
  jobOrderId: number | string,
): Promise<JobOrderDetail> {
  const response = await apiClient.get<{ data: unknown }>(
    `/job-orders/${jobOrderId}`,
  );

  if (!response || !response.data) {
    throw new Error("Failed to fetch job order detail.");
  }

  return response.data.data as JobOrderDetail;
}
