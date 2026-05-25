import type {
  JobOrderListItem,
  JobOrderResponse,
  JobOrderServiceType,
  JobOrderStatus,
} from "../types/jobOrder";

function mapService(value?: string | null): JobOrderServiceType | null {
  if (!value) return null;
  if (value === "Logistics" || value === "Regulatory") return value;
  if (value === "REGULATORY") return "Regulatory";
  if (value === "LOGISTICS") return "Logistics";
  return null;
}

function mapAssignmentStatus(status?: string | null): JobOrderStatus {
  if (!status) return "Pending";
  const normalized = status.toUpperCase();
  if (
    normalized === "ACCEPTED" ||
    normalized === "ASSIGNED" ||
    normalized === "REASSIGNMENT REQUESTED"
  ) {
    return "Accepted";
  }
  if (normalized === "PENDING") return "Pending";
  return "Pending";
}

export function mapJobOrderResponse(item: JobOrderResponse): JobOrderListItem {
  const service =
    mapService(item.job_type) ?? mapService(item.service) ?? "Logistics";
  const status = mapAssignmentStatus(
    item.assignment_status ?? item.status ?? null,
  );
  const tradeType =
    item.service_type === "IMPORT" || item.service_type === "EXPORT"
      ? item.service_type === "IMPORT"
        ? "Import"
        : "Export"
      : undefined;

  return {
    id: item.id,
    reference_number: item.reference_number,
    client: item.client ?? "",
    created_at: item.created_at ?? item.date_created ?? "",
    assignment_status: status,
    service,
    trade_type: tradeType,
    status,
    logistics_service:
      service === "Logistics"
        ? {
            BL: item.bl_no ?? undefined,
            commodity: item.commodity ?? "",
            transport_mode: item.transport_mode ?? "",
            origin: item.origin ?? "",
            destination: item.destination ?? "",
            service_level: item.service_level ?? undefined,
            eta: item.eta ?? undefined,
            etd: item.etd ?? undefined,
          }
        : undefined,
    regulatory_service:
      service === "Regulatory"
        ? {
            application_type: item.application_type ?? "",
            regulatory_assistance: item.regulatory_assistance ?? undefined,
            client_type: item.client_type ?? undefined,
          }
        : undefined,
    person_in_charge: item.assigned_to
      ? {
          name: item.assigned_to,
          avatar_url: item.ops_image ?? undefined,
        }
      : undefined,
    quotation_reference:
      item.quotation_reference ?? item.quotation_reference_number ?? undefined,
    quotation_id: item.quotation_id ?? undefined,
  };
}

export function mapJobOrderResponses(
  items: JobOrderResponse[],
): JobOrderListItem[] {
  return items.map(mapJobOrderResponse);
}
