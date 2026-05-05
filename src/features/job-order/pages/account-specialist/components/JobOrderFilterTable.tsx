import {
  Group,
  TextInput,
  Button,
  Select,
  Box,
  ActionIcon,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { IconSearch, IconCalendar, IconChevronDown } from "@tabler/icons-react";

interface JobOrderFilterTableProps {
  search: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  date: string;
  onDateChange: (value: string) => void;
  service: string;
  onServiceChange: (value: string) => void;
  personInCharge: string;
  onPersonInChargeChange: (value: string) => void;
  onReset: () => void;
  serviceOptions: { value: string; label: string }[];
  personOptions: { value: string; label: string }[];
}

export function JobOrderFilterTable({
  search,
  onSearchChange,
  onSearch,
  date,
  onDateChange,
  service,
  onServiceChange,
  personInCharge,
  onPersonInChargeChange,
  onReset,
  serviceOptions,
  personOptions,
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
        <DatePickerInput
          placeholder="DATE CREATED"
          value={
            date
              ? typeof date === "string"
                ? date
                  ? new Date(date)
                  : null
                : date
              : null
          }
          onChange={(value) => {
            if (
              value &&
              typeof value === "object" &&
              typeof (value as Date).toISOString === "function"
            ) {
              onDateChange((value as Date).toISOString().slice(0, 10));
            } else {
              onDateChange("");
            }
          }}
          rightSection={
            <ActionIcon
              radius={"sm"}
              variant="filled"
              aria-label="Calendar"
              h="100%"
              w="100%"
              style={{
                backgroundColor: "var(--mantine-color-jltAccent-6)",
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,
                pointerEvents: "none",
              }}
              tabIndex={-1}
            >
              <IconCalendar width={16} height={16} />
            </ActionIcon>
          }
          rightSectionPointerEvents="none"
          size="sm"
          radius="sm"
          variant="default"
          valueFormat="YYYY-MM-DD"
          clearable
          w="100%"
        />
      </Box>
      <Box style={{ flex: 1, minWidth: "8.75rem" }}>
        <Select
          placeholder="ALL SERVICES"
          data={serviceOptions}
          value={service}
          onChange={(value) => onServiceChange(value ?? "")}
          radius="sm"
          variant="default"
          clearable
          rightSection={<IconChevronDown width={16} height={16} />}
          rightSectionPointerEvents="none"
          w="100%"
        />
      </Box>
      <Box style={{ flex: 1, minWidth: "10rem" }}>
        <Select
          placeholder="PERSON IN CHARGE"
          data={personOptions}
          value={personInCharge}
          onChange={(value) => onPersonInChargeChange(value ?? "")}
          radius="sm"
          variant="default"
          clearable
          rightSection={<IconChevronDown width={16} height={16} />}
          rightSectionPointerEvents="none"
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
