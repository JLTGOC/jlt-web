import { Box, Paper, Text } from "@mantine/core";
import type { ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DetailCardProps {
  /**
   * Left section of the header — icon, avatar, badge, or any ReactNode.
   * Previously `icon`, renamed for flexibility.
   */
  headerLeft?: ReactNode;
  /** Card section title */
  title: string;
  /**
   * Optional right section of the header — status chip, action button,
   * external link, etc.
   */
  headerRight?: ReactNode;
  /**
   * Optional background for the header strip only.
   * Accepts any valid CSS background value (color, gradient, etc.)
   * Defaults to transparent (inherits card background).
   */
  headerBg?: string;
  /** Card body — typically a DetailGrid but can be anything */
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DetailCard({
  headerLeft,
  title,
  headerRight,
  headerBg,
  children,
}: DetailCardProps) {
  return (
    <Paper
      radius="md"
      style={{
        backgroundColor: "#fff",
        border: "1px solid var(--mantine-color-gray-2)",
        overflow: "hidden",
      }}
    >
      {/* ── Header ── */}
      <Box
        display="flex"
        p="1.25rem"
        style={{
          alignItems: "center",
          justifyContent: "space-between",
          background: headerBg ?? "transparent",
          borderBottom: "1px solid var(--mantine-color-gray-2)",
        }}
        mb={0}
      >
        {/* Left: icon/element + title */}
        <Box display="flex" style={{ alignItems: "center", gap: "0.5rem" }}>
          {headerLeft && (
            <Box
              style={{
                color: "var(--mantine-color-jltBlue-8)",
                display: "flex",
                alignItems: "center",
              }}
            >
              {headerLeft}
            </Box>
          )}
          <Text
            size="sm"
            fw={700}
            tt="uppercase"
            lts="0.08em"
            c="var(--mantine-color-jltBlue-8)"
          >
            {title}
          </Text>
        </Box>

        {/* Right: optional slot */}
        {headerRight && (
          <Box style={{ display: "flex", alignItems: "center" }}>
            {headerRight}
          </Box>
        )}
      </Box>

      {/* ── Body ── */}
      <Box p="1.25rem">{children}</Box>
    </Paper>
  );
}
