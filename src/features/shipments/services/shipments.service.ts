import { apiClient } from "@/lib/api/client";
import type {
  ShipmentsIndexResponse,
  ShipmentResource,
  ShipmentStatus,
  PermitsIndexResponse,
  PermitResource,
  LicensesIndexResponse,
  LicenseResource,
  ShipmentApiEnvelope,
  ShipmentListItem,
  ShipmentDocument,
} from "../types/shipments.types";
import { SERVICE_LEVEL_ABBREVIATIONS } from "../types/shipments.types";

// ─── Shipments API ─────────────────────────────────────────────────────────────

export interface FetchShipmentsParams {
  status?: ShipmentStatus;
  search?: string;
  perPage?: number;
  shipmentType?: string;
  eta?: string;
  personInCharge?: string;
}

const DEFAULT_PER_PAGE = 10;

/**
 * Abbreviates service level strings by extracting acronyms from parentheses
 * or using the SERVICE_LEVEL_ABBREVIATIONS map.
 *
 * Examples:
 * - "INTERNATIONAL FREIGHT FORWARDING (IFF)" → "IFF"
 * - "INTERNATIONAL FREIGHT FORWARDING (IFF), CARGO CONSOLIDATION (CC)" → "IFF, CC"
 * - "DIRECT EXPORT (DE)" → "DE"
 */
function abbreviateServiceLevel(serviceLevel: string | null | undefined): string | undefined {
  if (!serviceLevel) return undefined;

  // Split by comma to handle multiple services
  const services = serviceLevel.split(",").map((s) => s.trim());

  const abbreviations = services
    .map((service) => {
      // First, try to extract acronym from parentheses: "SERVICE (ACRONYM)"
      const acronymMatch = service.match(/\(([A-Z]+)\)/);
      if (acronymMatch) {
        return acronymMatch[1];
      }

      // Otherwise, try to find in the abbreviation map
      const mapped = SERVICE_LEVEL_ABBREVIATIONS[service];
      if (mapped) {
        return mapped;
      }

      // If no match, return the original service (fallback)
      return service;
    })
    .filter(Boolean);

  return abbreviations.length > 0 ? abbreviations.join(", ") : undefined;
}

/**
 * Normalizes document responses from the API to the UI format.
 * Maps API fields (created_at, uploaded_by) to UI fields (uploadedDate, uploadedBy).
 *
 * @param doc Raw document from API
 * @param source "Client" | "JLTCB" - indicates who uploaded the document
 */
function normalizeDocument(
  doc: unknown,
  source: "Client" | "JLTCB" = "Client"
): ShipmentDocument | null {
  if (!doc || typeof doc !== "object") return null;

  const typedDoc = doc as {
    id?: number;
    file_name?: string;
    file_url?: string;
    uploadedDate?: string;
    uploadedBy?: string;
    uploaded_by?: number;
    quotation_id?: number;
    file_type?: string;
    type?: string;
    created_at?: string;
    updated_at?: string;
    document_type?: string;
  };

  if (!typedDoc.id || !typedDoc.file_name) {
    return null;
  }

  return {
    id: typedDoc.id,
    file_name: typedDoc.file_name,
    file_url: typedDoc.file_url,
    uploadedDate: typedDoc.uploadedDate || typedDoc.created_at,
    uploadedBy: (typedDoc.uploadedBy || source) as "Client" | "JLTCB",
    uploadedByUser: typedDoc.uploadedBy,
    document_type: (typedDoc.document_type || typedDoc.type) as
      | "BILLING"
      | "INVOICE"
      | "RECEIPT"
      | "GENERAL"
      | undefined,
    // Preserve API fields for reference
    uploaded_by: typedDoc.uploaded_by,
    quotation_id: typedDoc.quotation_id,
    file_type: typedDoc.file_type,
    type: typedDoc.type,
    created_at: typedDoc.created_at,
    updated_at: typedDoc.updated_at,
  };
}

