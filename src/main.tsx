import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "@/app/router";
import { AppProvider } from "@/app/provider";
import { useAuthStore } from "@/stores/authStore";

// Styles
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";

// Hydrate auth state from localStorage before first render
useAuthStore.getState().initAuth();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);
