interface JobOrderRouteParams {
  tab: string;
  jobOrderId: string;
  clientId?: string;
}

function jobOrderPath({ tab, clientId, jobOrderId }: JobOrderRouteParams) {
  if (clientId) {
    return `/job-orders/${tab}/client/${clientId}/${jobOrderId}`;
  }

  return `/job-orders/${tab}/${jobOrderId}`;
}

export const jobOrderRoutes = {
  tab: (tab: string) => `/job-orders/${tab}`,
  client: (tab: string, clientId: number | string) =>
    `/job-orders/${tab}/client/${clientId}`,
  details: ({ tab, clientId, jobOrderId }: JobOrderRouteParams) =>
    jobOrderPath({ tab, clientId, jobOrderId }),
};
