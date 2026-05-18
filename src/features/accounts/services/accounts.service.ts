// src/features/accounts/services/accountsService.ts
import axios from "axios";
import type {
  AccountListItem,
  ClientDashboardStats,
  AccountDashboardStats,
  ClientDetails,
  EmployeeDetails,
} from "../types/accounts.types";
import type { AccountsAPI } from "../api/accounts.api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const response = await axios.get(`${API_BASE_URL}/accounts`, {
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

  /**
   * Create a new account.
   */
  async createAccount(payload: Partial<ClientDetails | EmployeeDetails>) {
    const response = await axios.post(`${API_BASE_URL}/accounts`, payload);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Update an existing account.
   */
  async updateAccount(id: number, payload: Partial<ClientDetails | EmployeeDetails>) {
    const response = await axios.put(`${API_BASE_URL}/accounts/${id}`, payload);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Deactivate an account (soft disable).
   */
  async deactivateAccount(id: number) {
    const response = await axios.post(`${API_BASE_URL}/accounts/${id}/deactivate`);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Archive an account (move to archived state).
   */
  async archiveAccount(id: number) {
    const response = await axios.post(`${API_BASE_URL}/accounts/${id}/archive`);
    return response.data.data as ClientDetails | EmployeeDetails;
  },

  /**
   * Fetch client dashboard stats.
   */
  async getClientDashboardStats() {
    const response = await axios.get(`${API_BASE_URL}/accounts/dashboard/clients`);
    return response.data.data as ClientDashboardStats;
  },

  /**
   * Fetch account (employees) dashboard stats.
   */
  async getAccountDashboardStats() {
    const response = await axios.get(`${API_BASE_URL}/accounts/dashboard/employees`);
    return response.data.data as AccountDashboardStats;
  },

  /**
   * Fetch full client profile details by ID.
   */
  async getClientDetails(id: number) {
    const response = await axios.get(`${API_BASE_URL}/accounts/clients/${id}`);
    return response.data.data as ClientDetails;
  },

  /**
   * Fetch full employee profile details by ID.
   */
  async getEmployeeDetails(id: number) {
    const response = await axios.get(`${API_BASE_URL}/accounts/employees/${id}`);
    return response.data.data as EmployeeDetails;
  },
};
