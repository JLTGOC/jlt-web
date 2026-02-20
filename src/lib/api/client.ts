import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - attach token to every request
apiClient.interceptors.request.use(
  (config) => {
    // Get token from Zustand store
    const token = useAuthStore.getState().token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const logout = useAuthStore.getState().logout;
      logout();
    }

    return Promise.reject(error);
  },
);

// Generic API methods with proper typing
export async function GET<T>(url: string): Promise<T> {
  const response = await apiClient.get<T>(url);
  return response.data;
}

export async function POST<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.post<T>(url, data);
  return response.data;
}

export async function PUT<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.put<T>(url, data);
  return response.data;
}

export async function PATCH<T>(url: string, data?: unknown): Promise<T> {
  const response = await apiClient.patch<T>(url, data);
  return response.data;
}

export async function DELETE<T>(url: string): Promise<T> {
  const response = await apiClient.delete<T>(url);
  return response.data;
}
