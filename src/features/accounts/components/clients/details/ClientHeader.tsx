// src/features/accounts/components/clients/details/ClientHeader.tsx
import { Paper, Box, Grid, Stack, Text, Avatar, Group } from "@mantine/core";
import { Person } from "@nine-thirty-five/material-symbols-react/rounded";
import type { ClientDetails } from "@/features/accounts/types/accounts.types";

function formatCreatedDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const month = date.toLocaleString("en-US", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

interface ClientHeaderProps {
  client: ClientDetails;
}

export function ClientHeader({ client }: ClientHeaderProps) {
  const labelStyle = { minWidth: 147, flexShrink: 0 as const };
  return (
    <Paper shadow="sm" radius="md" p={0} style={{ position: "relative", overflow: "hidden" }}>
      {/* Top header band */}
      <Box
        bg="#D4DAE0"
        h="2.5rem"
        style={{
          borderRadius: "6px 6px 0 0",
          margin: 0,
        }}
      />

      <Box px="1rem" pt="1rem" pb="1rem">
        <Grid>
          <Grid.Col span={6}>
            <Group align="flex-start" gap="2rem" style={{ flex: "1 1 auto", minWidth: 0 }}>
              <Avatar
                size={110}
                radius="10rem"
                color="gray"
                src={client.profileImageUrl ?? undefined}
                style={{ marginLeft: "1rem" }}
              >
                <Person width={36} height={36} />
              </Avatar>

              <Stack gap="xs" style={{ minWidth: 0, flex: 1 }}>
                <Text fw={700} size="xl" style={{ minWidth: 0, color: "#17314B", wordBreak: "break-word" }}>
                  {client.clientName}
                </Text>

                <Stack gap="xs">
                  <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                    <Text c="gray.6" size="sm" style={labelStyle}>
                      POSITION
                    </Text>
                    <Text fw={600} size="sm" style={{ minWidth: 0 }}>
                      {client.position ?? "—"}
                    </Text>
                  </Group>

                  <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                    <Text c="gray.6" size="sm" style={labelStyle}>
                      CONTACT NO.
                    </Text>
                    <Text fw={600} size="sm" style={{ minWidth: 0 }}>
                      {client.contactNumber ?? "—"}
                    </Text>
                  </Group>

                  <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1rem" }}>
                    <Text c="gray.6" size="sm" style={labelStyle}>
                      EMAIL
                    </Text>
                    <Text fw={600} size="sm" truncate style={{ minWidth: 0 }}>
                      {client.email ?? "—"}
                    </Text>
                  </Group>
                </Stack>
              </Stack>
            </Group>
          </Grid.Col>

          <Grid.Col span={6}>
            <Stack gap="xs">
              <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "2rem", width: "100%" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  DATE CREATED
                </Text>
                <Text fw={600} size="sm" style={{ minWidth: 0 }}>
                  {formatCreatedDate(client.dateCreated)}
                </Text>
              </Group>

              <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "2rem", width: "100%" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  COMPANY NAME
                </Text>
                <Text fw={600} size="sm" style={{ minWidth: 0 }}>
                  {client.companyName ?? "—"}
                </Text>
              </Group>

              <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "1.4rem", width: "100%" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  COMPANY ADDRESS
                </Text>
                <Text fw={600} size="sm" truncate style={{ minWidth: 0 }}>
                  {client.companyAddress ?? "—"}
                </Text>
              </Group>

              <Group align="center" wrap="wrap" style={{ minHeight: "1rem", gap: "2rem", width: "100%" }}>
                <Text c="gray.6" size="sm" style={labelStyle}>
                  BUSINESS TYPE
                </Text>
                <Text fw={600} size="sm" style={{ minWidth: 0 }}>
                  {client.businessType ?? "—"}
                </Text>
              </Group>
            </Stack>
          </Grid.Col>
        </Grid>
      </Box>

      <Person
        width={250}
        height={250}
        style={{
          position: "absolute",
          right: "-65px",
          bottom: "-55px",
          transform: "rotate(-18deg)",
          color: "#BEBEBE",
          opacity: 0.3,
          pointerEvents: "none",
        }}
      />
    </Paper>
  );
}
