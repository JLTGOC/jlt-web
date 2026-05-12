import {
  Group,
  Paper,
  Stack,
  Text,
  ActionIcon,
  Box as MantineBox,
  Avatar,
} from "@mantine/core";
import { Chat } from "@nine-thirty-five/material-symbols-react/outlined";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

interface ReferenceHeaderProps {
  quotation: QuotationResource;
}

export function ReferenceHeader({ quotation }: ReferenceHeaderProps) {
  return (
    <Paper
      radius="md"
      withBorder
      style={{
        marginTop: "-1rem",
        width: "auto",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
        height: 218,
      }}
    >
      {/* Top bar with avatar + client name + chat icon */}
      <MantineBox
        bg="#D4DAE0"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 61,
          padding: "0.5rem",
        }}
      >
        <Group gap="sm">
          <Avatar
            radius="xl"
            size="md"
            src={null}
            alt={quotation.client?.full_name || "Client Avatar"}
          />
          <Text fw={700} size="lg" c="jltBlue.8" tt="uppercase">
            {quotation.client?.full_name || "—"}
          </Text>
        </Group>
        <ActionIcon
          variant="subtle"
          radius="xxl"
          size="lg"
          aria-label="Chat"
          onClick={() => console.log("Chat clicked")}
          style={{ zIndex: 10 }}
        >
          <Chat width={30} height={30} />
        </ActionIcon>
      </MantineBox>

      {/* Company info */}
      <MantineBox p="0.5rem" bg="white" style={{ flex: 1, marginTop: "1rem", position: "relative" }}>
        {/* Vertical Spacing */}
        <Stack gap="sm" style={{ paddingLeft: "0.5rem" }}>
          {/* Horizontal Spacing */}
          <Group gap="0.75rem" align="baseline">
            <Text
              c="dimmed"
              size="sm"
              tt="uppercase"
              lts="0.06em"
              style={{ flexShrink: 0, minWidth: "10rem" }}
            >
              COMPANY NAME
            </Text>
            <Text size="sm" c="var(--mantine-color-jltBlue-8)">
              {quotation.client?.company_name || "—"}
            </Text>
          </Group>

          <Group gap="0.75rem" align="baseline">
            <Text
              c="dimmed"
              size="sm"
              tt="uppercase"
              lts="0.06em"
              style={{ flexShrink: 0, minWidth: "10rem" }}
            >
              CONTACT NO.
            </Text>
            <Text size="sm" c="var(--mantine-color-jltBlue-8)">
              {quotation.client?.contact_number || "—"}
            </Text>
          </Group>

          <Group gap="0.75rem" align="baseline">
            <Text
              c="dimmed"
              size="sm"
              tt="uppercase"
              lts="0.06em"
              style={{ flexShrink: 0, minWidth: "10rem" }}
            >
              EMAIL
            </Text>
            <Text size="sm" c="var(--mantine-color-jltBlue-8)">
              {quotation.client?.email || "—"}
            </Text>
          </Group>
        </Stack>
      </MantineBox>
    </Paper>
  );
}
