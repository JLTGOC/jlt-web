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
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: 218,
      }}
    >
      {/* Empty top bar */}
      <MantineBox
        bg="#D4DAE0"
        p="xs"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          minHeight: 61,
        }}
      />

      {/* Bottom section with quotation details */}
      <MantineBox p="lg" bg="white" style={{ flex: 1, position: "relative" }}>
        <Stack gap="sm" style={{ zIndex: 2, position: "relative" }}>
          <Group>
            <Text c="gray.6">Quotation:</Text>
            <Text fw={450}>{quotation.reference_number || "—"}</Text>
          </Group>
          <Group>
            <Text c="gray.6">PIC:</Text>
            <Text fw={450}>{quotation.person_in_charge || "—"}</Text>
          </Group>
          <Group>
            <Text c="gray.6">
              {isAccepted
                ? "QTN. Accepted:"
                : isResponded
                  ? "QTN. Responded:"
                  : "QTN. Created:"}
            </Text>
            <Text fw={450}>
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
          width={110}
          height={110}
          fit="contain"
          style={{
            position: "absolute",
            right: "-10rem",
            bottom: "0rem",
            zIndex: 1,
          }}
        />
      </MantineBox>
    </Paper>
  );
}
