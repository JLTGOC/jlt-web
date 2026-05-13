// JobOrderListItem and related types for the Job Order feature

export type {
  FetchJobOrdersParams,
  JobOrderResponse,
  JobOrdersResponse,
  CountsResponse,
} from "./operations";

export interface JobOrderListItem {
  id: string | number;
  reference_number: string;
  client: string;
  created_at: string;
  assignment_status: JobOrderStatus;
  service: JobOrderServiceType;
  trade_type?: JobOrderTradeType;
  status?: "Accepted" | "Pending";
  logistics_service?: {
    BL?: string;
    commodity: string;
    transport_mode: string;
    origin: string;
    destination: string;
    service_level?: string;
    eta?: string;
    etd?: string;
  };
  regulatory_service?: {
    application_type: string;
    regulatory_assistance?: string;
    client_type?: JobOrderClientType;
  };
  person_in_charge?: {
    name: string;
    avatar_url?: string;
  };
  quotation_reference?: string;
  quotation_id?: string | number;
}

export interface JobOrderQuotationDetailsResponse {
  id: number | string;
  reference_number: string;
  client_id: number | string | null;
  client: {
    full_name: string;
    company_name?: string | null;
    contact_number?: string | null;
    email?: string | null;
  } | null;
  account_specialist?: string | null;
  status: string;
  shipment_status?: string | null;
  created_at: string;
  updated_at: string;
  issued_quotation_id?: number | string | null;
  company?: {
    name: string;
    address: string;
    contact_person: string;
    contact_number: string;
    email: string;
    position: string;
    business_type: string;
  } | null;
  service?: {
    type: string;
    transport_mode: string;
    options: string[];
  } | null;
  commodity?: {
    commodity: string;
    cargo_type: string;
    container_size?: string | null;
  } | null;
  shipment?: {
    origin: string;
    destination: string;
  } | null;
  regulatory_service?: any | null;
  quotation_file: Array<{
    id: number | string;
    file_name: string;
    file_url: string;
    file_type: string;
    created_at: string;
    updated_at: string;
  }>;
  documents: Array<{
    id: number | string;
    file_name: string;
    file_url: string;
    file_type: string;
    created_at: string;
    updated_at: string;
  }>;
  remarks?: string | null;
  conversation_id?: number | string | null;
}

export type JobOrderClientType = "NEW" | "OLD";

export type JobOrderServiceType = "Logistics" | "Regulatory";

export type JobOrderTradeType = "Import" | "Export";

export type JobOrderStatus = "Accepted" | "Pending";
