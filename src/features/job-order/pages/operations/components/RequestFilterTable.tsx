import { useMemo } from "react";
import {
  Button,
  Divider,
  Grid,
  Group,
  Select,
  Text,
  Input,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import {
  ChevronRight,
  CalendarMonth,
  Search,
} from "@nine-thirty-five/material-symbols-react/rounded";
import type { RequestedQuotationListItem } from "@/features/quotations/types/quotations.types";

type RequestedQuotationRow = RequestedQuotationListItem;
type ServiceFilterValue = "LOGISTICS" | "REGULATORY" | "ALL";
type StatusFilterValue =
  | "AVAILABLE"
  | "ASSIGNED"
  | "REASSIGNMENT REQUESTED"
  | "ALL";

interface RequestFilterTableProps {
  quotations: RequestedQuotationRow[];
  clientSearchValue: string;
  onClientSearchChange: (value: string) => void;
  onClientSearch: (value: string) => void;
  asSearchValue: string;
  onAsSearchChange: (value: string) => void;
  onAsSearch: (value: string) => void;
  perPage: number;
  setPerPage?: (value: number) => void;
  serviceFilter: ServiceFilterValue;
  setServiceFilter: (value: ServiceFilterValue) => void;
  statusFilter: StatusFilterValue;
  setStatusFilter: (value: StatusFilterValue) => void;
  dateFilter: string,
  setDateFilter: (value: string) => void;
  searchPlaceholder?: string;
  total?: number;
}

export function RequestFilterTable({
  quotations: _quotations,
  clientSearchValue,
  onClientSearchChange,
  onClientSearch,
  asSearchValue,
  onAsSearchChange,
  onAsSearch,
  perPage,
  serviceFilter,
  setServiceFilter,
  statusFilter,
  setStatusFilter,
  setPerPage,
  dateFilter,
  setDateFilter,
  total = 10,
}: RequestFilterTableProps) {

  //for drop down ahow entries
  const entryOptions = useMemo(() => {
    if (total <= 0) return ["10"];

    const options = new Set<number>();
    const increment = 10;

    for (let i = increment; i < total; i += increment) {
      options.add(i);
    }

    options.add(total);

    return Array.from(options)
      .sort((a, b) => a - b)
      .map(String);
  }, [total]);

  const serviceOptions = ["LOGISTICS", "REGULATORY", "ALL SERVICES"];

  const statusOptions = useMemo(
    () => [
      { value: "AVAILABLE", label: "ACCEPT" },
      { value: "ASSIGNED", label: "ACCEPTED" },
      { value: "REASSIGNMENT REQUESTED", label: "REASSIGNMENT " },
    ],
    [],
  );

  return (
    <>
      <Grid gutter="xs" mb="sm" align="end">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Input
            w="100%"
            size="sm"
            rightSectionWidth={45}
            placeholder={"SEARCH CLIENT OR REF NO."}
            value={clientSearchValue}
            onChange={(event) =>
              onClientSearchChange(event.currentTarget.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onClientSearch(clientSearchValue);
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
                onClick={() => onClientSearch(clientSearchValue)}
              >
                <Search width={24} height={24} fill="white" />
              </Button>
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Input
            w="100%"
            size="sm"
            placeholder="SELECT STATUS"
            // value={statusFilter}
            rightSectionWidth={45}
            rightSection={
              <Button
                type="button"
                h={36}
                w={45}
                p={0}
                radius="sm"
                color="#4f657d"
                aria-label="Search"
                onClick={() => onClientSearch(clientSearchValue)}
              >
                <Search width={24} height={24} fill="white" />
              </Button>
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 2 }}>
          <Input
            w="100%"
            size="sm"
            rightSectionWidth={45}
            placeholder={"SEARCH AS"}
            value={asSearchValue}
            onChange={(event) => onAsSearchChange(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                onAsSearch(asSearchValue);
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
                onClick={() => onAsSearch(asSearchValue)}
              >
                <Search width={24} height={24} fill="white" />
              </Button>
            }
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 1 }}>
          <Button
            type="button"
            h={36}
            w="100%"
            px="sm"
            radius="sm"
            color="#4f657d"
            onClick={() => {
              setDateFilter("");
              setServiceFilter("ALL");
              setStatusFilter("ALL");
              onClientSearchChange("");
              onClientSearch("");
              onAsSearchChange("");
              onAsSearch("");
            }}
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
    </>
  );
}
