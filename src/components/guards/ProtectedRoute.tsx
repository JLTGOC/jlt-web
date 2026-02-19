import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/user.service";
import { useEffect, useState } from "react";
import { Loader } from "@mantine/core";

interface ProtectedRouteProps {
  /**
   * Whether to fetch fresh user data from API
   * Useful if you want to ensure user data is up-to-date
   *
   * @default false
   */
  fetchUserData?: boolean;
}

/**
 * ProtectedRoute Component
 *
 * Wraps routes that require authentication.
 * Redirects to login if user is not authenticated.
 *
 * Optionally fetches fresh user data from /users/{user} endpoint.
 *
 * @example
 * // Basic usage (uses cached user from login)
 * {
 *   Component: ProtectedRoute,
 *   children: [...]
 * }
 *
 * @example
 * // Fetch fresh user data
 * {
 *   Component: () => <ProtectedRoute fetchUserData />,
 *   children: [...]
 * }
 */
export function ProtectedRoute({
  fetchUserData = false,
}: ProtectedRouteProps = {}) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [isLoading, setIsLoading] = useState(fetchUserData);

  useEffect(() => {
    async function fetchUser() {
      if (fetchUserData && user?.id) {
        try {
          const response = await userService.getById(user.id);
          setUser(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          // Continue anyway with cached user data
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchUser();
  }, [fetchUserData, user?.id, setUser]);

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If fetching user data, show loading state
  if (isLoading) {
    return <Loader size="lg" color="jltBlue" />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}
