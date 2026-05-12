// JobOrderListItem and related types for the Job Order feature

export type {FetchJobOrdersParams, JobOrderResponse, JobOrdersResponse, CountsResponse} from "./operations";

export interface JobOrderListItem {
  id: string | number;
  reference_number: string;
  client: string;
  created_at: string;
  assignment_status: "AVAILABLE" | "ASSIGNED" | string;
  service: string;
  trade_type?: "Import" | "Export";
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
    assistance_type?: string;
    client_type?: JobOrderClientType;
  };
  person_in_charge?: {
    name: string;
    avatar_url?: string;
  };
  quotation_reference?: string;
  quotation_id?: string | number;
}

export type JobOrderServiceType = "Logistics" | "Regulatory";

export type JobOrderTradeType = "Import" | "Export";

export type JobOrderStatus = "Accepted" | "Pending";
