import { apiClient, POST } from "@/lib/api/client";
import { getApiOriginUrl } from "@/lib/api/base-url";
import type { LoginRequest, LoginResponse } from "@/types/api";

export const authService = {
  /**
   * Initialize CSRF cookie for Sanctum
   * GET /sanctum/csrf-cookie
   */
  async initCsrf(): Promise<void> {
    const origin = getApiOriginUrl();
    await apiClient.get(`${origin}/sanctum/csrf-cookie`);
  },

  /**
   * Login user
   * POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    await this.initCsrf();
    return POST<LoginResponse>("/auth/login", credentials);
  },

  /**
   * Logout user
   * POST /auth/logout
   * Requires authentication
   */
  async logout(): Promise<void> {
    return POST<void>("/auth/logout");
  },
};
