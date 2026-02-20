import { createBrowserRouter } from "react-router";
import { ProtectedRoute } from "@/components/guards/ProtectedRoute";
import { GuestRoute } from "@/components/guards/GuestRoute";
import { AppLayout } from "@/components/layouts/AppLayout";
import { lazy } from "react";
import NotFound from "./routes/NotFound";
import { Loader } from "@mantine/core";

const LoginPage = lazy(() => import("./routes/auth/LoginPage"));
const DashboardPage = lazy(
  () => import("./routes/app/dashboard/DashboardPage"),
);

export const router = createBrowserRouter([
  // ==========================================
  // GUEST ROUTES
  // ==========================================
  {
    Component: GuestRoute,
    HydrateFallback: Loader,
    children: [
      {
        path: "/login",
        Component: LoginPage,
      },
    ],
  },

  // ==========================================
  // PROTECTED ROUTES
  // ==========================================
  {
    Component: ProtectedRoute,
    children: [
      {
        Component: AppLayout,
        children: [
          // Dashboard
          {
            index: true,
            Component: DashboardPage,
          },

          // Catch-all inside AppLayout — renders NotFound with sidebar visible
          {
            path: "*",
            Component: NotFound,
          },
        ],
      },
    ],
  },
]);
