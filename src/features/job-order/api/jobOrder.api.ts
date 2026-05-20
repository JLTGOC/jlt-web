import { apiClient } from "@/lib/api/client";

import type {
  FetchJobOrdersParams,
  JobOrdersResponse,
  JobOrderQuotationDetailsResponse,
} from "../types/jobOrder";
import type { JobOrderDocument } from "../types/jobOrderDetail";
import { fetchJobOrderDetail } from "./jobOrderQueries.api";

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
  jobOrderId: number | string,
): Promise<JobOrderQuotationDetailsResponse> {
  const response = await apiClient.get<{
    data: JobOrderQuotationDetailsResponse;
  }>(`/job-orders/${jobOrderId}/quotation`);

  return response.data.data;
}

type QuotationFilesIndexResponse = {
  proposal_files?: Array<{
    id: number | string;
    file_name: string;
    file_url: string;
    file_type: string;
    created_at: string;
    updated_at: string;
  }>;
  requested_files?: Array<{
    id: number | string;
    file_name: string;
    file_url: string;
    file_type: string;
    created_at: string;
    updated_at: string;
  }>;
};

function mapQuotationFileToJobOrderDocument(
  file: NonNullable<QuotationFilesIndexResponse["proposal_files"]>[number],
  uploadedBy: "Client" | "JLTCB",
): JobOrderDocument {
  return {
    id: file.id,
    file_name: file.file_name,
    file_url: file.file_url,
    file_type: file.file_type,
    created_at: file.created_at,
    updated_at: file.updated_at,
    uploadedBy,
    uploadedByUser: uploadedBy,
    uploadedDate: file.created_at,
  };
}

function mapQuotationFilesToDocuments(
  files: NonNullable<QuotationFilesIndexResponse["proposal_files"]>,
  uploadedBy: "Client" | "JLTCB",
): JobOrderDocument[] {
  return files.map((file) =>
    mapQuotationFileToJobOrderDocument(file, uploadedBy),
  );
}

export async function fetchJobOrderDocuments(
  jobOrderId: number | string,
): Promise<JobOrderDocument[]> {
  const jobOrderDetail = await fetchJobOrderDetail(jobOrderId);
  const quotationId = jobOrderDetail.quotation_id;

  if (!quotationId) {
    return [];
  }

  const response = await apiClient.get<{
    data: QuotationFilesIndexResponse | string;
  }>(`/quotations/${quotationId}/files`);

  if (typeof response.data.data === "string") {
    return [];
  }

  return [
    ...mapQuotationFilesToDocuments(
      response.data.data.requested_files ?? [],
      "Client",
    ),
    ...mapQuotationFilesToDocuments(
      response.data.data.proposal_files ?? [],
      "JLTCB",
    ),
  ];
}
