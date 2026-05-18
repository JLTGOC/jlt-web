import { Box, Text, UnstyledButton } from "@mantine/core";
import type { ComponentType } from "react";
import classes from "./FolderButton.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FolderButtonProps {
  /** Material Symbols icon component */
  icon: ComponentType<{ width?: string | number; height?: string | number }>;
  /** Label text shown below the icon */
  label: string;
  /** Click handler */
  onClick?: () => void;
  /** Optional custom icon color */
  iconColor?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FolderButton({
  icon: Icon,
  label,
  onClick,
  iconColor = "#1C213B",
}: FolderButtonProps) {
  return (
    <UnstyledButton onClick={onClick} className={classes.root}>
      {/* Layer 0: Grey offset tab behind the folder */}
      <Box className={classes.background} />

      {/* Layer 1: Main white folder SVG with drop shadow */}
      <Box className={classes.folderLayer}>
        <svg
          viewBox="0 0 146 102"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={classes.folderSvg}
          preserveAspectRatio="none"
        >
          <path
            d="M132.127 16.94H77.4538L59.2293 0H13.6683C6.11942 0 0 5.68814 0 12.705V88.9351C0 95.952 6.11942 101.64 13.6683 101.64H132.127C139.676 101.64 145.795 95.952 145.795 88.9351V29.645C145.795 22.6282 139.676 16.94 132.127 16.94Z"
            fill="white"
          />
        </svg>
      </Box>

      {/* Layer 2: Icon + Label centered inside the white folder */}
      <Box className={classes.contentLayer}>
        <Box className={classes.iconWrapper} style={{ color: iconColor }}>
          <Icon width="2.5rem" height="2.5rem" />{" "}
          {/* Shrunk slightly to match Figma proportions */}
        </Box>
        <Text className={classes.label}>{label}</Text>
      </Box>
    </UnstyledButton>
  );
}
