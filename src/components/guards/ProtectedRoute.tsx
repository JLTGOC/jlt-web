import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";
import { userService } from "@/services/user.service";
import { useEffect, useState } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";

interface ProtectedRouteProps {
  /**
   * Whether to fetch fresh user data from API
   * Useful if you want to ensure user data is up-to-date
   *
   * @default true
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
  fetchUserData = true,
}: ProtectedRouteProps = {}) {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const [isVerifying, setIsVerifying] = useState(Boolean(user));
  const userId = user?.id;

  useEffect(() => {
    if (!userId) {
      logout();
      setIsVerifying(false);
      return;
    }

    userService
      .getById(userId)
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setIsVerifying(false);
      });
  }, [userId, setUser, logout, fetchUserData]);

  if (isVerifying) {
    return (
      <Center mih="100vh">
        <Stack gap="xs" align="center">
          <Loader size="lg" color="jltBlue" type="dots" />
          <Text size="sm" c="dimmed">
            Verifying your session...
          </Text>
        </Stack>
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
}
