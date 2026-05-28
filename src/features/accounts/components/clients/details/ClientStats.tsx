// src/features/accounts/components/clients//details/ClientsStatus.tsx
import { Box, Group, Avatar, Text, SimpleGrid, Stack } from "@mantine/core";
import {
  Box as BoxIcon,
  License,
  RequestQuote,
} from "@nine-thirty-five/material-symbols-react/outlined";
import type { ClientDetails } from "@/features/accounts/types/accounts.types";

interface ClientsStatusProps {
  client: ClientDetails;
}

export function ClientsStatus({ client }: ClientsStatusProps) {
  return (
    <SimpleGrid cols={3} spacing="1.5rem">
      {/* Quotations */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Box
          style={{
            background: "#F3EEFF",
            borderRadius: "0.3rem",
            padding: "1rem",
            height: "100%",
          }}
        >
          <Group
            align="stretch"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
          >
          <Stack style={{ justifyContent: "center", borderRight: "3px solid rgba(23, 49, 75, 0.12)", paddingRight: "1rem" }}>
            <Group style={{ alignItems: "center" }}>
              <Avatar size={60} radius="xl" style={{ backgroundColor: "#eadfff" }}>
                <RequestQuote width={36} height={36} style={{ color: "#6D37C7" }} />
              </Avatar>
              <Stack style={{ gap: 0 }}>
                <Text fw={500} size="sm">Quotations</Text>
                <Text fz="1.5rem" fw={600} c="#17314B">
                  {client.quotationStats.totalQuotation}
                </Text>
              </Stack>
            </Group>
          </Stack>

          <Stack style={{ justifyContent: "center", gap: "0.5rem", paddingLeft: "1rem" }}>
            <Group style={{ justifyContent: "space-between", gap: "1rem" }}>
              <Stack style={{ gap: 0 }}>
                <Text size="xs" fw={500} c="dimmed">Pending</Text>
                <Text fz="1.25rem" fw={600}>
                  {client.quotationStats.pendingQuotation}
                </Text>
              </Stack>
              <Stack style={{ gap: 0 }}>
                <Text size="xs" fw={500} c="dimmed">Accepted</Text>
                <Text fz="1.25rem" fw={600}>
                  {client.quotationStats.acceptedQuotation}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Group>
        </Box>
      </Box>

      {/* Regulatory */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Box
          style={{
            background: "#E9FEFF",
            borderRadius: "0.3rem",
            padding: "1rem",
            height: "100%",
          }}
        >
        <Group
          align="stretch"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          <Stack style={{ justifyContent: "center", gap: "0.5rem", borderRight: "3px solid rgba(23, 49, 75, 0.12)", paddingRight: "1rem" }}>
            <Group style={{ alignItems: "center", gap: "1rem" }}>
              <Avatar size={60} radius="xl" style={{ backgroundColor: "#defcff" }}>
                <License width={36} height={36} style={{ color: "#27A2AF" }} />
              </Avatar>
              <Stack style={{ gap: 0 }}>
                <Text fw={500} size="sm">Regulatory</Text>
                <Text fz="1.5rem" fw={600} c="#17314B">
                  {client.regulatoryStats.totalRegulatory}
                </Text>
              </Stack>
            </Group>
          </Stack>

          <Stack style={{ justifyContent: "center", gap: "0.5rem", paddingLeft: "1rem" }}>
            <Group style={{ justifyContent: "space-between", gap: "1rem" }}>
              <Stack style={{ gap: 0 }}>
                <Text size="xs" fw={500} c="dimmed">Ongoing</Text>
                <Text fz="1.25rem" fw={600}>
                  {client.regulatoryStats.ongoingRegulatory}
                </Text>
              </Stack>
              <Stack style={{ gap: 0 }}>
                <Text size="xs" fw={500} c="dimmed">Completed</Text>
                <Text fz="1.25rem" fw={600}>
                  {client.regulatoryStats.completedRegulatory}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Group>
        </Box>
      </Box>

      {/* Shipments */}
      <Box
        style={{
          background: "#fff",
          borderRadius: "0.5rem",
          padding: "1rem",
          border: "1px solid #e2e6eb",
        }}
      >
        <Box
          style={{
            background: "#FFFAED",
            borderRadius: "0.3rem",
            padding: "1rem",
            height: "100%",
          }}
        >
        <Group
          align="stretch"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
        >
          <Stack style={{ justifyContent: "center", gap: "0.5rem", borderRight: "3px solid rgba(23, 49, 75, 0.12)", paddingRight: "1rem" }}>
            <Group style={{ alignItems: "center", gap: "1rem" }}>
              <Avatar size={60} radius="xl" style={{ backgroundColor: "#ffe7bb" }}>
                <BoxIcon width={36} height={36} style={{ color: "#F5940A" }} />
              </Avatar>
              <Stack style={{ gap: 0 }}>
                <Text fw={500} size="sm">Shipments</Text>
                <Text fz="1.5rem" fw={600} c="#17314B">
                  {client.shipmentStats.totalShipments}
                </Text>
              </Stack>
            </Group>
          </Stack>

          <Stack style={{ justifyContent: "center", gap: "0.5rem", paddingLeft: "1rem" }}>
            <Group style={{ justifyContent: "space-between", gap: "1rem" }}>
              <Stack style={{ gap: 0 }}>
                <Text size="xs" fw={500} c="dimmed">In Progress</Text>
                <Text fz="1.25rem" fw={600}>
                  {client.shipmentStats.inProgressShipments}
                </Text>
              </Stack>
              <Stack style={{ gap: 0 }}>
                <Text size="xs" fw={500} c="dimmed">Completed</Text>
                <Text fz="1.25rem" fw={600}>
                  {client.shipmentStats.completedShipments}
                </Text>
              </Stack>
            </Group>
          </Stack>
        </Group>
        </Box>
      </Box>
    </SimpleGrid>
  );
}
