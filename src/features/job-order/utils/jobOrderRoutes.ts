export const jobOrderRoutes = {
  list: () => `/job-orders`,
  details: (jobOrderId: number) => `/job-orders/${jobOrderId}/details`,
  clientDetails: (jobOrderId: number) => `/job-orders/${jobOrderId}/client-details`
};
