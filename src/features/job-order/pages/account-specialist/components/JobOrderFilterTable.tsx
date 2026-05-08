import {
  Group,
  TextInput,
  Button,
  Select,
  Box,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconChevronDown } from "@tabler/icons-react";

interface JobOrderFilterTableProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  tradeType: string;
  onTradeTypeChange: (value: string) => void;
  personInCharge: string;
  onPersonInChargeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  tradeTypeOptions: { value: string; label: string }[];
  statusOptions: { value: string; label: string }[];
}

export function JobOrderFilterTable({
  search,
  onSearchChange,
  onSearch,
  tradeType,
  onTradeTypeChange,
  personInCharge,
  onPersonInChargeChange,
  status,
  onStatusChange,
  onReset,
  tradeTypeOptions,
  statusOptions,
}: JobOrderFilterTableProps) {
  return (
    <Group
      mb="sm"
      gap="xs"
      wrap="wrap"
      align="stretch"
      style={{ width: "100%" }}
    >
      <Box style={{ flex: 1, minWidth: "16.875rem" }}>
        <TextInput
          placeholder="SEARCH CLIENT OR REF NO."
          value={search}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          rightSection={
            <ActionIcon
              onClick={onSearch}
              radius={"sm"}
              variant="filled"
              aria-label="Search"
              size={"100%"}
              style={{
                backgroundColor: "var(--mantine-color-jltAccent-6)",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                height: "1.75rem",
                width: "1.75rem",
              }}
            >
              <IconSearch width={16} height={16} color="white" />
            </ActionIcon>
          }
          rightSectionPointerEvents="all"
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          radius="sm"
          variant="default"
          w="100%"
        />
      </Box>
      <Box style={{ flex: 1, minWidth: "8.75rem" }}>
        <Select
          placeholder="TRADE TYPE"
          data={tradeTypeOptions}
          value={tradeType}
          onChange={(value) => onTradeTypeChange(value ?? "")}
          radius="sm"
          variant="default"
          clearable
          rightSection={<IconChevronDown width={16} height={16} />}
          rightSectionPointerEvents="none"
          w="100%"
        />
      </Box>
      <Box style={{ flex: 1, minWidth: "8.75rem" }}>
        <Select
          placeholder="STATUS"
          data={statusOptions}
          value={status}
          onChange={(value) => onStatusChange(value ?? "")}
          radius="sm"
          variant="default"
          clearable
          rightSection={<IconChevronDown width={16} height={16} />}
          rightSectionPointerEvents="none"
          w="100%"
        />
      </Box>
      <Box style={{ flex: 1, minWidth: "10rem" }}>
        <TextInput
          placeholder="PERSON IN CHARGE"
          value={personInCharge}
          onChange={(event) =>
            onPersonInChargeChange(event.currentTarget.value)
          }
          radius="sm"
          variant="default"
          w="100%"
        />
      </Box>
      <Button
        variant="filled"
        color="jltAccent.6"
        onClick={onReset}
        ml="auto"
        radius="sm"
        style={{ height: "2.25rem", minWidth: "7.5rem" }}
      >
        RESET
      </Button>
    </Group>
  );
}
