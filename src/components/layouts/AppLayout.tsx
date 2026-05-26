import { Outlet, useLocation } from "react-router";
import { AppShell } from "@mantine/core";
import { AppSidebar } from "@/components/layouts/AppSidebar";
import { AppHeader } from "@/components/layouts/AppHeader";

const PANEL_WIDTH_REM = 7.9375;

const SUB_ITEM_PREFIXES = [
  "/leads",
  "/shipments",
  "/quotations",
  "/job-order",
];

function useIsPanelOpen() {
  const { pathname } = useLocation();
  return SUB_ITEM_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export function AppLayout() {
  const panelOpen = useIsPanelOpen();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 89, breakpoint: "sm" }}
      padding="md"
      withBorder={false}
    >
      <AppShell.Header>
        <AppHeader />
      </AppShell.Header>

      <AppShell.Navbar
        style={{
          background: "transparent",
          border: "none",
          padding: 0,
          overflow: "visible",
        }}
      >
        <AppSidebar />
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          backgroundColor: "#EDEDED",
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "flex-start",
          paddingLeft: panelOpen
            ? `calc(var(--app-shell-navbar-width) + ${PANEL_WIDTH_REM}rem + var(--mantine-spacing-md))`
            : undefined,
        }}
      >
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
