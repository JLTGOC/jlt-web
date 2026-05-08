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
import {
  Search,
  ChevronRight,
} from "@nine-thirty-five/material-symbols-react/rounded";

import type {JobOrderResponse} from "@/features/job-order/types/jobOrder";

type JobOrderRow = JobOrderResponse;
type ServiceFilterValue = "LOGISTICS" | "REGULATORY" | "ALL";
type StatusFilterValue =
  | "AVAILABLE"
  | "ASSIGNED"
  | "REASSIGNMENT REQUESTED"
  | "ALL";

interface JobOrderFilterTableProps {
  quotations: JobOrderRow[];
  clientSearchValue: string;
  onClientSearchChange: (value: string) => void;
  onClientSearch: (value: string) => void;
  asSearchValue: string;
  onAsSearchChange: (value: string) => void;
  onAsSearch: (value: string) => void;
  perPage: number;
  setPerPage?: (value: number) => void;
  statusFilter: StatusFilterValue;
  setStatusFilter: (value: StatusFilterValue) => void;
  searchPlaceholder?: string;
  total?: number;
}

export function JobOrderFilterTable({
  quotations: _quotations,
  clientSearchValue,
  onClientSearchChange,
  onClientSearch,
  onAsSearchChange,
  onAsSearch,
  perPage,
  statusFilter,
  setStatusFilter,
  setPerPage,
  total = 10,
}: JobOrderFilterTableProps) {

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
          <Select
            w="100%"
            size="sm"
            placeholder="SELECT STATUS"
            data={statusOptions}
            value={statusFilter}
            onChange={(value) => {
              if (
                value === "AVAILABLE" ||
                value === "ASSIGNED" ||
                value === "REASSIGNMENT REQUESTED"
              ) {
                setStatusFilter(value);
                return;
              }
              setStatusFilter("ALL");
            }}
            rightSection={<ChevronRight width={16} />}
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
