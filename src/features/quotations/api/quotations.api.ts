import { apiClient } from "@/lib/api/client";
import type {
  QuotationsIndexResponse,
  QuotationDocument,
  QuotationResource,
  QuotationStatus,
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
  const uploadedByUser = typeof typedDoc.uploadedBy === "string" ? typedDoc.uploadedBy : undefined;
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
      pagination: {
        count: 0,
        per_page: params.perPage || 10,
        total: 0,
        current_page: 1,
        total_pages: 1,
      },
    };
  }
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
