// src/features/accounts/components/employees/AccountSpecialistsFilters.tsx
import {
  Button,
  Flex,
  Grid,
  Input,
  Select,
  Group,
  Text,
  Divider,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  Search,
  CalendarMonth,
  ChevronRight,
  PersonAdd, // ✅ import the icon
} from "@nine-thirty-five/material-symbols-react/rounded";

interface AccountSpecialistsFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  dateCreatedValue: string | null;
  onDateCreatedChange: (value: string | null) => void;
  roleValue: string;
  onRoleChange: (value: string) => void;
  onReset: () => void;
  perPage: number;
  setPerPage: (value: number) => void;
}

export function AccountSpecialistsFilters({
  searchValue,
  onSearchChange,
  onSearch,
  dateCreatedValue,
  onDateCreatedChange,
  roleValue,
  onRoleChange,
  onReset,
  perPage,
  setPerPage,
}: AccountSpecialistsFilterProps) {
  const entryOptions = ["10", "20", "30"];

  return (
    <Grid gutter="xs" mb="sm" align="end">
      {/* Search Employee */}
      <Grid.Col span={{ base: 12, md: 3 }}> {/* reduced from 4 */}
        <Input
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder="SEARCH EMPLOYEE"
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

      {/* Role Filter */}
      <Grid.Col span={{ base: 12, md: 2 }}> {/* reduced from 3 */}
        <Select
          w="100%"
          size="sm"
          placeholder="ROLE TYPE"
          data={[
            { value: "ALL", label: "ALL ROLES" },
            { value: "ACCOUNT_SPECIALIST", label: "ACCOUNT SPECIALISTS" },
            { value: "OPERATIONS", label: "OPERATIONS" },
            { value: "HR", label: "HUMAN RESOURCES" },
            { value: "IT", label: "IT" },
            { value: "FINANCE", label: "FINANCE" },
            { value: "MARKETING", label: "MARKETING" },
          ]}
          value={roleValue}
          onChange={(value) => onRoleChange(value || "ALL")}
          rightSection={<ChevronRight width={16} />}
        />
      </Grid.Col>

      {/* Reset + Add Account Specialist */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        <Flex justify="flex-end" gap="xs">
          <Button variant="outline" bg="#4f657d" color="white" onClick={onReset}>
            RESET
          </Button>
          <Button variant="outline" bg="#4f657d" color="white">
            <PersonAdd width={20} height={20} style={{ marginRight: 6 }} />
            ADD ACCOUNT SPECIALIST
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
            value={String(perPage)}
            onChange={(value) => {
              if (value) {
                setPerPage(Number(value));
              }
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
