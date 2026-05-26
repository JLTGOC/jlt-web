import { Tabs, Box } from "@mantine/core";
import {
  Group as GroupIcon,
  GroupsTwo,
  Apartment,
} from "@nine-thirty-five/material-symbols-react/outlined";
import classes from "@/app/routes/app/accounts/AccountsPage.module.css";

export function getAccountTabs(
  activeTab: string,
  handleTabChange: (tab: string | null) => void
) {
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
        {/* Clients Tab */}
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

        {/* Employees Tab */}
        <Tabs.Tab value="employees">
          <Box className={classes.tabContent}>
            <GroupsTwo width={50} height={50} style={{ color: "#4E6174" }} />
            <Box className={classes.tabText}>
              <span className={classes.tabTitle}>Account Specialists</span>
              <span className={classes.tabSubtitle}>
                View and manage employees and their access
              </span>
            </Box>
          </Box>
        </Tabs.Tab>

        {/* Companies Tab */}
        <Tabs.Tab value="companies">
          <Box className={classes.tabContent}>
            <Apartment width={40} height={40} style={{ color: "#4E6174" }} />
            <Box className={classes.tabText}>
              <span className={classes.tabTitle}>Companies</span>
              <span className={classes.tabSubtitle}>
                Browse and manage company records
              </span>
            </Box>
          </Box>
        </Tabs.Tab>
      </Tabs.List>
    </Tabs>
  );
}
