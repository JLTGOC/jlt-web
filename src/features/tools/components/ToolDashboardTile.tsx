import type { ComponentType } from "react";
import { ActionIcon, Box, Text, UnstyledButton } from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";
import classes from "./ToolDashboardTile.module.css";

interface ToolDashboardTileProps {
  icon: ComponentType<{ width?: string | number; height?: string | number }>;
  label: string;
  description?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function ToolDashboardTile({
  icon: Icon,
  label,
  description,
  onClick,
  ariaLabel,
}: ToolDashboardTileProps) {
  return (
    <UnstyledButton
      type="button"
      onClick={onClick}
      className={classes.root}
      aria-label={ariaLabel ?? label}
    >
      <Box className={classes.topSection}>
        <Box className={classes.iconBubble}>
          <Icon width="2rem" height="2rem" />
        </Box>

        <Box>
          <Text className={classes.label}>{label}</Text>
          {description ? (
            <Text className={classes.description} mt="lg">
              {description}
            </Text>
          ) : null}
        </Box>
      </Box>

      <Box className={classes.footer}>
        <ActionIcon variant="transparent" size="lg" className={classes.arrow}>
          <ArrowForward width={24} height={24} />
        </ActionIcon>
      </Box>
    </UnstyledButton>
  );
}
