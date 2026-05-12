// ─── Shipment API shape ───────────────────────────────────────────────────────

export interface ShipmentClient {
  full_name: string;
  company_name: string;
  contact_number: string;
  email: string;
  image_path?: string | null;
}

export interface ShipmentGeneralInfo {
  id: number;
  reference_number: string;
  job_order_id: number;
  client: string | ShipmentClient;
  company_name?: string;
  status: string;
  commodity?: string;
  date: string;
  person_in_charge?: string;
  person_in_charge_full_name?: string;
  person_in_charge_image?: string | null;
}

export interface ShipmentCommodityDetails {
  commodity: string;
  cargo_type: string;
  container_size: string | null;
  volume?: string;
}

export interface ShipmentContactPerson {
  company_name: string;
  full_name: string;
  contact_number: string;
  email: string;
}

export interface ShipmentInformationDetails {
  bl_number?: string;
  origin: string;
  destination: string;
  eta?: string;
  etd?: string;
  sub_services?: string[];
  service_type?: string;
  service_level?: string;
  transport_mode?: "AIR" | "SEA";
  account_handler: string;
  remarks?: string;
  created_at: string;
  updated_at?: string;
}

export interface ShipmentConsigneeDetails {
  company_name: string;
  company_address: string;
  contact_person: string;
  contact_number: string;
  email: string;
}

export interface ShipmentDocument {
  id: number;
  file_name: string;
  file_url?: string;
  uploadedDate?: string;
  uploadedBy: "JLTCB" | "Client";
  uploadedByUser?: string;
  document_type?: "BILLING" | "INVOICE" | "RECEIPT" | "GENERAL";
  // API response fields
  uploaded_by?: number;
  quotation_id?: number;
  file_type?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ShipmentResource {
  shipmentId?: number | string;
  general_info: ShipmentGeneralInfo;
  contact_person?: ShipmentContactPerson;
  commodity_details?: ShipmentCommodityDetails;
  shipment_information: ShipmentInformationDetails;
  consignee_details?: ShipmentConsigneeDetails;
  quotation_proposals?: ShipmentDocument[];
  client_documents?: ShipmentDocument[];
  documents?: ShipmentDocument[];
  billing_documents?: ShipmentDocument[];
  invoice_documents?: ShipmentDocument[];
  receipt_documents?: ShipmentDocument[];
}

// ─── UI-friendly list shape ───────────────────────────────────────────────────

export interface ShipmentListItem {
  id: number;
  reference_number: string;
  bl_number?: string;
  im_reference?: string;
  company_name?: string;
  client: string | ShipmentClient;
  client_full_name?: string;
  client_type?: "NEW" | "OLD";
  destination: string;
  eta: string;
  etd: string;
  status: string;
  transport_mode?: "AIR" | "SEA";
  origin?: string;
  origin_port?: string;
  destination_port?: string;
  service_type?: string;
  service_level?: string;
  company_address?: string;
  volume?: string;
  person_in_charge?: {
    id?: number;
    full_name?: string;
    role?: string;
    avatar_url?: string;
  };
  assigned_operations_id?: number;
  shipment_type?: "IMPORT" | "EXPORT";
}

export interface ShipmentsPagination {
  count: number;
  per_page: number;
  total: number;
}

export interface ShipmentsIndexResponse {
  shipments: ShipmentListItem[];
  pagination: ShipmentsPagination;
}

// ─── Status filter ─────────────────────────────────────────────────────────────

export const SHIPMENT_STATUS = {
  NOT_YET_DEPARTED: "NOT YET DEPARTED",
  IN_TRANSIT: "IN TRANSIT",
  ARRIVED: "ARRIVED",
  BERTHED: "BERTHED",
  DISCHARGED: "DISCHARGED",
  DELIVERED: "DELIVERED",
} as const;

export type ShipmentStatus =
  (typeof SHIPMENT_STATUS)[keyof typeof SHIPMENT_STATUS];

export const SHIPMENT_STATUS_COLORS: Record<string, string> = {
  "NOT YET DEPARTED": "#9C9DA1",
  "IN TRANSIT": "#0963E3",
  ARRIVED: "#27A2AF",
  BERTHED: "#6D37C7",
  DISCHARGED: "#F5940A",
  DELIVERED: "#0E8C42",
};

export const SHIPMENT_STATUS_DESCRIPTIONS: Record<string, string> = {
  "NOT YET DEPARTED": "Shipment not yet departed",
  "IN TRANSIT": "Shipment is on the way",
  "ARRIVED": "Shipment has arrived at destination port",
  "BERTHED": "Vessel berthed at the port",
  "DISCHARGED": "Cargo discharged from vessel",
  "DELIVERED": "Shipment Delivered",
};

// ─── Service Level Abbreviations ──────────────────────────────────────────────

export const SERVICE_LEVEL_ABBREVIATIONS: Record<string, string> = {
  "INTERNATIONAL FREIGHT FORWARDING": "IFF",
  "CARGO CONSOLIDATION": "CC",
  "DIRECT EXPORT": "DE",
  "IMPORT CLEARANCE": "IC",
  "CUSTOMS BROKERAGE": "CB",
  "WAREHOUSE": "WH",
  "DISTRIBUTION": "DIST",
  "LOGISTICS CONSULTING": "LC",
};

// ─── API Envelope ─────────────────────────────────────────────────────────────

export interface ShipmentApiEnvelope<T> {
  message: string;   
  data: T;           
  code: number;      
  error: boolean;    
}

//Confirmation for details regarding Permits and Licenses is still pending, so these are just placeholders for now.
// ─── Permits ──────────────────────────────────────────────────────────────────

export interface PermitListItem {
  id: string;
  permit_number: string;
  client_name: string;
  permit_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
}

export interface PermitClientGroup {
  client_id: number;
  name: string;
  permit_count: number;
  permits: PermitListItem[];
}

export interface PermitsIndexResponse {
  permits: PermitClientGroup[];
  pagination: ShipmentsPagination;
}

export interface PermitResource {
  id: string;
  permit_number: string;
  client: {
    full_name: string;
    company_name: string;
    contact_number: string;
    email: string;
  } | null;
  permit_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  remarks: string | null;
}

// ─── Licenses ─────────────────────────────────────────────────────────────────

export interface LicenseListItem {
  id: string;
  license_number: string;
  client_name: string;
  license_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
}

export interface LicenseClientGroup {
  client_id: number;
  name: string;
  license_count: number;
  licenses: LicenseListItem[];
}

export interface LicensesIndexResponse {
  licenses: LicenseClientGroup[];
  pagination: ShipmentsPagination;
}

export interface LicenseResource {
  id: string;
  license_number: string;
  client: {
    full_name: string;
    company_name: string;
    contact_number: string;
    email: string;
  } | null;
  license_type: string;
  issued_date: string;
  expiry_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  remarks: string | null;
}
