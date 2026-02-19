import { GET } from "@/lib/api/client";
import type { DashboardResponse } from "@/features/dashboard/types/dashboard";

/**
 * Dashboard Service
 *
 * Fetches role-based dashboard data from the backend.
 * The /dashboard endpoint returns different data based on the authenticated user's role.
 */
export const dashboardService = {
  /**
   * Get dashboard data for current user
   * GET /dashboard
   *
   * Returns role-specific dashboard data:
   * - Client: shipments, quotations
   * - Account Specialist: leads, shipments, quotations, accounts
   * - Marketing: views, videos, articles
   * - HR: generic dashboard data
   *
   * Requires authentication
   *
   * @example
   * const response = await dashboardService.getDashboardData();
   *
   * // Type guard to determine role
   * if (isClientDashboard(response.data)) {
   *   console.log(response.data.shipments.ongoing_count);
   * }
   */
  async getDashboardData(): Promise<DashboardResponse> {
    return GET<DashboardResponse>("/dashboard");
  },
};
