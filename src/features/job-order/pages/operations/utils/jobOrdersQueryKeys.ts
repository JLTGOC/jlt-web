type JobOrdersListKeyParams = {
  searchQuery: string;
  asSearchQuery: string;
  clientFilter: "ALL" | "LOGISTICS" | "REGULATORY";
  serviceFilter: "LOGISTICS" | "REGULATORY" | "ALL";
  statusFilter: "AVAILABLE" | "ASSIGNED" | "REASSIGNMENT REQUESTED" | "ALL";
  perPage: number;
  jobFilter: "all" | "my-items";
  perPaginationPage: number;
};

export const jobOrdersQueryKeys = {
  jobOrdersRoot: ["jobOrdersRoot"] as const,
  jobOrdersList: ({
    searchQuery,
    asSearchQuery,
    clientFilter,
    serviceFilter,
    statusFilter,
    perPage,
    jobFilter,
    perPaginationPage,
  }: JobOrdersListKeyParams) =>
    [
      ...jobOrdersQueryKeys.jobOrdersRoot,
      searchQuery,
      asSearchQuery,
      clientFilter,
      serviceFilter,
      statusFilter,
      perPage,
      jobFilter,
      perPaginationPage,
    ] as const,
};
