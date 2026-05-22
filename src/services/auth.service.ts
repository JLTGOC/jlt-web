import { apiClient, POST } from "@/lib/api/client";
import type { LoginRequest, LoginResponse } from "@/types/api";

export const authService = {
  /**
   * Initialize CSRF cookie for Sanctum
   * GET /sanctum/csrf-cookie
   */
  async initCsrf(): Promise<void> {
    const base = import.meta.env.VITE_API_BASE_URL as string;
    const origin = base.replace(/\/api\/?$/, "");
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
