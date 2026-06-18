import { apiClient } from "@/lib/api/client";
import type {
  QuotationDocument,
  QuotationResource,
  QuotationStatus,
  FetchRequestedQuotationsParams,
  QuotationsResponse,
} from "../types/quotations.types";

function normalizeQuotationDocument(
  doc: unknown,
  defaultUploadedBy?: "JLTCB" | "Client",
): QuotationDocument | null {
  if (!doc || typeof doc !== "object") return null;

  const typedDoc = doc as Record<string, unknown>;
  const id =
    typeof typedDoc.id === "number"
      ? typedDoc.id
      : typeof typedDoc.id === "string"
        ? Number(typedDoc.id)
        : undefined;
  const file_name =
    typeof typedDoc.file_name === "string" ? typedDoc.file_name : undefined;

  if (id == null || !file_name) return null;

  const file_url =
    typeof typedDoc.file_url === "string" ? typedDoc.file_url : "";
  const uploadedBy =
    typedDoc.uploadedBy === "JLTCB" || typedDoc.uploadedBy === "Client"
      ? typedDoc.uploadedBy
      : defaultUploadedBy;
  const uploadedByUser =
    typeof typedDoc.uploadedBy === "string" ? typedDoc.uploadedBy : undefined;
  const uploadedDate =
    typeof typedDoc.uploadedDate === "string"
      ? typedDoc.uploadedDate
      : typeof typedDoc.created_at === "string"
        ? typedDoc.created_at
        : typeof typedDoc.updated_at === "string"
          ? typedDoc.updated_at
          : undefined;
  const uploaded_by =
    typeof typedDoc.uploaded_by === "number" ? typedDoc.uploaded_by : undefined;
  const file_type =
    typeof typedDoc.file_type === "string" ? typedDoc.file_type : undefined;
  const created_at =
    typeof typedDoc.created_at === "string" ? typedDoc.created_at : undefined;
  const updated_at =
    typeof typedDoc.updated_at === "string" ? typedDoc.updated_at : undefined;

  return {
    id,
    file_name,
    file_url,
    file_type,
    uploadedBy,
    uploadedByUser,
    uploaded_by,
    uploadedDate,
    created_at,
    updated_at,
  };
}

function normalizeQuotationDocuments(
  docs: unknown,
): QuotationDocument[] | "No documents available." {
  if (docs === "No documents available.") {
    return docs;
  }

  if (!Array.isArray(docs)) {
    return [];
  }

  return docs
    .map((doc) => normalizeQuotationDocument(doc, "Client"))
    .filter((document): document is QuotationDocument => document !== null);
}

function normalizeQuotationFiles(
  docs: unknown,
): QuotationDocument[] | "No file available." {
  if (docs === "No file available.") {
    return docs;
  }

  if (!Array.isArray(docs)) {
    return [];
  }

  return docs
    .map((doc) => normalizeQuotationDocument(doc, "JLTCB"))
    .filter((document): document is QuotationDocument => document !== null);
}

export {
  acceptQuotation,
  reassignQuotationEnums,
  reassignQuotationSpecificDetails,
  reassignQuotation,
  reassignRequest,
} from "./quotations-api/requested.api";

export {
  fetchRespondedQuotations,
  type FetchRespondedQuotationsParams,
} from "./quotations-api/responded.api";

export {
  fetchAcceptedQuotations,
  fetchAcceptedFormEnums,
  registerJobOrder,
} from "./quotations-api/accepted.api";

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

export async function fetchQuotation(
  id: string,
  overrideStatus?: "requested" | "responded" | "accepted",
): Promise<QuotationResource> {
  const response = await apiClient.get<{ data: QuotationResource }>(
    `/quotations/${id}`,
  );
  const quotation = response.data.data;

  if (overrideStatus && quotation.qtn_status !== overrideStatus) {
    quotation.qtn_status = overrideStatus;
  }

  quotation.documents = normalizeQuotationDocuments(quotation.documents);
  quotation.quotation_file = normalizeQuotationFiles(quotation.quotation_file);

  return quotation;
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
