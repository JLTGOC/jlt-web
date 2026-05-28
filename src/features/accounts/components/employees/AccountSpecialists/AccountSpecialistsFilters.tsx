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
import {
  Search,
  ChevronRight,
  PersonAdd,
} from "@nine-thirty-five/material-symbols-react/rounded";

interface AccountSpecialistsFilterProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: (value: string) => void;
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
  roleValue,
  onRoleChange,
  onReset,
  perPage,
  setPerPage,
}: AccountSpecialistsFilterProps) {
  const entryOptions = ["10", "20", "30"];

  return (
    <Grid gutter="xs" mb="sm" align="end">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Input
          w="100%"
          size="sm"
          rightSectionWidth={45}
          placeholder="SEARCH AS"
          value={searchValue}
          onChange={(event) => onSearchChange(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSearch(event.currentTarget.value);
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
        <Select
          w="100%"
          size="sm"
          placeholder="ROLE TYPE"
          data={[
            { value: "ALL", label: "ACCOUNT SPECIALISTS" },
            { value: "REGULAR", label: "REGULAR" },
            { value: "LEAD", label: "LEAD" },
          ]}
          value={roleValue}
          onChange={(value) => onRoleChange(value || "ALL")}
          rightSection={<ChevronRight width={16} />}
        />
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 7 }}>
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
