import {
  Box,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";

import type { ClientCounts } from "@/features/quotations/types/quotations.types";

interface RespondedFilterClientProps {
  clientFilter: "ALL" | "NEW" | "OLD";
  setClientFilter: (value: "ALL" | "NEW" | "OLD") => void;
  clientCounts: ClientCounts | undefined;
}

const tabStyles = {
  root: {
    display: "flex",
    alignItems: "center",
    gap: "0.4rem",
    padding: "0.45rem 0.7rem",
    borderBottom: "2px solid transparent",
    cursor: "default",
    transition: "border-bottom-color 150ms ease",
  },
};

const Clients: Array<"ALL" | "NEW" | "OLD"> = ["ALL", "NEW", "OLD"];

export function RespondedFilterClient({
  clientFilter,
  setClientFilter,
  clientCounts,
}: RespondedFilterClientProps) {
  // Helper to get display label for client type
  const getClientLabel = (client: "ALL" | "NEW" | "OLD") => {
    if (client === "NEW") return "NEW CLIENTS";
    if (client === "OLD") return "OLD CLIENTS";
    return "ALL CLIENTS";
  };

  // Helper to render the colored circle for NEW/OLD
  const renderCircle = (client: "ALL" | "NEW" | "OLD") => {
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
        width: 1675,
        marginLeft: 13,
        paddingLeft: 20,
      }}
    >
      <Group gap="md">
        {Clients.map((client, index) => (
          <Group key={client} gap="md" align="center">
            <UnstyledButton
              styles={tabStyles}
              style={{
                borderBottomColor: clientFilter === client ? "#ef8f27" : "transparent",
              }}
              onClick={() => setClientFilter(client)}
            >
              <Group gap="0.4rem" align="center">
                {renderCircle(client)}
                <Text fz="0.82rem" fw={700} c="#2c3f55">
                  {getClientLabel(client)}
                </Text>
                <Text fz="0.82rem" fw={700} c="#8a8f99">
                  {client === "ALL"
                    ? clientCounts?.all_quotations
                    : client === "OLD"
                    ? clientCounts?.old_user_quotations
                    : clientCounts?.new_user_quotations}
                </Text>
              </Group>
            </UnstyledButton>
            {index < Clients.length - 1 && (
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
