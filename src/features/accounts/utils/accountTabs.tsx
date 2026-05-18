// src/features/accounts/utils/accountTabs.tsx
import { Box, Tabs } from "@mantine/core";
import { Group as GroupIcon, GroupsTwo } from "@nine-thirty-five/material-symbols-react/outlined";
import classes from "../../../app/routes/app/accounts/AccountsPage.module.css";
import type { User } from "@/types/api";
import { ROLES } from "@/types/roles";
import type { ReactNode } from "react";

export function getAccountTabs(user: User, activeTab: string, handleTabChange: (tab: string | null) => void) {
  return (
    <Tabs
      value={activeTab}
      onChange={handleTabChange}
      variant="unstyled"
      style={{ width: "100%" }}
      classNames={{
        list: classes.tabList,
        tab: classes.tab,
      }}
    >
      <Tabs.List grow>
        {/* Clients tab (only if not Client role) */}
        {user.role !== ROLES.CLIENT && (
          <Tabs.Tab value="clients">
            <Box className={classes.tabContent}>
              <GroupIcon width={40} height={40} style={{ color: "#4E6174" }} />
              <Box className={classes.tabText}>
                <span className={classes.tabTitle}>Clients</span>
                <span className={classes.tabSubtitle}>
                  Manage and monitor all client accounts
                </span>
              </Box>
            </Box>
          </Tabs.Tab>
        )}

        {/* Employees tab */}
        <Tabs.Tab value="employees">
          <Box className={classes.tabContent}>
            <GroupsTwo width={50} height={50} style={{ color: "#4E6174" }} />
            <Box className={classes.tabText}>
              <span className={classes.tabTitle}>
                {user.role === ROLES.ACCOUNT_SPECIALIST ? "Account Specialists" : user.role}
              </span>
              <span className={classes.tabSubtitle}>
                View and manage employees and their access
              </span>
            </Box>
          </Box>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
