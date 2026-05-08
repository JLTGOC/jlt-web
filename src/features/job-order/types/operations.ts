export type FetchJobOrdersParams = {
  search?: string;
  client_type?: "NEW" | "OLD";
  per_page?: number;
  my_per_page?: number;
  page?: number;
  my_page?: number;
  "filter[status]"?: string;
  "filter[service]"?: string;
};

export type JobOrderResponse = {
  
}