import axios from "axios";
import type { AccountListItem, AccountDetails } from "../types/accounts.types";
import { getApiBaseUrl } from "@/lib/api/base-url";

const API_BASE_URL = getApiBaseUrl();

/**
 * Accounts Service
 * Provides methods to interact with the backend accounts API.
 */
export const accountsService = {
  /**
   * Fetch paginated list of accounts (for table view).
   */
  async getAccountsList(page = 1, perPage = 10): Promise<AccountListItem[]> {
    const response = await axios.get(`${API_BASE_URL}/accounts`, {
      params: { page, per_page: perPage },
    });
    return response.data.data as AccountListItem[];
  },

  /**
   * Fetch full account details by ID.
   */
  async getAccountDetails(id: number): Promise<AccountDetails> {
    const response = await axios.get(`${API_BASE_URL}/accounts/${id}`);
    return response.data.data as AccountDetails;
  },

  /**
   * Create a new account.
   */
  async createAccount(payload: Partial<AccountDetails>): Promise<AccountDetails> {
    const response = await axios.post(`${API_BASE_URL}/accounts`, payload);
    return response.data.data as AccountDetails;
  },

  /**
   * Update an existing account.
   */
  async updateAccount(id: number, payload: Partial<AccountDetails>): Promise<AccountDetails> {
    const response = await axios.put(`${API_BASE_URL}/accounts/${id}`, payload);
    return response.data.data as AccountDetails;
  },

  /**
   * Deactivate an account (soft disable).
   */
  async deactivateAccount(id: number): Promise<AccountDetails> {
    const response = await axios.post(`${API_BASE_URL}/accounts/${id}/deactivate`);
    return response.data.data as AccountDetails;
  },

  /**
   * Archive an account (move to archived state).
   */
  async archiveAccount(id: number): Promise<AccountDetails> {
    const response = await axios.post(`${API_BASE_URL}/accounts/${id}/archive`);
    return response.data.data as AccountDetails;
  },
};
