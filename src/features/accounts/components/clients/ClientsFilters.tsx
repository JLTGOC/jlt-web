// src/features/accounts/components/clients/ClientsFilters.tsx
import { Button, Flex, Grid, Input, Select, Group, Text, Divider } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Search, CalendarMonth, ChevronRight } from "@nine-thirty-five/material-symbols-react/rounded";

interface ClientFilterTableProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  dateCreatedValue: string | null;
  onDateCreatedChange: (value: string | null) => void;
  clientTypeValue: string;
  onClientTypeChange: (value: string) => void;
  onReset: () => void;
  perPage: number;
  setPerPage: (value: number) => void;
}

export function ClientsFilters({
  searchValue,
  onSearchChange,
  onSearch,
  dateCreatedValue,
  onDateCreatedChange,
  clientTypeValue,
  onClientTypeChange,
  onReset,
  perPage,
  setPerPage,
}: ClientFilterTableProps) {
  const entryOptions = ["10", "20", "30", "All"];

  return (
    <Grid gutter="xs" mb="sm" align="end">
      {/* Search Client */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Input
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder="SEARCH CLIENT"
          value={searchValue}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch(searchValue);
            }
          }}
          rightSection={
            <Button
              type="button"
              h={36}
              w={45}
              p={0}
              radius="sm"
              color="#4f657d"
              aria-label="Search"
              onClick={() => onSearch(searchValue)}
            >
              <Search width={24} height={24} fill="white" />
            </Button>
          }
        />
      </Grid.Col>

      {/* Date Created */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <DateInput
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder="DATE CREATED"
          value={dateCreatedValue}
          onChange={onDateCreatedChange}
          rightSection={
            <Button type="button" h={36} w={45} p={0} radius="sm" color="#4f657d">
              <CalendarMonth width={24} height={24} fill="white" />
            </Button>
          }
        />
      </Grid.Col>

      {/* Client Type */}
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Select
          w="100%"
          size="sm"
          placeholder="CLIENT TYPE"
          data={[
            { value: "ALL", label: "ALL CLIENTS" },
            { value: "NEW", label: "NEW CLIENTS" },
            { value: "OLD", label: "OLD CLIENTS" },
          ]}
          value={clientTypeValue}
          onChange={(value) => onClientTypeChange(value || "ALL")}
          rightSection={<ChevronRight width={16} />}
        />
      </Grid.Col>

      {/* Reset aligned to far right */}
      <Grid.Col span={{ base: 12, md: 2 }}>
        <Flex justify="flex-end">
          <Button variant="outline" bg="#4f657d" color="white" onClick={onReset}>
            RESET
          </Button>
        </Flex>
      </Grid.Col>

      <Grid.Col span={12}>
        <Divider my="xs" mt="1rem" />
      </Grid.Col>

      {/* Entries selector */}
      <Grid.Col span={12}>
        <Group gap="xs" align="center" mt="-0.5rem" ml="xs">
          <Text c="#7a808a" fz="0.9rem">
            Show
          </Text>
          <Select
            w={70}
            size="xs"
            data={entryOptions}
            value={String(perPage === 0 ? "All" : perPage)}
            onChange={(value) => {
              if (!value) return;
              if (value.toLowerCase() === "all") {
                setPerPage(0);
                return;
              }
              setPerPage(Number(value));
            }}
          />
          <Text c="#7a808a" fz="0.9rem">
            entries
          </Text>
        </Group>
      </Grid.Col>
    </Grid>
  );
}
