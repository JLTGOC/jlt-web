import { Button, Divider, Grid, Group, Input, Select, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { Search, CalendarMonth, ChevronRight } from "@nine-thirty-five/material-symbols-react/rounded";

interface RespondedFilterTableProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
  dateValue: string;
  onDateChange: (value: string) => void;
  serviceValue: string;
  onServiceChange: (value: string) => void;
  personInChargeValue: string;
  onPersonInChargeChange: (value: string) => void;
  onReset: () => void;
  perPage: number;
  setPerPage: (value: number) => void;
  total: number;
}

//for drop down ahow entries
export function RespondedFilterTable({
  searchValue,
  onSearchChange,
  onSearch,
  dateValue,
  onDateChange,
  serviceValue,
  onServiceChange,
  personInChargeValue,
  onPersonInChargeChange,
  onReset,
  perPage,
  setPerPage,
  total,
}: RespondedFilterTableProps) {
  const entryOptions = ["10", "20", "30"];
  return (
    <Grid gutter="xs" mb="sm" align="end">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Input
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder={"SEARCH CLIENT OR REF NO."}
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
      <Grid.Col span={{ base: 12, md: 2 }}>
        <DateInput
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder="DATE RESPONDED"
          value={dateValue ? new Date(dateValue) : null}
          onChange={(date) => onDateChange(date ? date.toString().split("T")[0] : "")}
          rightSection={
            <Button
              type="button"
              h={36}
              w={45}
              p={0}
              radius="sm"
              color="#4f657d"
            >
              <CalendarMonth width={24} height={24} fill="white" />
            </Button>
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Input
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder={"PERSON IN CHARGE"}
          value={personInChargeValue}
          onChange={(event) => onPersonInChargeChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onPersonInChargeChange(personInChargeValue);
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
              onClick={() => onPersonInChargeChange(personInChargeValue)}
            >
              <Search width={24} height={24} fill="white" />
            </Button>
          }
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 2 }}>
        <Select
          w="100%"
          size="sm"
          placeholder="ALL SERVICES"
          data={["ALL SERVICES", "LOGISTICS", "REGULATORY"]}
          value={serviceValue}
          onChange={(value) => onServiceChange(value || "ALL SERVICES")}
          rightSection={<ChevronRight width={16} />}
        />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 2 }}>
        <Button variant="outline" bg="#4f657d" color="white" onClick={onReset}>
          Reset
        </Button>
      </Grid.Col>

      <Group gap="xs" align="center" mt="xs" ml="xs">
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
              setPerPage?.(Number(value));
            }
          }}
        />
        <Text c="#7a808a" fz="0.9rem">
          entries
        </Text>
      </Group>
    </Grid>
  );
}