// ─── Shipments API ─────────────────────────────────────────────────────────────
function toShipmentListItem(item: unknown): ShipmentListItem | null {  if (!item || typeof item !== "object") return null;

  const typedItem = item as {
    id?: number;
    reference_number?: string;
    bl_number?: string;
    im_reference?: string;
    client?: string;
    client_full_name?: string;
    company_name?: string;
    client_type?: "NEW" | "OLD";
    destination?: string;
    eta?: string;
    etd?: string;
    status?: string;
    transport_mode?: "AIR" | "SEA";
    origin?: string;
    origin_port?: string;
    destination_port?: string;
    service_type?: string;
    service_level?: string;
    company_address?: string;
    volume?: string;
    person_in_charge?: {
      id?: number;
      full_name?: string;
      role?: string;
      avatar_url?: string;
    };
    assigned_operations_id?: number;
    shipment_type?: "IMPORT" | "EXPORT";
    general_info?: {
      id?: number;
      reference_number?: string;
      client?: string;
      company_name?: string;
      destination?: string;
      eta?: string;
      etd?: string;
      status?: string;
      service_type?: string;
      service_level?: string;
      transport_mode?: "AIR" | "SEA";
      origin?: string;
      origin_port?: string;
      destination_port?: string;
      assigned_operations_id?: number;
      person_in_charge?: string;
      person_in_charge_full_name?: string;
      person_in_charge_image?: string;
    };
    shipment_information?: {
      bl_number?: string;
      reference_number?: string;
      origin?: string;
      origin_port?: string;
      destination?: string;
      destination_port?: string;
      eta?: string;
      etd?: string;
      service_type?: string;
      service_level?: string;
      sub_services?: string[];
      transport_mode?: "AIR" | "SEA";
      company_name?: string;
      account_handler?: string;
      created_at?: string;
      updated_at?: string;
      remarks?: string;
      company?: {
        address?: string;
      };
      commodity_details?: {
        volume?: string;
      };
    };
    commodity_details?: {
      consignee_name?: string;
    };
  };

  const source = (typedItem.general_info ?? typedItem) as {
    id?: number;
    reference_number?: string;
    client?: string;
    company_name?: string;
    destination?: string;
    eta?: string;
    etd?: string;
    status?: string;
    service_type?: string;
    service_level?: string;
    transport_mode?: "AIR" | "SEA";
    origin?: string;
    origin_port?: string;
    destination_port?: string;
    assigned_operations_id?: number;
    person_in_charge?: string;
    person_in_charge_full_name?: string;
    person_in_charge_image?: string;
  };
  const shipmentInfo = typedItem.shipment_information as {
    bl_number?: string;
    reference_number?: string;
    origin?: string;
    origin_port?: string;
    destination?: string;
    destination_port?: string;
    eta?: string;
    etd?: string;
    service_type?: string;
    service_level?: string;
    sub_services?: string[];
    transport_mode?: "AIR" | "SEA";
    company_name?: string;
    account_handler?: string;
    created_at?: string;
    updated_at?: string;
    remarks?: string;
    company?: {
      address?: string;
    };
    commodity_details?: {
      volume?: string;
    };
  };

  if (!source.reference_number || source.id == null) {
    return null;
  }

  const transportMode = (source.transport_mode ?? shipmentInfo?.transport_mode ?? typedItem.transport_mode)
    ? String(source.transport_mode ?? shipmentInfo?.transport_mode ?? typedItem.transport_mode).toUpperCase()
    : undefined;

  const assignedOperationsId =
    source.assigned_operations_id ?? typedItem.assigned_operations_id;

  const personInCharge =
    typedItem.person_in_charge ??
    (source.person_in_charge || source.person_in_charge_full_name
      ? {
          full_name: source.person_in_charge_full_name || source.person_in_charge || "—",
          role: source.person_in_charge?.split(" ")[0] || "OPS",
          avatar_url: source.person_in_charge_image || undefined,
        }
      : undefined);

  const clientFullName = typedItem.client_full_name ?? source.client ?? typedItem.client;
  const companyName =
    typedItem.company_name ??
    source.company_name ??
    shipmentInfo?.company_name ??
    typedItem.client_full_name ??
    source.client ??
    typedItem.client;
  const commodityDetails = typedItem.commodity_details as { volume?: string } | undefined;

  return {
    id: source.id,
    reference_number: source.reference_number,
    bl_number: typedItem.bl_number ?? shipmentInfo?.bl_number,
    im_reference: typedItem.im_reference,
    client: source.client ?? "—",
    client_full_name: clientFullName,
    company_name: companyName,
    client_type: typedItem.client_type,
    destination: source.destination ?? shipmentInfo?.destination ?? "—",
    eta: source.eta ?? shipmentInfo?.eta ?? "—",
    etd: source.etd ?? shipmentInfo?.etd ?? "—",
    status: source.status ?? "—",
    transport_mode: transportMode as "AIR" | "SEA" | undefined,
    origin: source.origin ?? shipmentInfo?.origin,
    origin_port: source.origin_port ?? shipmentInfo?.origin_port,
    destination_port: source.destination_port ?? shipmentInfo?.destination_port,
    service_type: source.service_type ?? shipmentInfo?.service_type,
    service_level: abbreviateServiceLevel(source.service_level ?? shipmentInfo?.service_level),
    company_address: typedItem.company_address ?? shipmentInfo?.company?.address,
    volume: commodityDetails?.volume ?? shipmentInfo?.commodity_details?.volume,
    person_in_charge: personInCharge,
    assigned_operations_id: assignedOperationsId,
    shipment_type: typedItem.shipment_type,
  };
}

