// src/features/accounts/api/accounts.api.ts
import type {
  AccountListItem,
  AccountDetails,
  ClientDashboardStats,
  AccountDashboardStats,
  ClientDetails,
  ClientQuotation,
  ClientShipment,
  ClientRegulatory,
  EmployeeDetails,
} from "../types/accounts.types";

/**
 * Accounts API Contract
 * Defines the endpoints and expected payloads/responses for the Accounts module.
 */
export interface AccountsAPI {
  /**
   * GET /accounts
   * Fetch paginated list of accounts (clients or employees).
   * Query params: page, per_page, filters (search, role, dateCreated, type)
   * Response: { data: AccountListItem[], total: number, totalPages: number }
   */
  getAccountsList: (
    page?: number,
    perPage?: number,
    filters?: {
      search?: string;
      role?: string;
      type?: string; // "NEW" | "OLD"
      dateCreated?: string; // ISO date string
    }
  ) => Promise<{
    data: AccountListItem[];
    total: number;
    totalPages: number;
  }>;

  /**
   * GET /clients
   * Fetch client list with dashboard stats.
   */
  getClientAccountsList: (
    page?: number,
    perPage?: number,
    filters?: {
      search?: string;
      type?: string; // "NEW" | "OLD"
      dateCreated?: string; // ISO date string
    }
  ) => Promise<{
    data: AccountListItem[];
    total: number;
    totalPages: number;
    stats: ClientDashboardStats;
  }>;

  /**
   * GET /account-specialists
   * Fetch account specialist employees list with dashboard metrics.
   */
  getAccountSpecialistsList: (
    page?: number,
    perPage?: number,
    filters?: {
      search?: string;
      role?: string;
      dateCreated?: string; // ISO date string
    }
  ) => Promise<{
    data: AccountListItem[];
    total: number;
    totalPages: number;
  }>;

  /**
   * POST /accounts
   * Create a new account (client or employee).
   * Payload: Partial<ClientDetails | EmployeeDetails>
   * Response: ClientDetails | EmployeeDetails
   */
  createAccount: (
    payload: Partial<ClientDetails | EmployeeDetails>
  ) => Promise<ClientDetails | EmployeeDetails>;

  /**
   * PUT /accounts/:id
   * Update an existing account (client or employee).
   * Payload: Partial<ClientDetails | EmployeeDetails>
   * Response: ClientDetails | EmployeeDetails
   */
  updateAccount: (
    id: number,
    payload: Partial<ClientDetails | EmployeeDetails>
  ) => Promise<ClientDetails | EmployeeDetails>;

  /**
   * POST /accounts/:id/deactivate
   * Deactivate an account (soft disable).
   * Response: ClientDetails | EmployeeDetails
   */
  deactivateAccount: (id: number) => Promise<ClientDetails | EmployeeDetails>;

  /**
   * POST /accounts/:id/archive
   * Archive an account (move to archived state).
   * Response: ClientDetails | EmployeeDetails
   */
  archiveAccount: (id: number) => Promise<ClientDetails | EmployeeDetails>;

  /**
   * GET /users/clients
   * Fetch client dashboard stats from the client accounts endpoint.
   * Response: ClientDashboardStats
   */
  getClientDashboardStats: () => Promise<ClientDashboardStats>;

  /**
   * GET /account-specialists/summary
   * Fetch account specialist summary stats.
   * Response: AccountDashboardStats
   */
  getAccountDashboardStats: () => Promise<AccountDashboardStats>;

  /**
   * GET /users/clients/:id
   * Fetch full client profile details by ID.
   * Response: AccountDetails
   */
  getClientDetails: (id: number) => Promise<AccountDetails>;

  /**
   * GET /users/clients/:id/full
   * Fetch full client details by ID for client detail view.
   * Response: ClientDetails
   */
  getClientFullDetails: (id: number) => Promise<ClientDetails>;

  /**
   * GET /clients/:id/quotations
   * Fetch the client's quotation records.
   */
  getClientQuotations: (clientId: number, params?: Record<string, unknown>) => Promise<ClientQuotation[]>;

  /**
   * GET /clients/:id/shipments
   * Fetch the client's shipment records.
   */
  getClientShipments: (clientId: number, params?: Record<string, unknown>) => Promise<ClientShipment[]>;

  /**
   * GET /clients/:id/regulatory
   * Fetch the client's regulatory records.
   */
  getClientRegulatory: (clientId: number, params?: Record<string, unknown>) => Promise<ClientRegulatory[]>;

  /**
   * GET /users/:id
   * Fetch full employee profile details by ID.
   * Response: EmployeeDetails
   */
  getEmployeeDetails: (id: number) => Promise<EmployeeDetails>;
}
