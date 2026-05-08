// JobOrderListItem and related types for the Job Order feature

export type {FetchJobOrdersParams, JobOrderResponse, JobOrdersResponse, CountsResponse} from "./operations";

export interface JobOrderListItem {
  id: string | number;
  reference_number: string;
  client: string;
  created_at: string;
  assignment_status: "AVAILABLE" | "ASSIGNED" | string;
  service: string;
  logistics_service?: {
    commodity: string;
    service_type: string;
    transport_mode: string;
    origin: string;
    destination: string;
  };
  regulatory_service?: {
    application_type: string;
  };
  person_in_charge?: {
    name: string;
    avatar_url?: string;
  };
  quotation_reference?: string;
  quotation_id?: string | number;
}

export type JobOrderClientType = "new" | "old";
