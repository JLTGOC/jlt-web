import {
  Box,
  Card,
  Group,
  Text,
  Title,
  UnstyledButton,
  Divider,
} from "@mantine/core";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";
import { useNavigate } from "react-router";
import classes from "./PageCard.module.css";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PageCardProps {
  title: string;
  subtext?: string;
  subtextColor?: string;
  action?: React.ReactNode;
  fullHeight?: boolean;
  children?: React.ReactNode;
  onBack?: () => void;
  showDivider?: boolean;
  hideBackButton?: boolean;
  bodyPx?: string | number;
  bodyPy?: string | number;
  showJobSwitch?: boolean;
  jobSwitchValue?: "all" | "my-items";
  onJobSwitchChange?: (value: "all" | "my-items") => void;
  jobSwitchSecondaryValue?: "my-items";
  jobSwitchSecondaryLabel?: string;
  bgColor?: string;

}

// ─── Component ────────────────────────────────────────────────────────────────

export function PageCard({
  title,
  subtext,
  subtextColor = "dimmed",
  action,
  fullHeight = false,
  showDivider = false,
  children,
  onBack,
  bodyPx = "xl",
  bodyPy = "lg",
  showJobSwitch = false,
  jobSwitchValue = "all",
  hideBackButton,
  onJobSwitchChange,
}: PageCardProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Card
      withBorder={false}
      radius={10}
      shadow={"sm"}
      padding={0}
      className={classes.root}
      style={{
        height: fullHeight
          ? "min(100%, calc(100dvh - var(--app-shell-header-height) - var(--mantine-spacing-md) * 2))"
          : undefined,
        ...(fullHeight
          ? {
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }
          : {}),
      }}
      pos="relative"
    >
      {/* ── Header ── */}
      <Group
        justify="space-between"
        p="lg"
        wrap="nowrap"
        className={classes.header}
      >
        <Group gap="xs" wrap="nowrap">
          {!hideBackButton && (
            <UnstyledButton onClick={handleBack} className={classes.backButton}>
              <ArrowBack width="1.25rem" height="1.25rem" fill="currentColor" />
            </UnstyledButton>
          )}
          <Group gap="0.5rem" align="baseline" wrap="nowrap">
            <Title order={5} fw={800} tt="uppercase" c="jltBlue.8">
              {title}
            </Title>
            {subtext && (
              <Text size="xs" c={subtextColor} fs="italic">
                ({subtext})
              </Text>
            )}
          </Group>
        </Group>

        <Group gap="sm" wrap="nowrap">
          {showJobSwitch && (
            <Group gap={0} className={classes.jobSwitch} wrap="nowrap">
              <UnstyledButton
                type="button"
                className={classes.jobSwitchOption}
                data-active={jobSwitchValue === "all" || undefined}
                aria-pressed={jobSwitchValue === "all"}
                onClick={() => onJobSwitchChange?.("all")}
              >
                <span className={classes.jobSwitchLabel}>ALL</span>
              </UnstyledButton>

              <UnstyledButton
                type="button"
                className={classes.jobSwitchOption}
                data-active={
                  jobSwitchValue === "my-items" || undefined
                }
                aria-pressed={jobSwitchValue === "my-items"}
                onClick={() => onJobSwitchChange?.("my-items")}
              >
                <span className={classes.jobSwitchLabel}>
                  MY ITEMS
                </span>
              </UnstyledButton>
            </Group>
          )}

          {action && <Box style={{ flexShrink: 0 }}>{action}</Box>}
        </Group>
      </Group>

      {showDivider && (
        <Divider
          size={"sm"}
          w={"96%"}
          mx={"auto"}
          className={classes.divider}
        />
      )}

      {/* ── Body ── */}
      <Box
        className={classes.body}
        px={bodyPx}
        py={bodyPy}
        style={
          fullHeight
            ? {
                flex: 1,
                minHeight: 0,
                overflowY: "auto",
              }
            : undefined
        }
      >
        {children}
      </Box>
    </Card>
  );
}
