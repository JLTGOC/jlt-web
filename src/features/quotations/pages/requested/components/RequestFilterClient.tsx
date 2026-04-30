import {
  Badge,
  Box,
  ThemeIcon,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";

import type { ClientCounts } from "@/features/quotations/types/quotations.types";

interface RequestFilterClientProps {
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
  },
};

const Clients = ["ALL", "NEW", "OLD"];

export function RequestFilterClient({
  clientFilter,
  setClientFilter,
  clientCounts,
}: RequestFilterClientProps) {
  return (
    <Box
      p="xs"
      style={{
        background: "#ffffff",
        borderRadius: "0.55rem",
        border: "1px solid #e2e6eb",
      }}
    >
      <Group gap="md">
        {Clients.map((client) => (
          <UnstyledButton
            key={client}
            styles={tabStyles}
            style={{
              borderBottomColor:
                clientFilter === client ? "#ef8f27" : "transparent",
            }}
            onClick={() => setClientFilter(client as any)}
          >
            {client === "NEW" ? (
              <ThemeIcon radius="xl" size={12} color={"#54B99B"}/>
            ) : client === "OLD" ? (
              <ThemeIcon radius="xl" size={12} color={"#368DC4"}/>
            ) : (
              <ThemeIcon radius="xl" size={12} color={"#ffffff"}/>
            )}
            <Text fz="0.82rem" fw={700} c="#2c3f55">
              {client} CLIENTS
            </Text>
            <Text fz="0.82rem" fw={700} c="#8a8f99">
              {client === "ALL"
                ? clientCounts?.all_quotations
                : client === "OLD"
                  ? clientCounts?.old_user_quotations
                  : clientCounts?.new_user_quotations}
            </Text>
          </UnstyledButton>
        ))}
      </Group>
    </Box>
  );
}
