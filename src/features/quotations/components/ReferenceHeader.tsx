import {
  Group,
  Paper,
  Stack,
  Text,
  Image,
  ActionIcon,
  Box as MantineBox,
  Avatar,
} from "@mantine/core";
import chatbubble from "@/assets/icons/chatbubble.svg";
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
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar with avatar + client name + chat icon */}
      <MantineBox
        bg="#D4DAE0"
        p="xs"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 48,
        }}
      >
        <Group gap="sm">
          <Avatar
            radius="xl"
            size="md"
            src={null} // will replace with actual avatar URL when available
            alt={quotation.client?.full_name || "Client Avatar"}
          />
          <Text fw={700} size="lg" c="jltBlue.8">
            {quotation.client?.full_name || "—"}
          </Text>
        </Group>
        <ActionIcon
          variant="transparent"
          color="transparent"
          radius="xxl"
          size="lg"
          aria-label="Chat"
          onClick={() => console.log("Chat clicked")}
        >
          <Image src={chatbubble} alt="Chat Icon" width={30} height={30} />
        </ActionIcon>
      </MantineBox>

      {/* Company info */}
      <MantineBox p="lg" bg="white" style={{ flex: 1 }}>
        <Stack gap="sm">
          <Group>
            <Text c="gray.6">COMPANY NAME:</Text>
            <Text fw={450}>{quotation.company.name || "—"}</Text>
          </Group>
          <Group>
            <Text c="gray.6">CONTACT NO.:</Text>
            <Text fw={450}>{quotation.company.contact_number || "—"}</Text>
          </Group>
          <Group>
            <Text c="gray.6">EMAIL:</Text>
            <Text fw={450}>{quotation.company.email || "—"}</Text>
          </Group>
        </Stack>
      </MantineBox>
    </Paper>
  );
}
