import { Group, Button, Text, Box } from "@mantine/core";

interface JobOrderFilterClientProps {
  activeTab: "all" | "Logistics" | "Regulatory";
  counts: { all: number; Logistics: number; Regulatory: number };
  onTabChange: (tab: "all" | "Logistics" | "Regulatory") => void;
}

export function JobOrderFilterClient({
  activeTab,
  counts,
  onTabChange,
}: JobOrderFilterClientProps) {
  return (
    <Box
      mb="md"
      style={(theme) => {
        return {
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: "0.5rem",
          overflow: "hidden",
        };
      }}
    >
      <Group gap={0}>
        <TabButton
          label="ALL CLIENTS"
          count={counts.all}
          active={activeTab === "all"}
          onClick={() => onTabChange("all")}
          color="orange"
        />
        <VerticalDivider />
        <TabButton
          label="LOGISTICS"
          count={counts.Logistics}
          active={activeTab === "Logistics"}
          onClick={() => onTabChange("Logistics")}
          color="teal"
          dot
        />
        <VerticalDivider />
        <TabButton
          label="REGULATORY"
          count={counts.Regulatory}
          active={activeTab === "Regulatory"}
          onClick={() => onTabChange("Regulatory")}
          color="blue"
          dot
        />
      </Group>
    </Box>
  );
}

interface TabButtonProps {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color: string;
  dot?: boolean;
  disabled?: boolean;
}

function TabButton({
  label,
  count,
  active,
  onClick,
  color,
  dot,
  disabled,
}: TabButtonProps) {
  return (
    <Button
      variant="subtle"
      onClick={onClick}
      disabled={disabled}
      px={"1.25rem"}
      h={"2.5rem"}
      styles={(theme) => ({
        root: {
          borderBottom: active
            ? `3px solid ${theme.colors.orange[6]}`
            : "3px solid transparent",
          borderRadius: 0,
          color: active ? theme.colors.orange[7] : theme.colors.gray[7],
          fontWeight: 700,
          background: "none",
          boxShadow: "none",
        },
      })}
      leftSection={
        dot ? (
          <Box
            w={"0.5rem"}
            h={"0.5rem"}
            bg={color}
            style={{ borderRadius: "0.5rem", marginRight: "0.375rem" }}
          />
        ) : undefined
      }
    >
      <Text span>{label}</Text>
      <Text span ml={8} fw={500} c="dimmed">
        {count}
      </Text>
    </Button>
  );
}

function VerticalDivider() {
  return (
    <Box
      h={"2rem"}
      w={"0.0625rem"}
      mx={0}
      my={"0.25rem"}
      style={(theme) => ({
        background: theme.colors.gray[3],
        alignSelf: "center",
      })}
    />
  );
}
