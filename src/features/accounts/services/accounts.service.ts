import { GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  AccountListItem,
  AccountDetails,
  ClientDetails,
  ClientDashboardStats,
  AccountDashboardStats,
  ClientQuotation,
  ClientShipment,
  ClientRegulatory,
  EmployeeDetails,
} from "../types/accounts.types";

interface RawClientListItem {
  client_id: number;
  profile_image: string | null;
  client_name: string;
  company_name: string;
  email: string;
  contact_number: string;
  type: "OLD" | "NEW";
  pending_quotations: number;
  active_shipments: number;
  active_regulatory: number;
}

interface RawClientDashboardStats {
  total_clients: number;
  new_clients: number;
  active_shipments: number;
  active_regulatory: number;
  pending_quotations: number;
}

interface RawAccountDashboardStats {
  total_as: number;
  active_shipments: number;
  active_regulatory: number;
  pending_quotations: number;
}

interface RawAccountSpecialist {
  employee_id: string;
  profile_image: string | null;
  employee_name: string;
  email: string;
  contact_number: string;
  request_accepted: string;
  quotation_sent: string;
  qt_accepted_by_client: string;
  role: string;
  last_activity: string;
}

interface RawAccountSpecialistsPayload {
  account_specialists: RawAccountSpecialist[];
  pagination: {
    current_page: number;
    total_pages: number;
    count: string;
    per_page: number;
    total: number;
  };
}

interface RawClientDetailsResponse {
  client_id: string;
  client_name: string;
  position: string;
  contact_number: string;
  email: string;
  date_created: string;
  company_name: string;
  company_address: string;
  business_type: string;
  quotations?: {
    pending: string;
    accepted: string;
    total: string;
  };
  shipments?: {
    in_progress: string;
    completed: string;
    total: string;
  };
  regulatory?: {
    ongoing: string;
    completed: string;
    total: string;
  };
  quotations_list?: ClientQuotation[];
  shipments_list?: ClientShipment[];
  regulatory_list?: ClientRegulatory[];
}

interface RawClientQuotation {
  reference_number: string;
  service_type: string;
  date_quoted: string;
  valid_until: string;
  quoted_by: string;
  pic_image_path: string | null;
  status: string;
  alerts: string;
  days_until_expiration: string;
}

interface RawClientShipment {
  reference_number: string;
  bl_number: string;
  service_type: string;
  transport_mode: string;
  origin: string;
  destination: string;
  eta: string;
  etd: string;
  person_in_charge: string;
  pic_image_path: string | null;
  status: string;
}

interface RawClientRegulatory {
  reference_number: string;
  application_type: string;
  type_of_application: string;
  issue_date: string;
  expiry_date: string;
  person_in_charge: string;
  pic_image_path: string | null;
  status: string;
}

const mapRawClientQuotation = (raw: RawClientQuotation): ClientQuotation => ({
  quotationNumber: raw.reference_number,
  serviceType: raw.service_type,
  dateQuoted: raw.date_quoted,
  validUntil: raw.valid_until,
  quotedBy: raw.quoted_by,
  quotedByAvatarUrl: raw.pic_image_path ?? undefined,
  status: raw.status,
  alerts: raw.alerts,
});

const mapRawClientShipment = (raw: RawClientShipment): ClientShipment => ({
  referenceNumber: raw.reference_number,
  blNumber: raw.bl_number,
  serviceType: raw.service_type,
  transportMode: raw.transport_mode,
  origin: raw.origin,
  destination: raw.destination,
  eta: raw.eta,
  etd: raw.etd,
  personInCharge: raw.person_in_charge,
  pic_image_path: raw.pic_image_path,
  status: raw.status,
});

const mapRawClientRegulatory = (raw: RawClientRegulatory): ClientRegulatory => ({
  regulatoryNumber: raw.reference_number,
  applicationType: raw.application_type,
  typeOfApplication: raw.type_of_application,
  issueDate: raw.issue_date,
  expiryDate: raw.expiry_date,
  personInCharge: raw.person_in_charge,
  status: raw.status,
});

interface ClientListPayload {
  clients: RawClientListItem[];
  pagination: {
    current_page: number;
    total_pages: number;
    count: number;
    per_page: number;
    total: number;
  };
}

