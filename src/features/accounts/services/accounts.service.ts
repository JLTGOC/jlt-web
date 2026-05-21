// src/features/accounts/services/accountsService.ts
import { apiClient } from "@/lib/api/client";
import type {
  AccountListItem,
  AccountDetails,
  AccountDashboardStats,
  ClientDetails,
  ClientQuotation,
  ClientRegulatory,
  ClientShipment,
  EmployeeDetails,
} from "../types/accounts.types";
import type { AccountsAPI } from "../api/accounts.api";

function mapAccountDetailsFromUser(data: any): AccountDetails {
  return {
    accountInfo: {
      fullName: data.full_name ?? `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      email: data.email ?? "",
      contactNumber: data.contact_number ?? "",
      username: data.username ?? data.email ?? "",
      role: data.role ?? undefined,
    },
    companyInfo: {
      companyName: data.company_name ?? "",
      position: data.position ?? data.company_position ?? undefined,
      companyAddress: data.company_address ?? "",
      businessType: data.business_type ?? undefined,
    },
    identification: {
      profileImageUrl: data.image_path ?? null,
      idImageUrl: data.id_image_path ?? data.id_image_path ?? null,
    },
  };
}

function mapAccountDetailsFromClientResource(data: any): AccountDetails {
  return {
    accountInfo: {
      fullName: data.full_name ?? "",
      email: data.email ?? "",
      contactNumber: data.contact_number ?? "",
      username: data.email ?? "",
    },
    companyInfo: {
      companyName: data.company_name ?? "",
      position: data.position ?? undefined,
      companyAddress: data.company_address ?? "",
      businessType: data.business_type ?? undefined,
    },
    identification: {
      profileImageUrl: null,
      idImageUrl: null,
    },
  };
}

function normalizeArray<T>(value: unknown): T[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value == null) {
    return [];
  }

  if (typeof value === "object") {
    return Object.values(value) as T[];
  }

  return [];
}

function normalizeClientRegulatoryRows(value: unknown): unknown[] {
  if (Array.isArray(value)) {
    return value;
  }

  if (value == null || typeof value !== "object") {
    return [];
  }

  const candidate = (value as any).data ??
    (value as any).items ??
    (value as any).cases ??
    (value as any).records ??
    (value as any).results ??
    (value as any).rows ??
    (value as any).regulatory;

  if (Array.isArray(candidate)) {
    return candidate;
  }

  return [];
}

function mapClientQuotation(item: any): ClientQuotation {
  const reference = item.reference_number ?? item.quotation_number ?? item.referenceNumber ?? item.id ?? "";

  const serviceType =
    item.responded?.service ??
    item.responded?.service_type ??
    item.serviceType ??
    item.service_type ??
    item.service ??
    item.quotation?.logisticsService?.service_type ??
    "";

  const dateQuoted =
    item.dateQuoted ??
    item.date_quoted ??
    item.created_at ??
    item.issued_at ??
    item.responded?.created_at ??
    item.responded?.date_quoted ??
    "";

  const validUntil =
    item.validUntil ??
    item.valid_until ??
    item.expires_at ??
    item.responded?.valid_until ??
    item.responded?.expires_at ??
    "";

  const rawQuotedBy =
    item.quotedBy ??
    item.quoted_by ??
    item.responded?.prepared_by ??
    item.responded?.responder_name ??
    item.responded?.quoted_by ??
    item.user_name ??
    "";

  const quotedBy =
    typeof rawQuotedBy === "string"
      ? rawQuotedBy
      : rawQuotedBy?.name ?? rawQuotedBy?.full_name ?? "";

  const quotedByAvatarUrl =
    item.responded?.prepared_by_avatar ??
    item.responded?.prepared_by?.avatar_url ??
    item.responded?.avatar_url ??
    item.responded?.profile_image ??
    item.prepared_by_avatar ??
    item.avatarUrl ??
    null;

  const quotedByUrl =
    item.responded?.prepared_by_url ??
    item.responded?.prepared_by?.url ??
    item.responded?.account_url ??
    item.responded?.user_url ??
    item.user_url ??
    item.profile_url ??
    null;

  // Alerts/status mapping per requirements:
  // - REQUESTED or RESPONDED => show PENDING
  // - ACCEPTED => show ACCEPTED unless validUntil has passed, then EXPIRED
  // - DISCARDED => show DISCARDED
  const rawStatus =
    (item.status ?? item.state ?? item.status_label ?? item.responded?.status ?? item.responded?.state ?? "")
      .toString()
      .toUpperCase();
  let alerts: string;

  const isExpired = (() => {
    if (!validUntil) {
      return false;
    }
    const validDate = new Date(validUntil);
    return !isNaN(validDate.getTime()) && Date.now() > validDate.getTime();
  })();

  if (rawStatus === "DISCARDED") {
    alerts = "DISCARDED";
  } else if (rawStatus === "ACCEPTED") {
    alerts = isExpired ? "EXPIRED" : "ACCEPTED";
  } else if (rawStatus === "REQUESTED" || rawStatus === "RESPONDED") {
    alerts = "PENDING";
  } else {
    alerts = isExpired ? "EXPIRED" : rawStatus || "PENDING";
  }

  return {
    quotationNumber: reference,
    serviceType,
    dateQuoted,
    validUntil,
    quotedBy,
    quotedByAvatarUrl,
    quotedByUrl,
    status: rawStatus,
    alerts,
  };
}

function mapClientShipment(item: any): ClientShipment {
  return {
    referenceNumber: item.referenceNumber ?? item.reference_number ?? item.ref ?? "",
    blNumber: item.blNumber ?? item.bl_number ?? item.bl ?? "",
    serviceType: item.serviceType ?? item.service_type ?? item.service ?? "",
    transportMode: item.transportMode ?? item.transport_mode ?? item.mode ?? "",
    origin: item.origin ?? item.from ?? "",
    destination: item.destination ?? item.to ?? item.destination ?? "",
    eta: item.eta ?? item.estimated_arrival ?? item.eta_date ?? "",
    etd: item.etd ?? item.estimated_departure ?? item.etd_date ?? "",
    personInCharge: item.personInCharge ?? item.person_in_charge ?? item.pic ?? "",
    pic_image_path: item.pic_image_path ?? item.picImagePath ?? item.pic_image ?? null,
    status: item.status ?? item.state ?? "",
  };
}

function mapClientRegulatory(item: any): ClientRegulatory {
  return {
    regulatoryNumber: item.regulatoryNumber ?? item.reference_number ?? item.regulatory_number ?? item.id ?? "",
    applicationType: item.applicationType ?? item.application_type ?? item.app_type ?? "",
    typeOfApplication: item.typeOfApplication ?? item.type_of_application ?? item.type ?? "",
    issueDate: item.issueDate ?? item.issue_date ?? item.issued_at ?? "",
    expiryDate: item.expiryDate ?? item.expiry_date ?? item.expires_at ?? "",
    personInCharge: item.personInCharge ?? item.person_in_charge ?? item.pic ?? "",
    status: item.status ?? item.state ?? "",
  };
}

function unwrapResponsePayload(data: any): any {
  if (data && typeof data === "object" && "data" in data) {
    return unwrapResponsePayload(data.data);
  }
  return data;
}

function mapAccountSpecialistListItem(item: any): AccountListItem {
  return {
    id: item.employee_id,
    avatarUrl: item.profile_image ?? null,
    name: item.employee_name ?? "",
    email: item.email ?? "",
    contactNumber: item.contact_number ?? "",
    employee: {
      employeeNumber: item.employee_number ?? "",
      role: item.role ?? "",
      isLead: typeof item.role === "string" && item.role.toLowerCase().includes("lead"),
      requestAccepted: item.request_accepted ?? 0,
      quotationSent: item.quotation_sent ?? 0,
      quotationAccepted: item.qt_accepted_by_client ?? 0,
    },
    status: item.last_activity
      ? { state: "OFFLINE", lastSeen: new Date(item.last_activity) }
      : { state: "ACTIVE" },
  };
}

function mapAccountDashboardStats(data: any): AccountDashboardStats {
  const safeNumber = (value: unknown) => {
    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") {
      const parsed = Number(value);
      return Number.isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  return {
    totalEmployees: safeNumber(
      data.total_as ?? data.totalEmployees ?? data.total_accounts ?? 0,
    ),
    activeShipments: safeNumber(
      data.active_shipments ?? data.activeShipments ?? 0,
    ),
    activeRegulatory: safeNumber(
      data.active_regulatory ?? data.activeRegulatory ?? 0,
    ),
    pendingQuotations: safeNumber(
      data.pending_quotations ?? data.pendingQuotations ?? 0,
    ),
  };
}

/**
 * Accounts Service
 * Implements the AccountsAPI contract using axios.
 */
export const accountsService: AccountsAPI = {
  /**
   * Fetch paginated list of accounts (for table view).
   * Accepts optional filters: search, role, type, dateCreated.
   */
  async getAccountsList(page = 1, perPage = 10, filters = {}) {
    const response = await apiClient.get(`/accounts`, {
      params: {
        page,
        per_page: perPage,
        search: filters.search,
        role: filters.role,
        type: filters.type,
        date_created: filters.dateCreated,
      },
    });
    return {
      data: response.data.data as AccountListItem[],
      total: response.data.total,
      totalPages: response.data.total_pages,
    };
  },

  async getClientAccountsList(page = 1, perPage = 10, filters = {}) {
    const params: Record<string, any> = {
      search: filters.search,
      type: filters.type,
      date_created: filters.dateCreated,
    };

    if (perPage === 0) {
      params.all = true;
    } else {
      params.page = page;
      params.per_page = perPage;
    }

    const response = await apiClient.get(`/clients`, {
      headers: {
        Platform: "web",
      },
      params,
    });

    const payload = unwrapResponsePayload(response.data) as any;
    const clientItems = Array.isArray(payload)
      ? payload
      : normalizeArray<any>(payload.clients ?? payload.data ?? []);

    const totalClients = Array.isArray(payload)
      ? clientItems.length
      : payload.total_clients ?? payload.total ?? payload.pagination?.total ?? clientItems.length;

    const totalPages = Array.isArray(payload)
      ? perPage === 0
        ? 1
        : Math.max(1, Math.ceil(totalClients / perPage))
      : payload.total_pages ?? payload.pagination?.total_pages ?? (perPage === 0 ? 1 : Math.max(1, Math.ceil(totalClients / perPage)));

    const clients: AccountListItem[] = clientItems.map((client) => {
      const id = client.id ?? client.client_id ?? client.user_id ?? 0;
      const name = client.full_name ?? client.client_name ?? "";
      const companyName = client.company_name ?? client.company ?? "";
      const email = client.email ?? "";
      const contactNumber = client.contact_number ?? client.contactNumber ?? "";
      const profileImage = client.profile_image ?? client.avatarUrl ?? null;

      return {
        id,
        avatarUrl: profileImage,
        name,
        email,
        contactNumber,
        client: {
          clientName: name,
          companyName,
          type: client.type ?? undefined,
          pendingQuotations: client.pending_quotations ?? client.pendingQuotations ?? 0,
          activeShipment: client.active_shipments ?? client.activeShipment ?? 0,
          activeRegulatory: client.active_regulatory ?? client.activeRegulatory ?? 0,
        },
        status: { state: "ACTIVE" } as const,
      };
    });

    return {
      data: clients,
      total: totalClients,
      totalPages,
      stats: {
        totalClients: totalClients,
        newClients: payload.new_clients ?? 0,
        activeShipments: payload.active_shipments ?? 0,
        activeRegulatory: payload.active_regulatory ?? 0,
        pendingQuotations: payload.pending_quotations ?? 0,
      },
    };
  },

  async getAccountSpecialistsList(page = 1, perPage = 10, filters = {}) {
    const response = await apiClient.get(`/account-specialists`, {
      params: {
        page,
        per_page: perPage,
        'filter.search': filters.search,
        'filter.role': filters.role,
        date_created: filters.dateCreated,
      },
    });

    const responseBody = response.data ?? {};
    const payload = (responseBody.data ?? responseBody) as {
      account_specialists?: any[];
      pagination?: {
        total?: number;
        total_pages?: number;
        last_page?: number;
      };
    };

    const accountSpecialists: AccountListItem[] = normalizeArray<any>(payload.account_specialists)
      .map(mapAccountSpecialistListItem);

    return {
      data: accountSpecialists,
      total: payload.pagination?.total ?? accountSpecialists.length,
      totalPages:
        payload.pagination?.total_pages ??
        payload.pagination?.last_page ??
        Math.max(1, Math.ceil((payload.pagination?.total ?? accountSpecialists.length) / perPage)),
    };
  },

  /**
   * Create a new account.
   */
  async createAccount(payload: Partial<ClientDetails | EmployeeDetails>) {
    const response = await apiClient.post(`/accounts`, payload);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Update an existing account.
   */
  async updateAccount(id: number, payload: Partial<ClientDetails | EmployeeDetails>) {
    const response = await apiClient.put(`/accounts/${id}`, payload);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Deactivate an account (soft disable).
   */
  async deactivateAccount(id: number) {
    const response = await apiClient.post(`/accounts/${id}/deactivate`);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Archive an account (move to archived state).
   */
  async archiveAccount(id: number) {
    const response = await apiClient.post(`/accounts/${id}/archive`);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Fetch client dashboard stats.
   */
  async getClientDashboardStats() {
    const response = await apiClient.get(`/clients/summary`, {
      headers: {
        Platform: "web",
      },
    });

    const payload = unwrapResponsePayload(response.data) as any;

    return {
      totalClients: payload.total_clients ?? payload.total ?? 0,
      newClients: payload.new_clients ?? 0,
      activeShipments: payload.active_shipments ?? 0,
      activeRegulatory: payload.active_regulatory ?? 0,
      pendingQuotations: payload.pending_quotations ?? 0,
    };
  },

  async getClientQuotations(clientId: number, params?: Record<string, unknown>) {
    const response = await apiClient.get(`/clients/${clientId}/quotations`, { params });
    const payload = unwrapResponsePayload(response.data) as any;
    const quotations = normalizeArray<any>(payload?.quotations ?? payload?.data ?? payload);

    return quotations.map(mapClientQuotation);
  },

  async getClientShipments(clientId: number, params?: Record<string, unknown>) {
    const response = await apiClient.get(`/clients/${clientId}/shipments`, { params });
    const payload = unwrapResponsePayload(response.data) as any;
    const shipments = normalizeArray<any>(payload?.shipments ?? payload?.data ?? payload);

    return shipments.map(mapClientShipment);
  },

  async getClientRegulatory(clientId: number, params?: Record<string, unknown>) {
    const response = await apiClient.get(`/clients/${clientId}/regulatory`, { params });
    const payload = unwrapResponsePayload(response.data) as any;
    const regulatory = normalizeClientRegulatoryRows(payload?.regulatory ?? payload?.data ?? payload);

    return regulatory.map(mapClientRegulatory);
  },

  /**
   * Fetch account (employees) dashboard stats.
   */
  async getAccountDashboardStats() {
    const response = await apiClient.get(`/account-specialists/summary`, {
      headers: {
        Platform: "web",
      },
    });
    const payload = unwrapResponsePayload(response.data);
    return mapAccountDashboardStats(payload);
  },

  /**
   * Fetch full client profile details by ID.
   */
  async getClientDetails(id: number) {
    const response = await apiClient.get(`/clients/${id}`);
    return mapAccountDetailsFromClientResource(response.data.data ?? response.data);
  },

  /**
   * Fetch full client details by ID for client detail view.
   */
  async getClientFullDetails(id: number) {
    const response = await apiClient.get(`/clients/${id}`);
    const data = response.data.data ?? response.data;

    return {
      clientId: data.id ?? Number(id),
      clientName:
        data.client_name ?? data.full_name ?? `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
      position: data.position ?? data.company_position ?? "",
      contactNumber: data.contact_number ?? data.contactNumber ?? "",
      email: data.email ?? "",
      dateCreated: data.date_created ?? data.created_at ?? "",
      companyName: data.company_name ?? data.company ?? "",
      companyAddress: data.company_address ?? data.address ?? "",
      businessType: data.business_type ?? data.businessType ?? "",
      quotationStats: {
        totalQuotation:
          data.quotation_stats?.total ??
          data.total_quotations ??
          (data.quotations?.pending ?? 0) + (data.quotations?.accepted ?? 0),
        pendingQuotation:
          data.quotation_stats?.pending ??
          data.pending_quotations ??
          data.quotations?.pending ??
          0,
        acceptedQuotation:
          data.quotation_stats?.accepted ??
          data.accepted_quotations ??
          data.quotations?.accepted ??
          0,
      },
      regulatoryStats: {
        totalRegulatory:
          data.regulatory_stats?.total ??
          data.total_regulatory ??
          (data.regulatory?.ongoing ?? 0) + (data.regulatory?.completed ?? 0),
        ongoingRegulatory:
          data.regulatory_stats?.ongoing ??
          data.ongoing_regulatory ??
          data.regulatory?.ongoing ??
          0,
        completedRegulatory:
          data.regulatory_stats?.completed ??
          data.completed_regulatory ??
          data.regulatory?.completed ??
          0,
      },
      shipmentStats: {
        totalShipments:
          data.shipment_stats?.total ??
          data.total_shipments ??
          (data.shipments?.in_progress ?? 0) + (data.shipments?.completed ?? 0),
        inProgressShipments:
          data.shipment_stats?.in_progress ??
          data.in_progress_shipments ??
          data.shipments?.in_progress ??
          0,
        completedShipments:
          data.shipment_stats?.completed ??
          data.completed_shipments ??
          data.shipments?.completed ??
          0,
      },
      quotations: normalizeArray(data.quotations),
      shipments: normalizeArray(data.shipments),
      regulatory: normalizeClientRegulatoryRows(data.regulatory) as ClientRegulatory[],
    };
  },

  /**
   * Fetch full employee profile details by ID.
   */
  async getEmployeeDetails(id: number) {
    const response = await apiClient.get(`/users/${id}`);
    return {
      ...mapAccountDetailsFromUser(response.data.data),
      isLead: false,
      employeeNumber: response.data.data.employee_number ?? undefined,
      status: { state: "ACTIVE" },
    };
  },
};
