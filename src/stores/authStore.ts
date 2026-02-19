import { create } from "zustand";
import type { UserResource } from "@/types/api";

interface AuthState {
  user: UserResource | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (user: UserResource, token: string) => void;
  logout: () => void;
  setUser: (user: UserResource) => void;
  initAuth: () => void;
}

type AuthStore = AuthState & AuthActions;

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

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
  user: null,
  token: null,
  isAuthenticated: false,

  // ==========================================
  // Actions
  // ==========================================

  /**
   * Login user and persist session
   * Called after successful API login response
   *
   * @example
   * const response = await authService.login({ email, password });
   * authStore.login(response.data.user, response.data.token);
   */
  login: (user: UserResource, token: string) => {
    // Save to localStorage for persistence
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    // Update Zustand state
    set({
      user,
      token,
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
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    // Clear Zustand state
    set({
      user: null,
      token: null,
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
    set({ user });
  },

  /**
   * Initialize auth state from localStorage
   * MUST be called in main.tsx BEFORE rendering
   *
   * This hydrates the store with saved auth data on app load,
   * preventing the "flash of login page" issue
   *
   * @example
   * // main.tsx
   * useAuthStore.getState().initAuth();
   * createRoot(document.getElementById('root')!).render(<App />);
   */
  initAuth: () => {
    // Read from localStorage
    const token = localStorage.getItem(TOKEN_KEY);
    const userStr = localStorage.getItem(USER_KEY);

    if (token && userStr) {
      try {
        // Parse user data
        const user = JSON.parse(userStr) as UserResource;

        // Hydrate Zustand state
        set({
          user,
          token,
          isAuthenticated: true,
        });
      } catch (error) {
        // If parsing fails, clear corrupted data
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        console.error("Failed to parse stored user data:", error);
      }
    }
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
 * // Use in API calls
 */
export const useAuthToken = () => useAuthStore((state) => state.token);
