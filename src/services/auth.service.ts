import { POST } from "@/lib/api/client";
import type { LoginRequest, LoginResponse } from "@/types/api";

export const authService = {
  /**
   * Login user
   * POST /auth/login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
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
