// src/features/accounts/api/accounts.api.ts
import type {
  AccountListItem,
  ClientDashboardStats,
  AccountDashboardStats,
  ClientDetails,
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
   * GET /accounts/dashboard/clients
   * Fetch client dashboard stats.
   * Response: ClientDashboardStats
   */
  getClientDashboardStats: () => Promise<ClientDashboardStats>;

  /**
   * GET /accounts/dashboard/employees
   * Fetch account (employees) dashboard stats.
   * Response: AccountDashboardStats
   */
  getAccountDashboardStats: () => Promise<AccountDashboardStats>;

  /**
   * GET /accounts/clients/:id
   * Fetch full client profile details by ID.
   * Response: ClientDetails
   */
  getClientDetails: (id: number) => Promise<ClientDetails>;

  /**
   * GET /accounts/employees/:id
   * Fetch full employee profile details by ID.
   * Response: EmployeeDetails
   */
  getEmployeeDetails: (id: number) => Promise<EmployeeDetails>;
}
