// src/features/accounts/components/clients/ClientDetails.tsx
import { Box, Stack, Group, Text, Button, UnstyledButton, Menu } from "@mantine/core";
import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { ClientHeader } from "./details/ClientHeader";
import { ClientsStatus } from "./details/ClientStats";
import { ClientTables } from "./details/ClientTables";
import { accountsService } from "../../services/accounts.service";
import type { ClientDetails } from "@/features/accounts/types/accounts.types";
import { MoreHoriz, MobiledataArrows, Edit as MaterialEdit, ToggleOff, ToggleOn } from "@nine-thirty-five/material-symbols-react/outlined";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";
import pageCardClasses from "@/components/PageCard.module.css";

export function ClientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Client ID is missing");
      setIsLoading(false);
      return;
    }

    // Debug log: print the client ID being used
    // eslint-disable-next-line no-console
    console.log("Fetching client details for ID:", id, typeof id);

    setIsLoading(true);
    setError(null);

    accountsService
      .getClientFullDetails(Number(id))
      .then(setClient)
      .catch((err) => {
        console.error("Failed to load client details", err);
        setError("Unable to load client details.");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <Box style={{ width: "100%" }}>
        <Text>Loading client details…</Text>
      </Box>
    );
  }

  if (error || !client) {
    return (
      <Box style={{ width: "100%" }}>
        <Text c="red">{error ?? "Client not found."}</Text>
      </Box>
    );
  }

  return (
    <Box style={{ width: "100%" }}>
      <Stack gap="lg">
        {/* Title + Actions */}
        <Group justify="space-between" align="center">
          <Group align="center" gap="sm">
            <UnstyledButton onClick={() => navigate(-1)} aria-label="Go back" className={pageCardClasses.backButton}>
              <ArrowBack width="1.5rem" height="1.5rem" fill="currentColor" />
            </UnstyledButton>
            <Stack gap={0}>
              <Text fw={700} size="xl" c="jltBlue.8">
                CLIENT DETAILS
              </Text>
              <Text size="sm" c="dimmed" mt={-8}>
                View detailed information of the selected client
              </Text>
            </Stack>
          </Group>

          <Group gap="sm">
            <Button
              style={{
                backgroundColor: "#4E6174",
                color: "#fff",
              }}
            >
              Message Client
            </Button>
            <Menu shadow="md" width={200} position="bottom-end">
              <Menu.Target>
                <Button
                  style={{
                    backgroundColor: "#4E6174",
                    color: "#fff",
                    padding: "0.5rem",
                  }}
                >
                  <MoreHoriz width={20} height={20} style={{ color: "#fff" }} />
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={() => console.log("Change Status")}> 
                  <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                    <MobiledataArrows
                      width={18}
                      height={18}
                      style={{ color: "#1D274E", transform: "rotate(270deg)" }}
                    />
                    <Text>Change Status</Text>
                  </Group>
                </Menu.Item>

                <Menu.Item onClick={() => console.log("Edit Client")}> 
                  <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                    <MaterialEdit width={18} style={{ color: "#1D274E" }} />
                    <Text>Edit Client</Text>
                  </Group>
                </Menu.Item>

                <Menu.Item onClick={() => console.log("Deactivate Client")}> 
                  <Group gap="sm" align="center" style={{ whiteSpace: "nowrap" }}>
                    <ToggleOff width={18} style={{ color: "#1D274E" }} />
                    <Text>Deactivate Client</Text>
                  </Group>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>

        <ClientHeader client={client} />
        <ClientsStatus client={client} />
        <ClientTables client={client} />
      </Stack>
    </Box>
  );
}
