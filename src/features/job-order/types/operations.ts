import type { JobOrderClientType } from "./jobOrder";

export type FetchJobOrdersParams = {
  search?: string;
  ops_search?: string;
  client_type?: "LOGISTICS" | "REGULATORY";
  per_page?: number;
  my_per_page?: number;
  page?: number;
  my_page?: number;
  "filter[assignment_status]"?: string;
  "filter[service]"?: string;
  "filter[service_type]"?: string;
};

//updated to match API response
export type CountsResponse = {
  all_job_orders: number;
  logistics_job_orders: number;
  regulatory_job_orders: number;
};

export type JobOrderResponse = {
  assigned_at: string | null;
  assigned_to: string | null;
  assignment_status: string;
  bl_no: string;
  client: string;
  client_type: JobOrderClientType;
  company_name: string;
  commodity: string;
  created_at?: string | null;
  date_created: string;
  destination: string;
  has_timeline: boolean;
  id: number;
  job_type: string;
  ops_image: string | null;
  ops_id: number;
  origin: string;
  quotation_id: number | null;
  quotation_reference_number: string;
  issued_quotation_id: number;
  regulatory_assistance?: string | null;
  application_type?: string | null;
  reassignment_request_id: number | null;
  reference_number: string;
  service_level: string;
  service?: string | null;
  service_type: string;
  eta?: string | null;
  etd?: string | null;
  status?: string | null;
  transport_mode: string;
  generate_shipment?: boolean;
};


export interface JobOrderTableProps {
  rows: JobOrderResponse[];
  isLoading?: boolean;
  showingCount?: number;
  total?: number;
  totalPages?: number;
  jobFilter?: "all" | "my-items";
  perPaginationPage?: number;
  currentUserRole?: string | null;

  setPerPaginationPage?: (page: number) => void;
  setActiveModal?: React.Dispatch<React.SetStateAction<ModalType>>;

  onRowClick?: (row: JobOrderResponse) => void;
  handleUnderLinedRefNumberCLick?: (row: JobOrderResponse) => void;
  onMakeQuotationClick?: (row: JobOrderResponse) => void;
  modalOpenClick?: (row: JobOrderResponse, type: any) => void;
  onReassignClick?: (row: JobOrderResponse) => void;
  onReassignRequestClick?: (row: JobOrderResponse) => void;
  openGenerateShipment?: (row: JobOrderResponse) => void;
}

export type pagination = {
  current_page: number;
  total_pages: number;
  count: number;
  per_page: number;
  total: number;
};

export type JobOrdersResponse = {
  counts: CountsResponse;
  job_orders: JobOrderResponse[];
  my_job_orders: JobOrderResponse[];
  pagination: pagination;
  my_job_orders_pagination: pagination;
};

export type ModalType =
  | "accept"
  | "make"
  | "reassign"
  | "reassignAccept"
  | "reassignReject"
  | "requestReassign"
  | "generateShipment"
  | "generateShipmentConfirm"
  | null;
