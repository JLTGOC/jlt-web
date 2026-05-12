export const jobOrdersQueryKeys = {
  all: ["job-orders"] as const,
  list: () => [...jobOrdersQueryKeys.all, "list"] as const,
  detail: (id?: string | number | null) =>
    [...jobOrdersQueryKeys.all, "detail", id ?? null] as const,
};
