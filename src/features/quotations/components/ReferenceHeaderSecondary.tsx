import {
  Paper,
  Stack,
  Text,
  Group,
  Box as MantineBox,
  Image,
} from "@mantine/core";
import shipmentLogo from "@/assets/logos/ShipmentLogo.png";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import { getQtnStatus } from "@/features/quotations/utils/quotationStatus";

interface ReferenceHeaderSecondaryProps {
  quotation: QuotationResource;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "—";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

export function ReferenceHeaderSecondary({
  quotation,
}: ReferenceHeaderSecondaryProps) {
  const status = getQtnStatus(quotation);
  const isAccepted = status === "accepted";
  const isResponded = status === "responded";

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
        height: 218,
        borderBottomLeftRadius: "0.5rem",
        borderBottomRightRadius: "0.5rem",
      }}
    >
      {/* Empty top bar */}
      <MantineBox
        bg="#D4DAE0"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 61,
          borderBottom: "1px solid #ccc",
        }}
      />

      {/* Bottom section with quotation details */}
      <MantineBox p="0.5rem" bg="white" style={{ flex: 1, position: "relative", marginTop: "1rem" }}>
        <Stack gap="sm" style={{ zIndex: 2, position: "relative", paddingLeft: '0.5rem' }}>
          <Group gap="0.75rem" align="baseline">
            <Text c="dimmed" size="sm" tt="uppercase" lts="0.06em" style={{ flexShrink: 0, minWidth: "12rem" }}>Quotation</Text>
            <Text size="sm" tt="uppercase" c="var(--mantine-color-jltBlue-8)">{quotation.reference_number || "—"}</Text>
          </Group>
          <Group gap="0.75rem" align="baseline">
            <Text c="dimmed" size="sm" tt="uppercase" lts="0.06em" style={{ flexShrink: 0, minWidth: "12rem" }}>PIC</Text>
            <Text size="sm" tt="uppercase" c="var(--mantine-color-jltBlue-8)">{quotation.account_specialist ?? quotation.person_in_charge ?? "—"}</Text>
          </Group>
          <Group gap="0.75rem" align="baseline">
            <Text c="dimmed" size="sm" tt="uppercase" lts="0.06em" style={{ flexShrink: 0, minWidth: "12rem" }}>
              {isAccepted
                ? "QTN. Accepted"
                : isResponded
                  ? "QTN. Responded"
                  : "QTN. Created"}
            </Text>
            <Text size="sm" tt="uppercase" c="var(--mantine-color-jltBlue-8)">
              {isAccepted
                ? formatDate(quotation.qtn_accepted_at)
                : isResponded
                  ? formatDate(quotation.updated_at)
                  : formatDate(quotation.qtn_created_at)}
            </Text>
          </Group>
        </Stack>

        <Image
          src={shipmentLogo}
          alt="Quotation Logo"
          width={120}
          height={120}
          fit="contain"
          style={{
            position: "absolute",
            right: "-16.5rem",
            bottom: "0rem",
            zIndex: 1,
          }}
        />
      </MantineBox>
    </Paper>
  );
}
