type JobOrdersListKeyParams = {
  search?: string;
  service?: string;
  tradeType?: string;
  status?: string;
  personInCharge?: string;
  perPage?: number;
  page?: number;
};

export const jobOrdersQueryKeys = {
  all: ["job-orders"] as const,
  list: (params?: JobOrdersListKeyParams) =>
    [...jobOrdersQueryKeys.all, "list", params ?? {}] as const,
  detail: (id?: string | number | null) =>
    [...jobOrdersQueryKeys.all, "detail", id ?? null] as const,
  documents: (id?: string | number | null) =>
    [...jobOrdersQueryKeys.all, "documents", id ?? null] as const,
};
