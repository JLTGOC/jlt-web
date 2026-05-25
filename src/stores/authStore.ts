import { create } from "zustand";
import type { UserResource } from "@/types/api";

interface AuthState {
  user: UserResource | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (user: UserResource) => void;
  logout: () => void;
  setUser: (user: UserResource) => void;
  initAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const USER_KEY = "auth_user";
// Cookie-based auth: persist only user snapshot for UI (no JS tokens).

const readStoredUser = (): UserResource | null => {
  const userStr = localStorage.getItem(USER_KEY);

  if (!userStr) {
    return null;
  }

  try {
    return JSON.parse(userStr) as UserResource;
  } catch (error) {
    localStorage.removeItem(USER_KEY);
    console.error("Failed to parse stored user data:", error);
    return null;
  }
};

const storedUser = readStoredUser();

/**
 * Authentication Store
 *
 * Manages user authentication state using Zustand
 * Persists auth data to localStorage for session persistence
 *
 * Usage:
 * ```tsx
 * const user = useAuthStore((state) => state.user);
 * const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
 * const login = useAuthStore((state) => state.login);
 * ```
 */
export const useAuthStore = create<AuthStore>((set) => ({
  // ==========================================
  // Initial State
  // ==========================================
  user: storedUser,
  isAuthenticated: Boolean(storedUser),

  // ==========================================
  // Actions
  // ==========================================

  /**
   * Login user and persist session
   * Called after successful API login response
   *
   * @example
   * const response = await authService.login({ email, password });
   * authStore.login(response.data.user);
   */
  login: (user: UserResource) => {
    // Save to localStorage for persistence
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Update Zustand state
    set({
      user,
      isAuthenticated: true,
    });
  },

  /**
   * Logout user and clear session
   * Clears both Zustand state and localStorage
   *
   * @example
   * await authService.logout(); // Call API
   * authStore.logout(); // Clear local state
   */
  logout: () => {
    // Clear localStorage
    localStorage.removeItem(USER_KEY);

    // Clear Zustand state
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  /**
   * Update user data
   * Useful when fetching fresh user data from API
   *
   * @example
   * const updatedUser = await userService.getMe();
   * authStore.setUser(updatedUser.data);
   */
  setUser: (user: UserResource) => {
    // Update localStorage
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Update Zustand state
    set({
      user,
      isAuthenticated: true,
    });
  },

  /**
   * Initialize auth state from localStorage
   */
  initAuth: () => {
    const user = readStoredUser();

    set({
      user,
      isAuthenticated: Boolean(user),
    });
  },
}));

// ==========================================
// Convenience Hooks
// ==========================================

/**
 * Get current user (may be null)
 *
 * @example
 * const user = useCurrentUser();
 * if (!user) return <div>Loading...</div>;
 */
export const useCurrentUser = () => useAuthStore((state) => state.user);

// for global access of the logged in uder role
export const useCurrentUserRole = () =>
  useAuthStore((state) => state.user?.role ?? null);

/**
 * Get authentication status
 *
 * @example
 * const isAuthenticated = useIsAuthenticated();
 * if (!isAuthenticated) return <Navigate to="/login" />;
 */
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);

/**
 * Get auth token
 *
 * @example
 * const token = useAuthToken();
 * // Cookie-based auth returns null
 */
export const useAuthToken = (): string | null => null;
