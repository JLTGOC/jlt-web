export const jobOrderRoutes = {
  list: () => `/job-orders`,
  details: (jobOrderId: number) => `/job-orders/${jobOrderId}`,
};
