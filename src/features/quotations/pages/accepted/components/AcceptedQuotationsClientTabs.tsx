import { Box, Group, Text, UnstyledButton } from "@mantine/core";

import type { ClientCounts } from "@/features/quotations/types/quotations.types";

import {
  type ClientFilter,
  useAcceptedQuotationsContext,
} from "./AcceptedQuotationsContext";

export function AcceptedQuotationsClientTabs() {
  const { state, actions } = useAcceptedQuotationsContext();
  const clients: ClientFilter[] = ["ALL", "NEW", "OLD"];

  const getClientLabel = (client: ClientFilter) => {
    if (client === "NEW") return "NEW CLIENT";
    if (client === "OLD") return "OLD CLIENT";
    return "ALL CLIENTS";
  };

  const getClientCount = (client: ClientFilter, counts?: ClientCounts) => {
    if (!counts) return 0;
    if (client === "NEW") return counts.new_user_quotations;
    if (client === "OLD") return counts.old_user_quotations;
    return counts.all_quotations;
  };

  const renderCircle = (client: ClientFilter) => {
    if (client === "NEW") {
      return (
        <Box
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#54B99B",
          }}
        />
      );
    }
    if (client === "OLD") {
      return (
        <Box
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: "#368DC4",
          }}
        />
      );
    }
    return null;
  };

  return (
    <Box
      p="xs"
      style={{
        background: "#ffffff",
        borderRadius: "0.55rem",
        border: "1px solid #e2e6eb",
        paddingBottom: 2,
        paddingTop: 2,
        width: "100%",
        maxWidth: "100%",
        marginLeft: 0,
        paddingLeft: 20,
        overflow: "hidden",
      }}
    >
      <Group gap="md">
        {clients.map((client, index) => (
          <Group key={client} gap="md" align="center">
            <UnstyledButton
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.45rem 0.7rem",
                borderBottom: "2px solid transparent",
                borderBottomColor:
                  state.clientFilter === client ? "#ef8f27" : "transparent",
              }}
              onClick={() => actions.setClientFilter(client)}
            >
              <Group gap="0.4rem" align="center">
                {renderCircle(client)}
                <Text fz="0.82rem" fw={700} c="#2c3f55">
                  {getClientLabel(client)}
                </Text>
                <Text fz="0.82rem" fw={700} c="#8a8f99">
                  {getClientCount(client, state.counts)}
                </Text>
              </Group>
            </UnstyledButton>
            {index < clients.length - 1 && (
              <Text fz="1rem" c="#e2e6eb" fw={700}>
                |
              </Text>
            )}
          </Group>
        ))}
      </Group>
    </Box>
  );
}
