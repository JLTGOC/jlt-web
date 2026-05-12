interface ShipmentRouteParams {
  tab: string;
  shipmentId: string;
  clientId?: string;
}

interface ShipmentComposeRouteParams {
  tab: string;
  shipmentId: string;
  clientId?: string;
  templateId: string;
}

function shipmentPath({ tab, clientId, shipmentId }: ShipmentRouteParams) {
  if (clientId) {
    return `/shipments/${tab}/client/${clientId}/${shipmentId}`;
  }

  return `/shipments/${tab}/${shipmentId}`;
}

export const shipmentRoutes = {
  tab: (tab: string) => `/shipments/${tab}`,
  client: (tab: string, clientId: number | string) =>
    `/shipments/${tab}/client/${clientId}`,
  details: ({ tab, clientId, shipmentId }: ShipmentRouteParams) =>
    shipmentPath({ tab, clientId, shipmentId }),
  documents: ({ tab, clientId, shipmentId }: ShipmentRouteParams) =>
    `${shipmentPath({ tab, clientId, shipmentId })}/documents`,
  compose: ({
    tab,
    clientId,
    shipmentId,
  }: {
    tab: string;
    clientId?: string;
    shipmentId: string;
  }) =>
    clientId
      ? `/shipments/${tab}/client/${clientId}/${shipmentId}/compose`
      : `/shipments/${tab}/${shipmentId}/compose`,
  viewer: ({
    tab,
    clientId,
    shipmentId,
    templateId,
  }: ShipmentComposeRouteParams) =>
    clientId
      ? `/shipments/${tab}/client/${clientId}/${shipmentId}/compose/${templateId}`
      : `/shipments/${tab}/${shipmentId}/compose/${templateId}`,
};
