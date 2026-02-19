import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/stores/authStore";

/**
 * GuestRoute Component
 *
 * Wraps routes that should only be accessible to unauthenticated users (login, register).
 * Redirects to dashboard if user is already authenticated.
 *
 * Usage in router:
 * {
 *   Component: GuestRoute,
 *   children: [
 *     { path: "/login", Component: LoginPage },
 *     { path: "/register", Component: RegisterPage }
 *   ]
 * }
 */
export function GuestRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, render child routes (login, register, etc.)
  return <Outlet />;
}
