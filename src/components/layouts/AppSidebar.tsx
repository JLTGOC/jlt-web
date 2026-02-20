/**
 * AppSidebar.tsx
 *
 * Mantine components handle all layout, spacing, color, and typography.
 * CSS module only handles what Mantine can't: pseudo-elements (scoops,
 * gradient border), absolute stacking, and transitions on data-* attributes.
 */

import { Box, Stack, Text, UnstyledButton, Tooltip } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import {
  IconLayoutDashboard,
  IconUsers,
  IconShip,
  IconFileText,
  IconUserCog,
  IconFolderCog,
  IconSettings,
} from "@tabler/icons-react";
import classes from "./AppSidebar.module.css";

// ============================================
// Types
// ============================================

interface SubItem {
  label: string;
  path: string;
}

interface NavItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  path?: string;
  subItems?: SubItem[];
}

// ============================================
// Nav Config
// ============================================

const NAV_ITEMS: NavItem[] = [
  {
    id: "dashboard",
    icon: <IconLayoutDashboard size={32} />,
    label: "Dashboard",
    path: "/",
  },
  {
    id: "leads",
    icon: <IconUsers size={32} />,
    label: "Leads",
    subItems: [
      { label: "Queries", path: "/leads/queries" },
      { label: "New", path: "/leads/new" },
      { label: "Replied", path: "/leads/replied" },
    ],
  },
  {
    id: "shipments",
    icon: <IconShip size={32} />,
    label: "Shipments",
    subItems: [
      { label: "Ongoing", path: "/shipments/ongoing" },
      { label: "Delivered", path: "/shipments/delivered" },
    ],
  },
  {
    id: "quotations",
    icon: <IconFileText size={32} />,
    label: "Quotations",
    subItems: [
      { label: "Requests", path: "/quotations/requests" },
      { label: "Responded", path: "/quotations/responded" },
      { label: "Accepted", path: "/quotations/accepted" },
      { label: "Discarded", path: "/quotations/discarded" },
    ],
  },
  {
    id: "accounts",
    icon: <IconUserCog size={32} />,
    label: "Accounts",
    subItems: [
      { label: "Clients", path: "/accounts/clients" },
      { label: "Employees", path: "/accounts/employees" },
    ],
  },
  {
    id: "tools",
    icon: <IconFolderCog size={32} />,
    label: "Tools",
    subItems: [
      { label: "Services", path: "/tools/services" },
      { label: "Templates", path: "/tools/templates" },
      { label: "Messages", path: "/tools/messages" },
    ],
  },
];

// Must stay in sync with CSS --btn-height and .iconRail padding-top
const BTN_HEIGHT = 56;
const RAIL_PADDING_TOP = 18;

// ============================================
// Helpers
// ============================================

function isPathActive(path: string, currentPath: string): boolean {
  if (path === "/") return currentPath === "/";
  return currentPath.startsWith(path);
}

function isItemActive(item: NavItem, currentPath: string): boolean {
  if (item.path) return isPathActive(item.path, currentPath);
  return !!item.subItems?.some((sub) => isPathActive(sub.path, currentPath));
}

function getActiveIndex(currentPath: string): number {
  return NAV_ITEMS.findIndex((item) => isItemActive(item, currentPath));
}

function getActiveItem(currentPath: string): NavItem | null {
  return NAV_ITEMS.find((item) => isItemActive(item, currentPath)) ?? null;
}

// ============================================
// Component
// ============================================

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const activeIndex = getActiveIndex(currentPath);
  const activeItem = getActiveItem(currentPath);
  const panelOpen = !!activeItem?.subItems?.length;

  const pillTop =
    activeIndex >= 0 ? RAIL_PADDING_TOP + activeIndex * BTN_HEIGHT : 0;

  function handleIconClick(item: NavItem) {
    if (item.path) {
      navigate(item.path);
    } else if (item.subItems?.length) {
      navigate(item.subItems[0].path);
    }
  }

  return (
    <Box
      pos="relative"
      display="flex"
      h="100%"
      style={{ flexDirection: "row" }}
    >
      {/* ── Sub-item panel ── */}
      <Box
        className={classes.subPanel}
        data-visible={panelOpen || undefined}
        aria-hidden={!panelOpen}
        bg="white"
      >
        {activeItem?.subItems && (
          <Box
            className={classes.subPanelInner}
            data-active
            pl="15"
            py="xl"
            pt={28}
          >
            <Stack gap="md">
              {activeItem.subItems.map((sub) => {
                const active = isPathActive(sub.path, currentPath);
                return (
                  <UnstyledButton
                    key={sub.path}
                    onClick={() => navigate(sub.path)}
                    data-active={active || undefined}
                    className={classes.subItem}
                  >
                    <Text
                      size="xs"
                      fw={active ? 700 : 400}
                      tt="uppercase"
                      lts="0.08em"
                      c={active ? "jltOrange.5" : "jltBlue.8"}
                      style={{
                        whiteSpace: "nowrap",
                        transition: "color 120ms ease",
                      }}
                    >
                      {sub.label}
                    </Text>
                  </UnstyledButton>
                );
              })}
            </Stack>
          </Box>
        )}
      </Box>

      {/* ── Icon rail ── */}
      <Box
        className={classes.iconRail}
        bg="jltBlue.8"
        pos="relative"
        pt={RAIL_PADDING_TOP}
        style={{ zIndex: 2, flexShrink: 0, overflow: "visible" }}
        w={89}
        h="100%"
      >
        {/* Travelling pill */}
        <Box
          className={classes.activePill}
          data-visible={activeIndex >= 0 || undefined}
          style={{ transform: `translateY(${pillTop}px)` }}
        />

        {/* Nav icon buttons */}
        {NAV_ITEMS.map((item) => {
          const active = isItemActive(item, currentPath);
          return (
            <Tooltip
              key={item.id}
              label={item.label}
              position="right"
              withArrow
              offset={16}
              zIndex={300}
              disabled={active}
            >
              <UnstyledButton
                onClick={() => handleIconClick(item)}
                data-active={active || undefined}
                className={classes.iconBtn}
                w="100%"
                h={BTN_HEIGHT}
                display="flex"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 1,
                  overflow: "visible",
                  color: active ? "var(--mantine-color-jltBlue-8)" : "white",
                  transition: "color 150ms ease",
                  paddingInline: "16px 0",
                }}
              >
                {item.icon}
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
