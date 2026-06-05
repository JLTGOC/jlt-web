import { Button, Grid, Input, Select, Group, Text, Divider, Flex } from "@mantine/core";
import { Search,PersonAdd } from "@nine-thirty-five/material-symbols-react/rounded";

interface CompanyTableFiltersProps {
  companySearchValue: string;
  onCompanySearchChange: (value: string) => void;
  onCompanySearch: () => void;
  asSearchValue: string;
  onAsSearchChange: (value: string) => void;
  onAsSearch: () => void;
  onReset: () => void;
  onAddCompany: () => void;
  perPage: number;
  setPerPage: (value: number) => void;
}

export function CompanyTableFilters({
  companySearchValue,
  onCompanySearchChange,
  onCompanySearch,
  asSearchValue,
  onAsSearchChange,
  onAsSearch,
  onReset,
  onAddCompany,
  perPage,
  setPerPage,
}: CompanyTableFiltersProps) {
  return (
    <Grid gutter="xs" mb="sm" align="end">
      <Grid.Col span={12}>
        <Flex justify="space-between" wrap="wrap" align="flex-end">
          <Flex gap="0.75rem" wrap="wrap" align="flex-end">
            <Input
              w={450}
              size="sm"
              rightSectionWidth={45}
              placeholder="SEARCH COMPANIES"
              value={companySearchValue}
              onChange={(event) => onCompanySearchChange(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onCompanySearch();
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
                  aria-label="Search companies"
                  onClick={onCompanySearch}
                >
                  <Search width={24} height={24} fill="white" />
                </Button>
              }
            />

            <Input
              w={350}
              size="sm"
              rightSectionWidth={45}
              placeholder="SEARCH AS"
              value={asSearchValue}
              onChange={(event) => onAsSearchChange(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onAsSearch();
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
                  aria-label="Search as"
                  onClick={onAsSearch}
                >
                  <Search width={24} height={24} fill="white" />
                </Button>
              }
            />
          </Flex>

          <Flex gap="0.5rem" wrap="wrap" justify="flex-end" align="flex-end">
            <Button variant="outline" bg="#4f657d" color="white" onClick={onAddCompany}>
              <PersonAdd width={20} height={20} fill="white" style={{ marginRight: 8 }} />
              ADD COMPANY
            </Button>
            <Button variant="outline" bg="#4f657d" color="white" onClick={onReset}>
              RESET
            </Button>
          </Flex>
        </Flex>
      </Grid.Col>

      <Grid.Col span={12}>
        <Divider my="xs" />
      </Grid.Col>

      <Grid.Col span={12}>
        <Group gap="xs" align="center" mt="-0.5rem" ml="xs">
          <Text c="#7a808a" fz="0.9rem">
            Show
          </Text>
          <Select
            w={70}
            size="xs"
            data={["10", "20", "30"]}
            value={String(perPage)}
            onChange={(value) => {
              if (!value) return;
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
