import { Box, Center, Text } from "@mantine/core";
import type { ComponentType } from "react";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/outlined";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FolderButtonProps {
  /** Material Symbols icon component */
  icon: ComponentType<{ width?: string | number; height?: string | number }>;
  /** Title text shown next to the icon */
  label: string;
  /** Supporting description text */
  description?: string;
  /** Click handler */
  onClick?: () => void;
  /** Optional custom icon color */
  iconColor?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FolderButton({
  icon: Icon,
  label,
  description,
  onClick,
  iconColor = "#17314B",
}: FolderButtonProps) {
  return (
    <Box
      role="button"
      onClick={onClick}
      tabIndex={0}
      onKeyDown={(event) => {
        if (!onClick) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      w="17.5rem"
      mih="100"
      p="1rem 1.25rem"
      bdrs="0.75rem"
      bd="1px solid #e6e8ec"
      bg="#ffffff"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "0.75rem",
        boxShadow: "0 2px 6px rgba(17, 24, 39, 0.08)",
        cursor: "pointer",
      }}
    >
      <Center
        w="2.5rem"
        h="2.5rem"
        bdrs="999px"
        bd="1px solid #e5e7eb"
        bg="#f3f4f6"
        style={{
          flex: "0 0 auto",
          color: iconColor,
        }}
      >
        <Icon width="1.5rem" height="1.5rem"  />
      </Center>

      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.35rem",
          flex: "1 1 auto",
          minWidth: 0,
        }}
      >
        <Text
          fz="0.7rem"
          fw={700}
          tt="uppercase"
          c="#111827"
          style={{ letterSpacing: "0.06em" }}
        >
          {label}
        </Text>
        {description ? (
          <Text fz="0.78rem" c="#6b7280" lh={1.35}>
            {description}
          </Text>
        ) : null}
      </Box>

      <Box
        aria-hidden="true"
        w="1.5rem"
        h="1.5rem"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#111827",
          flex: "0 0 auto",
          alignSelf: "flex-end",
        }}
      >
        <ArrowForward width="1.25rem" height="1.25rem" />
      </Box>
    </Box>
  );
}
