// src/features/accounts/components/clients/ClientsStatus.tsx
import { Box, Group, Avatar, Text, SimpleGrid, Stack } from "@mantine/core";
import {
  Group as GroupIcon,
  GroupAdd,
  Box as BoxIcon,
  License,
  RequestQuote,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { ClientDashboardStats } from "@/features/accounts/types/accounts.types";

interface ClientsStatusProps {
  stats: ClientDashboardStats;
}

export function ClientsStatus({ stats }: ClientsStatusProps) {
  return (
    <SimpleGrid cols={5} spacing="1.5rem">
      {/* Total Clients */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Group align="center" gap="md" ml="0.5rem" >
          <Avatar size={60} radius="xl" style={{ backgroundColor: "#dfefff" }}>
            <GroupIcon width={36} height={36} style={{ color: "#0963E3" }} />
          </Avatar>
          <Stack gap="0rem">
            <Text fw={500} size="sm">
              Total Clients
            </Text>
            <Text fz="1.5rem" fw={600} c="#17314B">
              {stats.totalClients}
            </Text>
            <Text size="xs" c="dimmed" mt="-0.3rem">
              All registered Client
            </Text>
          </Stack>
        </Group>
      </Box>

      {/* New Clients */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Group align="center" gap="md" ml="0.5rem">
          <Avatar size={60} radius="xl" style={{ backgroundColor: "#eafff1" }}>
            <GroupAdd width={36} height={36} style={{ color: "#0E8C42" }} />
          </Avatar>
          <Stack gap="0rem">
            <Text fw={500} size="sm">
              New Clients
            </Text>
            <Text fz="1.5rem" fw={600} c="#17314B">
              {stats.newClients}
            </Text>
            <Text size="xs" c="dimmed" mt="-0.3rem">
              added this month
            </Text>
          </Stack>
        </Group>
      </Box>

      {/* Active Shipments */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Group align="center" gap="md" ml="0.5rem">
          <Avatar size={60} radius="xl" style={{ backgroundColor: "#fff2d0" }}>
            <BoxIcon width={36} height={36} style={{ color: "#F5940A" }} />
          </Avatar>
          <Stack gap="0rem">
            <Text fw={500} size="sm">
              Active Shipments
            </Text>
            <Text fz="1.5rem" fw={600} c="#17314B">
              {stats.activeShipments}
            </Text>
            <Text size="xs" c="dimmed" mt="-0.3rem">
              In progress
            </Text>
          </Stack>
        </Group>
      </Box>

      {/* Active Regulatory */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Group align="center" gap="md" ml="0.5rem">
          <Avatar size={60} radius="xl" style={{ backgroundColor: "#eafdff" }}>
            <License width={36} height={36} style={{ color: "#27A2AF" }} />
          </Avatar>
          <Stack gap="0rem">
            <Text fw={500} size="sm">
              Active Regulatory
            </Text>
            <Text fz="1.5rem" fw={600} c="#17314B">
              {stats.activeRegulatory}
            </Text>
            <Text size="xs" c="dimmed" mt="-0.3rem">
              Total active regulatory
            </Text>
          </Stack>
        </Group>
      </Box>

      {/* Pending Quotations */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Group align="center" gap="md" ml="0.5rem">
          <Avatar size={60} radius="xl" style={{ backgroundColor: "#f5f0ff" }}>
            <RequestQuote width={36} height={36} style={{ color: "#6D37C7" }} />
          </Avatar>
          <Stack gap="0rem">
            <Text fw={500} size="sm">
              Pending Quotations
            </Text>
            <Text fz="1.5rem" fw={600} c="#17314B">
              {stats.pendingQuotations}
            </Text>
            <Text size="xs" c="dimmed" mt="-0.3rem">
              Awaiting response
            </Text>
          </Stack>
        </Group>
      </Box>
    </SimpleGrid>
  );
}
