export const jobOrderRoutes = {
  list: () => `/job-orders`,
  details: (jobOrderId: number) => `/job-orders/${jobOrderId}/details`,
  clientDetails: (jobOrderId: number | string) =>
    `/job-orders/${jobOrderId}/client-details`,
  clientDocuments: (jobOrderId: number | string) =>
    `/job-orders/${jobOrderId}/client-details/documents`,
};
