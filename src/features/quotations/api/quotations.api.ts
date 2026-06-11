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

export interface QuotationEnumOptions {
  clients: Record<string, string>;
  autofill_details: {
    full_name: string;
    company: {
      name: string | null;
      address: string | null;
      position: string | null;
      contact_number: string;
      email: string;
      business_type: string | null;
    };
  };
  business_types: string[];
  regulatory_assistance_types: string[];
  service_types: string[];
  transport_modes: string[];
  service_options: string[];
  cargo_type: string[];
  container_size: string[];
  document_checklist: string[];
}

export interface StoreQuotationPayload {
  services: "LOGISTICS" | "REGULATORY";
  client?: string;
  full_name?: string;
  company: {
    name: string;
    address: string;
    contact_person?: string;
    contact_number: string;
    email: string;
    position?: string;
    business_type?: string;
    cp_contact_number?: string;
  };
  service?: {
    type: "IMPORT" | "EXPORT";
    transport_mode: "SEA" | "AIR";
    options: string[];
  };
  commodity?: {
    commodity: string;
    cargo_type: "CONTAINERIZED" | "LCL";
    container_size?: string;
  };
  shipment?: {
    origin: string;
    destination: string;
  };
  remarks?: string;
  type_of_regulatory_assistance?: string[];
  service_level?: "NEW" | "RENEWAL";
  message?: string;
  documents?: File[];
}

export async function fetchQuotationEnumOptions(params: {
  service?: "LOGISTICS" | "REGULATORY";
  service_type?: string;
  client_id?: string;
}): Promise<QuotationEnumOptions> {
  const response = await apiClient.get<{ data: QuotationEnumOptions }>(
    "/quotations/enum-options",
    { params },
  );
  return response.data.data;
}

export async function storeQuotation(
  payload: StoreQuotationPayload,
): Promise<QuotationResource> {
  const formData = new FormData();

  formData.append("services", payload.services);

  if (payload.client !== undefined) {
    formData.append("client", payload.client);
  }
  if (payload.full_name) {
    formData.append("full_name", payload.full_name);
  }

  formData.append("company[name]", payload.company.name);
  formData.append("company[address]", payload.company.address);
  formData.append("company[contact_number]", payload.company.contact_number);
  formData.append("company[email]", payload.company.email);
  if (payload.company.contact_person) {
    formData.append("company[contact_person]", payload.company.contact_person);
  }
  if (payload.company.position) {
    formData.append("company[position]", payload.company.position);
  }
  if (payload.company.business_type) {
    formData.append("company[business_type]", payload.company.business_type);
  }
  if (payload.company.cp_contact_number) {
    formData.append("company[cp_contact_number]", payload.company.cp_contact_number);
  }

  if (payload.services === "LOGISTICS" && payload.service) {
    formData.append("service[type]", payload.service.type);
    formData.append("service[transport_mode]", payload.service.transport_mode);
    payload.service.options.forEach((opt) =>
      formData.append("service[options][]", opt),
    );
  }

  if (payload.commodity) {
    formData.append("commodity[commodity]", payload.commodity.commodity);
    formData.append("commodity[cargo_type]", payload.commodity.cargo_type);
    if (payload.commodity.container_size) {
      formData.append("commodity[container_size]", payload.commodity.container_size);
    }
  }

  if (payload.shipment) {
    formData.append("shipment[origin]", payload.shipment.origin);
    formData.append("shipment[destination]", payload.shipment.destination);
  }

  if (payload.remarks) {
    formData.append("remarks", payload.remarks);
  }

  if (payload.type_of_regulatory_assistance) {
    payload.type_of_regulatory_assistance.forEach((t) =>
      formData.append("type_of_regulatory_assistance[]", t),
    );
  }
  if (payload.service_level) {
    formData.append("service_level", payload.service_level);
  }
  if (payload.message) {
    formData.append("message", payload.message);
  }

  if (payload.documents && payload.documents.length > 0) {
    payload.documents.forEach((file) =>
      formData.append("documents[]", file),
    );
  }

  const response = await apiClient.post<{ data: QuotationResource }>(
    "/quotations",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data.data;
}