function normalizeShipmentsIndexResponse(
  payload: unknown,
  perPage: number,
): ShipmentsIndexResponse {
  const emptyResponse: ShipmentsIndexResponse = {
    shipments: [],
    pagination: {
      count: 0,
      per_page: perPage,
      total: 0,
    },
  };

  if (!payload || typeof payload !== "object") return emptyResponse;

  const typedPayload = payload as {
    shipments?: unknown[];
    data?: unknown[];
    pagination?: { count?: number; per_page?: number; total?: number };
    meta?: { total?: number; per_page?: number };
  };

  const sourceItems =
    typedPayload.shipments ??
    (Array.isArray(typedPayload.data)
      ? typedPayload.data
      : Array.isArray(payload)
        ? payload
        : []);

  const shipments = sourceItems
    .map((item) => toShipmentListItem(item))
    .filter((item): item is ShipmentListItem => item !== null);

  const total =
    typedPayload.pagination?.total ??
    typedPayload.meta?.total ??
    shipments.length;
  const perPageValue =
    typedPayload.pagination?.per_page ?? typedPayload.meta?.per_page ?? perPage;

  return {
    shipments,
    pagination: {
      count: typedPayload.pagination?.count ?? shipments.length,
      per_page: perPageValue,
      total,
    },
  };
}

// Use constants from SHIPMENT_STATUS to avoid mismatches
export async function fetchOngoingShipments(
  params: Omit<FetchShipmentsParams, "status">,
): Promise<ShipmentsIndexResponse> {
  return fetchShipments({ ...params, status: "NOT YET DEPARTED" });
}

export async function fetchDeliveredShipments(
  params: Omit<FetchShipmentsParams, "status">,
): Promise<ShipmentsIndexResponse> {
  return fetchShipments({ ...params, status: "DELIVERED" });
}

export async function fetchShipments(
  params: FetchShipmentsParams,
): Promise<ShipmentsIndexResponse> {
  const perPage = params.perPage ?? DEFAULT_PER_PAGE;

  try {
    const response = await apiClient.get<ShipmentApiEnvelope<unknown>>(
      "/shipments",
      {
        params: {
          ...(params.status ? { "filter[status]": params.status } : {}),
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.shipmentType ? { "filter[service_type]": params.shipmentType } : {}),
          ...(params.eta ? { "filter[eta]": params.eta } : {}),
          ...(params.personInCharge ? { "filter[person_in_charge]": params.personInCharge } : {}),
        },
      },
    );

    return normalizeShipmentsIndexResponse(response.data.data, perPage);
  } catch {
    return {
      shipments: [],
      pagination: {
        count: 0,
        per_page: perPage,
        total: 0,
      },
    };
  }
}

export async function fetchShipment(id: string): Promise<ShipmentResource> {
  const response = await apiClient.get<ShipmentApiEnvelope<ShipmentResource>>(
    `/shipments/${id}`,
  );

  if (!response.data.data) {
    throw new Error(`Shipment with ID ${id} not found`);
  }

  return response.data.data;
}

// ─── Permits API ──────────────────────────────────────────────────────────────

export interface FetchPermitsParams {
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchPermits(
  params: FetchPermitsParams,
): Promise<PermitsIndexResponse> {
  try {
    const response = await apiClient.get<{ data: PermitsIndexResponse }>(
      "/permits",
      {
        params: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return (
      response.data.data || {
        permits: [],
        pagination: {
          count: 0,
          per_page: params.perPage || 10,
          total: 0,
        },
      }
    );
  } catch {
    return {
      permits: [],
      pagination: {
        count: 0,
        per_page: params.perPage || 10,
        total: 0,
      },
    };
  }
}

export async function fetchPermit(id: string): Promise<PermitResource> {
  const response = await apiClient.get<{ data: PermitResource }>(
    `/permits/${id}`,
  );
  return response.data.data;
}

// ─── Licenses API ─────────────────────────────────────────────────────────────

export interface FetchLicensesParams {
  search?: string;
  perPage?: number;
  clientId?: number;
}

export async function fetchLicenses(
  params: FetchLicensesParams,
): Promise<LicensesIndexResponse> {
  try {
    const response = await apiClient.get<{ data: LicensesIndexResponse }>(
      "/licenses",
      {
        params: {
          ...(params.search ? { search: params.search } : {}),
          ...(params.perPage ? { perPage: params.perPage } : {}),
          ...(params.clientId ? { client_id: params.clientId } : {}),
        },
      },
    );
    return (
      response.data.data || {
        licenses: [],
        pagination: {
          count: 0,
          per_page: params.perPage || 10,
          total: 0,
        },
      }
    );
  } catch {
    return {
      licenses: [],
      pagination: {
        count: 0,
        per_page: params.perPage || 10,
        total: 0,
      },
    };
  }
}

export async function fetchLicense(id: string): Promise<LicenseResource> {
  const response = await apiClient.get<{ data: LicenseResource }>(
    `/licenses/${id}`,
  );
  return response.data.data;
}
