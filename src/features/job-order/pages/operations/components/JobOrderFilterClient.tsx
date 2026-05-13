import {
  Badge,
  Box,
  ThemeIcon,
  Group,
  Text,
  UnstyledButton,
} from "@mantine/core";

import type { CountsResponse } from "@/features/job-order/types/operations";

interface JobOrderFilterClientProps {
  clientFilter: "ALL" | "LOGISTICS" | "REGULATORY";
  setClientFilter: (value: "ALL" | "LOGISTICS" | "REGULATORY") => void;
  clientCounts: CountsResponse | undefined;
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

const Clients = ["ALL", "LOGISTICS", "REGULATORY"];

export function JobOrderFilterClient({
  clientFilter,
  setClientFilter,
  clientCounts,
}: JobOrderFilterClientProps) {
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
            {client === "LOGISTICS" ? (
              <ThemeIcon radius="xl" size={10} color={"#54B99B"} />
            ) : client === "REGULATORY" ? (
              <ThemeIcon radius="xl" size={10} color={"#368DC4"} />
            ) : (
              <ThemeIcon radius="xl" size={10} color={"#ffffff"} />
            )}
            <Text fz="0.82rem" fw={700} c="#2c3f55">
              {client}
            </Text>
            <Text fz="0.82rem" fw={700} c="#8a8f99">
              {client === "ALL"
                ? clientCounts?.all_job_orders
                : client === "OLD"
                  ? clientCounts?.old_user_job_orders
                  : clientCounts?.new_user_job_orders}
            </Text>
          </UnstyledButton>
        ))}
      </Group>
    </Box>
  );
}
