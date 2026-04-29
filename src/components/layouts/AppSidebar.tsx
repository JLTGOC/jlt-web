import { Flex, Box, Stack, Text, UnstyledButton, Tooltip } from "@mantine/core";
import { useLocation, useNavigate } from "react-router";
import { useAuthStore } from "@/stores/authStore";

import classes from "./AppSidebar.module.css";
import {
  BTN_HEIGHT_REM,
  getSidebarItemsForTabs,
  PANEL_BASE_PADDING_REM,
  PANEL_INDENT_STEP_REM,
  PILL_HEIGHT_REM,
  RAIL_PADDING_TOP_REM,
} from "./AppSidebar.config";
import {
  getActiveIndex,
  getActiveItem,
  getFirstNavigablePath,
  isItemActive,
  isSubItemActive,
  type MenuNode,
  type NavItem,
} from "./AppSidebarUtils";

// Component

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const currentPath = location.pathname;
  const navItems = getSidebarItemsForTabs(user?.tabs);

  const activeIndex = getActiveIndex(navItems, currentPath);
  const activeItem = getActiveItem(navItems, currentPath);
  const panelOpen = !!activeItem?.subItems?.length;

  const pillTop =
    activeIndex >= 0
      ? `${RAIL_PADDING_TOP_REM + activeIndex * BTN_HEIGHT_REM + (BTN_HEIGHT_REM - PILL_HEIGHT_REM) / 2}rem`
      : "0rem";

  function handleIconClick(item: NavItem) {
    if (item.path) {
      navigate(item.path);
    } else if (item.subItems?.length) {
      const fallbackPath = getFirstNavigablePath(item);
      if (fallbackPath) {
        navigate(fallbackPath);
      }
    }
  }

  function getMenuItemPaddingLeft(depth: number): string {
    return `${PANEL_BASE_PADDING_REM + depth * PANEL_INDENT_STEP_REM}rem`;
  }

  function renderNestedItems(items: MenuNode[], depth = 0): React.ReactNode {
    return items.map((item) => {
      const itemPath = getFirstNavigablePath(item);
      if (!itemPath) return null;

      const itemActive = isSubItemActive(item, currentPath);
      const showNested = !!item.subItems?.length && itemActive;
      const topLevelSubItem = depth === 0;

      return (
        <Box key={itemPath}>
          <UnstyledButton
            onClick={() => navigate(itemPath)}
            data-active={itemActive || undefined}
            data-expanded={topLevelSubItem && showNested ? true : undefined}
            className={topLevelSubItem ? classes.subItem : classes.subSubItem}
            style={{
              paddingLeft: getMenuItemPaddingLeft(depth),
              paddingTop: "0.375rem",
              paddingBottom: "0.375rem",
            }}
          >
            <Text
              size="xs"
              fw={itemActive ? 700 : 400}
              tt="uppercase"
              lts="0.08em"
              className={
                topLevelSubItem ? classes.subParentText : classes.subSubText
              }
            >
              {item.label}
            </Text>
          </UnstyledButton>

          {showNested && (
            <Stack
              gap={0}
              className={depth === 0 ? classes.subSubList : undefined}
            >
              {renderNestedItems(item.subItems!, depth + 1)}
            </Stack>
          )}
        </Box>
      );
    });
  }

  return (
    <Box
      component="nav"
      pos="relative"
      display="flex"
      h="100%"
      style={{ flexDirection: "row", overflow: "visible" }}
    >
      {/* Rail background layer */}
      <Box className={classes.railBg} />

      {/* Icon rail and travelling pill wrapper */}
      <Box
        style={{
          position: "relative",
          overflow: "hidden",
          width: "var(--rail-width)",
          height: "100%",
          zIndex: 3,
          flexShrink: 0,
        }}
      >
        {/* Travelling pill layer */}
        <Box
          className={classes.activePill}
          data-visible={activeIndex >= 0 || undefined}
          data-panel-open={panelOpen || undefined}
          style={{ transform: `translateY(${pillTop})` }}
        />

        {/* ── Icon rail ── */}
        <Flex
          align="center"
          direction="column"
          wrap="wrap"
          pt="1.125rem"
          w="5.5625rem"
          h="100%"
          style={{ zIndex: 3, flexShrink: 0, overflow: "visible" }}
        >
          {/* Nav icon buttons */}
          {navItems.map((item) => {
            const active = isItemActive(item, currentPath);
            return (
              <Tooltip
                key={item.id}
                label={item.label}
                position="right"
                offset={8}
                transitionProps={{ transition: "slide-right", duration: 200 }}
                color="jltOrange.5"
                zIndex={300}
                disabled={active}
                styles={{
                  tooltip: {
                    color: "var(--mantine-color-jltBlue)",
                  },
                }}
              >
                <UnstyledButton
                  onClick={() => handleIconClick(item)}
                  data-active={active || undefined}
                  className={classes.iconBtn}
                  w="100%"
                  h={`${BTN_HEIGHT_REM}rem`}
                  display="flex"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    zIndex: 1,
                    overflow: "visible",
                    color: active ? "var(--mantine-color-jltBlue-8)" : "white",
                    transition: "color 150ms ease",
                  }}
                >
                  {item.icon}
                </UnstyledButton>
              </Tooltip>
            );
          })}
        </Flex>
      </Box>

      {/* ── Sub-item panel ── */}
      <Box
        className={classes.subPanel}
        data-visible={panelOpen || undefined}
        aria-hidden={!panelOpen}
        bg="white"
      >
        {activeItem?.subItems && (
          <Box className={classes.subPanelInner} data-active py="xl" pt="2rem">
            <Stack gap="xs">{renderNestedItems(activeItem.subItems)}</Stack>
          </Box>
        )}
      </Box>
    </Box>
  );
}
