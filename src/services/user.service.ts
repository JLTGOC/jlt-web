import { GET } from "@/lib/api/client";
import type { ApiResponse, UserResource } from "@/types/api";

/**
 * User Service
 *
 * Provides methods for interacting with user-related endpoints.
 */
export const userService = {
  /**
   * Get user by ID
   * GET /users/{user}
   *
   * Requires authentication
   *
   * @param userId - The user ID to fetch
   * @returns UserResource wrapped in ApiResponse
   *
   * @example
   * const response = await userService.getById(123);
   * const user = response.data;
   * authStore.setUser(user);
   */
  async getById(userId: number): Promise<ApiResponse<UserResource>> {
    return GET<ApiResponse<UserResource>>(`/users/${userId}`);
  },

  /**
   * Get current authenticated user
   * GET /users/{user} (using current user's ID)
   *
   * Requires authentication
   *
   * @returns UserResource wrapped in ApiResponse
   *
   * @example
   * // Get current user's ID from store
   * const currentUserId = useAuthStore.getState().user?.id;
   * if (currentUserId) {
   *   const response = await userService.getMe(currentUserId);
   *   authStore.setUser(response.data);
   * }
   */
  async getMe(userId: number): Promise<ApiResponse<UserResource>> {
    return this.getById(userId);
  },

  /**
   * Refresh current user data
   * Fetches latest user data and updates the store
   *
   * @param userId - The current user's ID
   * @returns Updated UserResource
   *
   * @example
   * import { useAuthStore } from '@/stores/authStore';
   * import { userService } from '@/services/user.service';
   *
   * async function refreshUser() {
   *   const currentUser = useAuthStore.getState().user;
   *   if (currentUser) {
   *     const response = await userService.refreshCurrentUser(currentUser.id);
   *     useAuthStore.getState().setUser(response.data);
   *   }
   * }
   */
  async refreshCurrentUser(userId: number): Promise<ApiResponse<UserResource>> {
    return this.getById(userId);
  },
};