const mapClientToAccountListItem = (client: RawClientListItem): AccountListItem => ({
  id: client.client_id,
  avatarUrl: client.profile_image,
  name: client.client_name,
  email: client.email,
  contactNumber: client.contact_number,
  client: {
    clientName: client.client_name,
    companyName: client.company_name,
    type: client.type,
    pendingQuotations: client.pending_quotations,
    activeShipment: client.active_shipments,
    activeRegulatory: client.active_regulatory,
  },
  status: { state: "ACTIVE" },
});

const parseAccountSpecialistCount = (value: string): number => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseLastActivityStatus = (value: string) => {
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) {
    return { state: "OFFLINE" as const, lastSeen: parsed };
  }

  return { state: "ACTIVE" as const };
};

const mapRawAccountSpecialist = (raw: RawAccountSpecialist): AccountListItem => ({
  id: Number(raw.employee_id) || 0,
  avatarUrl: raw.profile_image,
  name: raw.employee_name,
  email: raw.email,
  contactNumber: raw.contact_number,
  employee: {
    employeeNumber: raw.employee_id,
    role: raw.role,
    isLead: false,
    requestAccepted: parseAccountSpecialistCount(raw.request_accepted),
    quotationSent: parseAccountSpecialistCount(raw.quotation_sent),
    quotationAccepted: parseAccountSpecialistCount(raw.qt_accepted_by_client),
  },
  status: parseLastActivityStatus(raw.last_activity),
});

const parseNumber = (value: string | number | undefined): number => {
  if (value === undefined || value === null) {
    return 0;
  }
  const numberValue = Number(value);
  return Number.isNaN(numberValue) ? 0 : numberValue;
};

const mapClientDetailsResponse = (payload: RawClientDetailsResponse): ClientDetails => ({
  clientId: Number(payload.client_id) || 0,
  clientName: payload.client_name,
  position: payload.position,
  contactNumber: payload.contact_number,
  email: payload.email,
  dateCreated: payload.date_created,
  companyName: payload.company_name,
  companyAddress: payload.company_address,
  businessType: payload.business_type,
  quotationStats: {
    totalQuotation: parseNumber(payload.quotations?.total),
    pendingQuotation: parseNumber(payload.quotations?.pending),
    acceptedQuotation: parseNumber(payload.quotations?.accepted),
  },
  shipmentStats: {
    totalShipments: parseNumber(payload.shipments?.total),
    inProgressShipments: parseNumber(payload.shipments?.in_progress),
    completedShipments: parseNumber(payload.shipments?.completed),
  },
  regulatoryStats: {
    totalRegulatory: parseNumber(payload.regulatory?.total),
    ongoingRegulatory: parseNumber(payload.regulatory?.ongoing),
    completedRegulatory: parseNumber(payload.regulatory?.completed),
  },
  quotations: Array.isArray(payload.quotations_list) ? payload.quotations_list : [],
  shipments: Array.isArray(payload.shipments_list) ? payload.shipments_list : [],
  regulatory: Array.isArray(payload.regulatory_list) ? payload.regulatory_list : [],
});

/**
 * Accounts Service
 * Provides methods to interact with the backend accounts API.
 */
