import {
  Button,
  Divider,
  Grid,
  Group,
  Input,
  Select,
  Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import {
  CalendarMonth,
  ChevronRight,
  Search,
} from "@nine-thirty-five/material-symbols-react/rounded";

import { useAcceptedQuotationsContext } from "./AcceptedQuotationsContext";

export function AcceptedQuotationsFilters() {
  const { state, actions } = useAcceptedQuotationsContext();
  const entryOptions = ["10", "20", "30"];

  return (
    <>
      <Grid gutter="xs" mb="sm" align="end">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Input
            w="100%"
            size="sm"
            rightSectionWidth={45}
            placeholder="SEARCH CLIENT OR REF NO."
            value={state.searchValue}
            onChange={(event) =>
              actions.setSearchValue(event.currentTarget.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                actions.submitSearch();
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
                onClick={actions.submitSearch}
              >
                <Search width={24} height={24} fill="white" />
              </Button>
            }
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 3 }}>
          <DateInput
            w="100%"
            size="sm"
            rightSectionWidth={45}
            placeholder="DATE ACCEPTED"
            value={state.dateAccepted ? new Date(state.dateAccepted) : null}
            onChange={(date) => {
              const formatted = date ? dayjs(date).format("YYYY-MM-DD") : "";
              actions.setDateAccepted(formatted);
            }}
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
          <Select
            w="100%"
            size="sm"
            placeholder="ALL SERVICES"
            data={["ALL SERVICES", "LOGISTICS", "REGULATORY"]}
            value={state.serviceFilter}
            onChange={(value) => {
              if (
                value === "ALL SERVICES" ||
                value === "LOGISTICS" ||
                value === "REGULATORY"
              ) {
                actions.setServiceFilter(value);
              }
            }}
            rightSection={<ChevronRight width={16} />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 2 }}>
          <Button
            type="button"
            h={36}
            w="100%"
            px="sm"
            radius="sm"
            color="#4f657d"
            onClick={actions.resetFilters}
          >
            RESET
          </Button>
        </Grid.Col>
      </Grid>

      <Divider color="#e5e8ed" mb="xs" />

      <Group gap="xs" align="center">
        <Text c="#7a808a" fz="0.9rem">
          Show
        </Text>
        <Select
          w={70}
          size="xs"
          data={entryOptions}
          value={String(state.perPage)}
          onChange={(value) => {
            if (value) {
              actions.setPerPage(Number(value));
            }
          }}
        />
        <Text c="#7a808a" fz="0.9rem">
          entries
        </Text>
      </Group>
    </>
  );
}
