import {
  Dashboard,
  DiversityTwo,
  Workspaces,
  ManageAccounts,
  Construction,
  FileOpen,
  FilePresent,
  Task,
  ScanDelete,
  LocalShipping,
  TaskAlt,
  FactCheck,
} from "@nine-thirty-five/material-symbols-react/rounded";
import type { UserTabs } from "@/types/api";
import type { MenuNode, NavItem } from "./AppSidebarUtils";

export const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    icon: <Dashboard width="2rem" height="2rem" />,
    label: "Dashboard",
    path: "/",
  },
  {
    id: "leads",
    icon: <DiversityTwo width="2rem" height="2rem" />,
    label: "Leads",
    subItems: [
      { label: "Queries", path: "/leads/queries" },
      { label: "New", path: "/leads/new" },
      { label: "Replied", path: "/leads/replied" },
    ],
  },
  {
    id: "services",
    icon: <Workspaces width="2rem" height="2rem" />,
    label: "Services",
    subItems: [
      {
        key: "quotations",
        label: "Quotations",
        subItems: [
          {
            label: "Requests",
            path: "/quotations/requested",
            icon: <FileOpen width="1rem" height="1rem" />,
          },
          {
            label: "Responded",
            path: "/quotations/responded",
            icon: <FilePresent width="1rem" height="1rem" />,
          },
          {
            label: "Accepted",
            path: "/quotations/accepted",
            icon: <Task width="1rem" height="1rem" />,
          },
          {
            label: "Discarded",
            path: "/quotations/discarded",
            icon: <ScanDelete width="1rem" height="1rem" />,
          },
        ],
      },
      {
        key: "job_orders",
        label: "Job Order",
        path: "/job-orders",
      },
      {
        key: "shipments",
        label: "Shipments",
        subItems: [
          {
            label: "Logistics",
            path: "/shipments/logistics",
            icon: <LocalShipping width="1rem" height="1rem" />,
          },
          {
            label: "Regulatory",
            path: "/shipments/regulatory",
            icon: <TaskAlt width="1rem" height="1rem" />,
          },
        ],
      },
    ],
  },
  {
    id: "accounts",
    icon: <ManageAccounts width="2rem" height="2rem" />,
    label: "Accounts",
    path: "/accounts",
  },
  {
    id: "lorem",
    icon: <FactCheck width="2rem" height="2rem" />,
    label: "Lorem",
    path: "/lorem",
  },
  {
    id: "tools",
    icon: <Construction width="2rem" height="2rem" />,
    label: "Tools",
    path: "/tools",
  },
];

type SidebarTabKey = keyof Pick<
  UserTabs,
  | "dashboard"
  | "leads"
  | "shipments"
  | "accounts"
  | "job_orders"
  | "quotations"
  | "templates"
>;

const ITEM_TAB_KEYS: Partial<Record<string, SidebarTabKey>> = {
  dashboard: "dashboard",
  leads: "leads",
  accounts: "accounts",
  tools: "templates",
};

const SERVICES_SECTION_TAB_KEYS: Partial<Record<string, SidebarTabKey>> = {
  quotations: "quotations",
  job_orders: "job_orders",
  shipments: "shipments",
};

function filterServicesSubItemsByTabs(
  items: MenuNode[] | undefined,
  tabs: UserTabs,
): MenuNode[] {
  if (!items?.length) return [];

  return items.filter((item) => {
    if (!item.key) return true;
    const tabKey = SERVICES_SECTION_TAB_KEYS[item.key];
    return tabKey ? tabs[tabKey] : true;
  });
}

function filterSidebarItemsByTabs(
  items: NavItem[],
  tabs?: UserTabs,
): NavItem[] {
  if (!tabs) return items;

  return items.reduce<NavItem[]>((acc, item) => {
    if (item.id === "services") {
      const filteredSubItems = filterServicesSubItemsByTabs(
        item.subItems,
        tabs,
      );
      if (!filteredSubItems.length) return acc;

      acc.push({
        ...item,
        subItems: filteredSubItems,
      });
      return acc;
    }

    const tabKey = ITEM_TAB_KEYS[item.id];
    if (!tabKey || tabs[tabKey]) {
      acc.push(item);
    }

    return acc;
  }, []);
}

export function getSidebarItemsForTabs(tabs?: UserTabs): NavItem[] {
  return filterSidebarItemsByTabs(NAV_ITEMS, tabs);
}

export const BTN_HEIGHT_REM = 5;
export const PILL_HEIGHT_REM = 3.5;
export const RAIL_PADDING_TOP_REM = 1.125;
export const PANEL_BASE_PADDING_REM = 1;
export const PANEL_INDENT_STEP_REM = 1;
