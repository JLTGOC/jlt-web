import { useAuthStore } from "@/stores/authStore";
import { toUser, hasRole } from "@/lib/mappers/user.mapper";
import { Navigate } from "react-router";
import type { Role } from "@/types/roles";

interface RoleGuardProps {
  /**
   * List of roles that are allowed to access this route
   */
  allowedRoles: Role[];

  /**
   * The content to render if user has access
   */
  children: React.ReactNode;

  /**
   * Optional fallback to render if user doesn't have access
   * Defaults to redirect to /unauthorized
   */
  fallback?: React.ReactNode;

  /**
   * Optional redirect path if user doesn't have access
   * Defaults to '/unauthorized'
   */
  redirectTo?: string;
}

/**
 * RoleGuard Component
 *
 * Protects routes based on user roles.
 * Only renders children if user has one of the allowed roles.
 *
 * @example
 * // In router configuration
 * {
 *   path: '/admin',
 *   Component: () => (
 *     <RoleGuard allowedRoles={[ROLES.ACCOUNT_SPECIALIST, ROLES.HUMAN_RESOURCE]}>
 *       <AdminPanel />
 *     </RoleGuard>
 *   )
 * }
 *
 * @example
 * // With custom fallback
 * <RoleGuard
 *   allowedRoles={[ROLES.MARKETING]}
 *   fallback={<div>You don't have permission to view this</div>}
 * >
 *   <MarketingDashboard />
 * </RoleGuard>
 */
export function RoleGuard({
  allowedRoles,
  children,
  fallback,
  redirectTo = "/unauthorized",
}: RoleGuardProps) {
  const userResource = useAuthStore((state) => state.user);

  // If not authenticated at all, redirect to login
  if (!userResource) {
    return <Navigate to="/login" replace />;
  }

  const user = toUser(userResource);

  // Check if user has any of the allowed roles
  const hasAccess = allowedRoles.some((role) => hasRole(user, role));

  if (!hasAccess) {
    // If fallback provided, render it
    if (fallback) {
      return <>{fallback}</>;
    }

    // Otherwise redirect
    return <Navigate to={redirectTo} replace />;
  }

  // User has access, render children
  return <>{children}</>;
}