export const accountsService = {
  /**
   * Fetch paginated list of accounts (for table view).
   */
  async getAccountsList(
    page = 1,
    perPage = 10,
  ): Promise<{ data: AccountListItem[]; total: number; totalPages: number }> {
    const response = await GET<ApiResponse<{ data: AccountListItem[]; total: number; totalPages: number }>>(
      "/accounts",
      { params: { page, per_page: perPage } },
    );
    return response.data;
  },

  /**
   * Fetch full account details by ID.
   */
  async getAccountDetails(id: number): Promise<AccountDetails> {
    const response = await GET<ApiResponse<AccountDetails>>(`/accounts/${id}`);
    return response.data;
  },

  /**
   * Fetch full client details by ID for client detail view.
   */
  async getClientFullDetails(id: number): Promise<ClientDetails> {
    const response = await GET<ApiResponse<RawClientDetailsResponse>>(
      `/clients/${id}`,
    );
    return mapClientDetailsResponse(response.data);
  },

  async getClientDetails(id: number): Promise<AccountDetails> {
    const response = await GET<ApiResponse<AccountDetails>>(`/users/clients/${id}`);
    return response.data;
  },

  async getClientAccountsList(
    page = 1,
    perPage = 10,
    filters?: Record<string, unknown>,
  ): Promise<{ data: AccountListItem[]; total: number; totalPages: number; stats: ClientDashboardStats }> {
    const response = await GET<ApiResponse<ClientListPayload>>("/clients", {
      params: { page, per_page: perPage, ...filters },
    });

    const payload = response.data;
    const clients = payload.clients.map(mapClientToAccountListItem);

    return {
      data: clients,
      total: payload.pagination.total,
      totalPages: payload.pagination.total_pages,
      stats: {
        totalClients: payload.pagination.total,
        newClients: 0,
        activeShipments: 0,
        activeRegulatory: 0,
        pendingQuotations: 0,
      },
    };
  },

  async getAccountSpecialistsList(
    page = 1,
    perPage = 10,
    filters?: Record<string, unknown>,
  ): Promise<{ data: AccountListItem[]; total: number; totalPages: number }> {
    const response = await GET<ApiResponse<RawAccountSpecialistsPayload>>(
      "/account-specialists",
      {
        params: { page, per_page: perPage, ...filters },
      },
    );

    const payload = response.data;
    const specialists = payload.account_specialists.map(mapRawAccountSpecialist);

    return {
      data: specialists,
      total: payload.pagination.total,
      totalPages: payload.pagination.total_pages,
    };
  },

  async getClientDashboardStats(): Promise<ClientDashboardStats> {
    const response = await GET<ApiResponse<RawClientDashboardStats>>(
      "/clients/summary",
    );

    const raw = response.data;
    return {
      totalClients: raw.total_clients,
      newClients: raw.new_clients,
      activeShipments: raw.active_shipments,
      activeRegulatory: raw.active_regulatory,
      pendingQuotations: raw.pending_quotations,
    };
  },

  async getAccountDashboardStats(): Promise<AccountDashboardStats> {
    const response = await GET<ApiResponse<RawAccountDashboardStats>>(
      "/account-specialists/summary",
    );

    const raw = response.data;
    return {
      totalEmployees: raw.total_as,
      activeShipments: raw.active_shipments,
      activeRegulatory: raw.active_regulatory,
      pendingQuotations: raw.pending_quotations,
    };
  },

  async getClientQuotations(
    clientId: number,
    params: Record<string, unknown> = {},
  ): Promise<ClientQuotation[]> {
    const response = await GET<ApiResponse<{
      quotations: RawClientQuotation[];
      pagination: {
        current_page: number;
        total_pages: number;
        count: string;
        per_page: number;
        total: number;
      };
    }>>(`/clients/${clientId}/quotations`, { params });

    return response.data.quotations.map(mapRawClientQuotation);
  },

  async getClientShipments(
    clientId: number,
    params: Record<string, unknown> = {},
  ): Promise<ClientShipment[]> {
    const response = await GET<ApiResponse<{
      shipments: RawClientShipment[];
      pagination: {
        current_page: number;
        total_pages: number;
        count: string;
        per_page: number;
        total: number;
      };
    }>>(`/clients/${clientId}/shipments`, { params });

    return response.data.shipments.map(mapRawClientShipment);
  },

  async getClientRegulatory(
    clientId: number,
    params: Record<string, unknown> = {},
  ): Promise<ClientRegulatory[]> {
    const response = await GET<ApiResponse<{
      regulatory: RawClientRegulatory[];
      pagination: {
        current_page: number;
        total_pages: number;
        count: string;
        per_page: number;
        total: number;
      };
    }>>(`/clients/${clientId}/regulatory`, { params });

    return response.data.regulatory.map(mapRawClientRegulatory);
  },

  async getEmployeeDetails(id: number): Promise<EmployeeDetails> {
    const response = await GET<ApiResponse<EmployeeDetails>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new account.
   */
  async createAccount(payload: Partial<AccountDetails>): Promise<AccountDetails> {
    const response = await POST<ApiResponse<AccountDetails>>("/accounts", payload);
    return response.data;
  },

  /**
   * Update an existing account.
   */
  async updateAccount(id: number, payload: Partial<AccountDetails>): Promise<AccountDetails> {
    const response = await PUT<ApiResponse<AccountDetails>>(`/accounts/${id}`, payload);
    return response.data;
  },

  /**
   * Deactivate an account (soft disable).
   */
  async deactivateAccount(id: number): Promise<AccountDetails> {
    const response = await POST<ApiResponse<AccountDetails>>(`/accounts/${id}/deactivate`);
    return response.data;
  },

  /**
   * Archive an account (move to archived state).
   */
  async archiveAccount(id: number): Promise<AccountDetails> {
    const response = await POST<ApiResponse<AccountDetails>>(`/accounts/${id}/archive`);
    return response.data;
  },
};
