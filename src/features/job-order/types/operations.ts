export type FetchJobOrdersParams = {
  search?: string;
  client_type?: "LOGISTICS" | "REGULATORY";
  per_page?: number;
  my_per_page?: number;
  page?: number;
  my_page?: number;
  "filter[assignment_status]"?: string;
  "filter[service]"?: string;
};

export type CountsResponse = {
  all_job_orders: number;
  new_user_job_orders: number;
  old_user_job_orders: number;  
}

export type JobOrderResponse = {
  assigned_at: string | null;
  assigned_to: string | null;
  assignment_status: string;
  bl_no: string;
  client: string;
  commodity: string;
  date_created: string;
  destination: string;
  id: number;
  job_type: string;
  ops_image: string | null;
  origin: string;
  quotation_id: number | null;
  quotation_reference_number: string | null;
  reassignment_request_id: number | null;
  reference_number: string;
  service_level: string;
  service_type: string;
  transport_mode: string;
};

export type pagination = {
  current_page: number;
  total_pages: number;
  count: number;
  per_page: number;
  total: number;
}

export type JobOrdersResponse = {
  counts: CountsResponse;
  job_orders: JobOrderResponse[];
  my_job_orders: JobOrderResponse[];
  pagination: pagination;
  my_job_orders_pagination: pagination;
}