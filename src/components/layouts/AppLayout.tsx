import { Outlet } from "react-router";
import { AppShell } from "@mantine/core";

export function AppLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Header>
        {/* Header content */}
        <div>Header</div>
      </AppShell.Header>

      <AppShell.Navbar>
        {/* Sidebar content */}
        <div>Sidebar</div>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
