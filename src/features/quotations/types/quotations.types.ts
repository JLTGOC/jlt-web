// ─── Index response shape (web platform) ──────────────────────────────────────

export interface QuotationClientGroup {
  client_id: number;
  name: string;
  request_count: number;
  quotations: QuotationListItem[];
}

export interface QuotationsPagination {
  current_page: number;
  total_pages: number;
  count: number;
  per_page: number;
  total: number;
}

export interface RespondedQuotationLogisticsService {
  commodity: string;
  service_type: string;
  transport_mode: string;
  origin: string;
  destination: string;
}

export interface RespondedQuotationListItem {
  id: string;
  reference_number: string;
  date: string;
  client_full_name: string;
  status: string;
  qtn_status?: "requested" | "responded" | "accepted" | null;
  assignment_status?: string;
  as_username: string;
  as_full_name: string;
  prepared_by?: string | null;
  assigned_at: string;
  service: string;
  viewed_at: string | null;
  logistics_service: RespondedQuotationLogisticsService | null;
  regulatory_service?: QuotationRegulatoryService | null;
  client_type?: "NEW" | "OLD";
  company_name?: string;
  client?: {
    company_name?: string;
  };
}

export interface RespondedQuotationsResponse {
  counts: ClientCounts;
  quotations: RespondedQuotationListItem[];
  my_quotations?: RespondedQuotationListItem[];
  pagination: QuotationsPagination;
}

export interface AcceptedQuotationsResponse {
  counts: ClientCounts;
  quotations: QuotationListItem[];
  my_quotations?: QuotationListItem[];
  pagination: QuotationsPagination;
}

export interface QuotationLogisticsService {
  commodity: string;
  service_type: string;
  transport_mode: string;
  origin: string;
  destination: string;
}

export interface QuotationRegulatoryService {
  application_type: string;
  type_of_regulatory_assistance: string;
  business_type?: string | null;
}

export interface QuotationListItem {
  id: number | null;
  reference_number: string;
  date: string;
  client_full_name: string;
  status: string;
  assignment_status: string | null;
  account_specialist: string | null;
  assigned_at: string | null;
  requested_at: string | null;
  service: string;
  logistics_service: QuotationLogisticsService | null;
  regulatory_service: QuotationRegulatoryService | null;
  reassignment_request_id: number | null;
  reassignment_requested_at: number | null;
  conversation_id: string | null;
  prepared_by: string | null;
  issued_quotation_id: string | null;
  as_profile_image: string | null;
  client_type: string;
  previously_assigned_to: string | null;
  job_order_created: boolean | null;
}

export interface ClientCounts {
  all_quotations: number;
  old_user_quotations: number;
  new_user_quotations: number;
}

export interface QuotationsResponse {
  counts: ClientCounts;
  quotations: QuotationListItem[];
  my_quotations: QuotationListItem[];
  pagination: QuotationsPagination;
  my_quotations_pagination: QuotationsPagination;
}

// ─── Full quotation resource (GET /quotations/{id}) ───────────────────────────

export interface QuotationResource {
  id: string;
  issued_quotation_id?: number | string | null;
  reference_number: string;
  client: {
    full_name: string;
    company_name: string;
    contact_number: string;
    email: string;
  } | null;
  account_specialist: string | null;
  status: string;
  shipment_status: string;
  created_at: string;
  updated_at: string;
  company: {
    name: string;
    address: string;
    contact_person: string;
    contact_number: string;
    email: string;
  };
  service: {
    type: string;
    transport_mode: string;
    options: string[];
  } | null;
  commodity: {
    commodity: string;
    cargo_type: string;
    container_size: string | null;
  } | null;
  shipment: {
    origin: string;
    destination: string;
  } | null;
  regulatory_service: {
    type_of_regulatory_assistance: string[];
    message: string | null;
  } | null;
  quotation_file: QuotationDocument[] | "No file available.";
  documents: QuotationDocument[] | "No documents available.";
  remarks: string | null;
  conversation_id: string;
  person_in_charge: string | null;
  qtn_created_at: string | null;
  qtn_accepted_at: string | null;
  qtn_status: "requested" | "responded" | "accepted" | null;
}

// ─── Quotation document resource ───────────────────────────────────────────────────

export interface QuotationDocument {
  id: number;
  file_name: string;
  file_url: string;
  file_type?: string;
  uploadedBy?: "JLTCB" | "Client";
  uploaded_by?: number;
  uploadedByUser?: string;
  uploadedDate?: string;
  created_at?: string;
  updated_at?: string;
}

// ─── Quotation file resource ───────────────────────────────────────────────────

export interface QuotationFileResource {
  id: number;
  uploaded_by: number;
  quotation_id: number;
  file_url: string;
  type: string;
  file_name: string;
  created_at: string;
  updated_at: string;
}

export interface IssuedQuotationDetailValueResource {
  label: string;
  value: string;
}

export interface IssuedQuotationChargeItemResource {
  receipt_charge_label: string;
  currency_label: string;
  uom: string;
  quantity?: number | string | null;
  container_size?: string | null;
  amount: number | string | null;
}

export interface IssuedQuotationChargeResource {
  name: string;
  subtotal: number | string | null;
  items: IssuedQuotationChargeItemResource[] | null;
}

export interface IssuedQuotationStandardConfigResource {
  name: string;
  policies: string;
  terms_and_conditions: string;
  banking_details: string;
  footer: string;
}

export interface IssuedQuotationSignatoryResource {
  closing_statement: string;
  is_authorized_signatory: boolean;
  authorized_signatory_name: string;
  position: string;
  signature_file_path: string | null;
}

export interface IssuedQuotationResource {
  id: number | string;
  quotation_id: number | string;
  template_id: number | string;
  issued_by: string | null;
  subject: string;
  message: string;
  rate_validity?: string | null;
  uom?: string | null;
  currency?: string | null;
  quotation_details: IssuedQuotationDetailValueResource[];
  billing_details: {
    charges: IssuedQuotationChargeResource[];
    total: number | string | null;
  };
  standard_config: IssuedQuotationStandardConfigResource | null;
  signatory: IssuedQuotationSignatoryResource | null;
  client_inputs: {
    label: string;
    value: string | number | boolean | null;
  }[];
  quotation_file?: QuotationFileResource | null;
}

// ─── Status filter ─────────────────────────────────────────────────────────────

export const QUOTATION_STATUS = {
  REQUESTED: "REQUESTED",
  RESPONDED: "RESPONDED",
  ACCEPTED: "ACCEPTED",
  DISCARDED: "DISCARDED",
} as const;

export type QuotationStatus =
  (typeof QUOTATION_STATUS)[keyof typeof QUOTATION_STATUS];

// ─── Status filter ─────────────────────────────────────────────────────────────

export type FetchRequestedQuotationsParams = {
  search?: string;
  as_search?: string;
  client_type?: "NEW" | "OLD";
  per_page?: number;
  my_per_page?: number;
  page?: number;
  my_page?: number;
  "filter[assignment_status]"?: string;
  "filter[created_at]"?: string;
  "filter[service]"?: string;
  "filter[status]": string;
};

export type ReassignEnumsResponse = {
  reassignment_reasons: string[];
  account_specialists: { id: number; username: string; full_name: string }[];
  operations: { id: number; username: string; full_name: string }[];
};

export type ReassignQuotationSpecificDetailsResponse = {
  id: number;
  quotation_id: number;
  job_order_id: number | null;
  as_id: number;
  ops_id: number | null;
  reason: string;
  additional_details: string;
  status: string;
  created_at: string;
  updated_at: string;
};
