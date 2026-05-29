import {
  Paper,
  Stack,
  Group,
  Text,
  Box as MantineBox,
  Anchor,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";
import { shipmentRoutes } from "@/features/shipments/utils/shipmentRoutes";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import styles from "./Documents.module.css";

interface ShipmentFilesProps {
  shipment: ShipmentResource;
}

interface FileItem {
  title: string;
  uploadedBy: string;
  url?: string;
}

interface InvoiceItem extends FileItem {
  paymentStatus?: string;
}

function getPaymentStatusColor(status: string | undefined): string {
  if (!status) return "#64748B";

  const statusMap: Record<string, string> = {
    paid: "#16A34A",
    "partially paid": "#F59E0B",
    unpaid: "#DC2626",
  };

  const normalized = status.toLowerCase();
  return statusMap[normalized] || "#64748B";
}

export function ShipmentFiles({ shipment }: ShipmentFilesProps) {
  const navigate = useNavigate();
  const { tab, clientId, shipmentId } = useParams<{
    tab: string;
    clientId: string;
    shipmentId: string;
  }>();

  const documents: FileItem[] = [
    ...(shipment.documents ?? []),
    ...(shipment.quotation_proposals ?? []),
  ]
    .filter((doc) => doc.uploadedBy === "JLTCB" || doc.uploadedBy === undefined)
    .map((doc) => ({
      title: doc.file_name ?? "Untitled Document",
      uploadedBy: doc.uploadedBy ?? "JLTCB",
      url: doc.file_url,
    }));

  const invoices: InvoiceItem[] = [];

  const shipmentDocumentsPath =
    tab && clientId && shipmentId
      ? shipmentRoutes.documents({ tab, clientId, shipmentId })
      : "/shipments";

  const paperStyle = {
    border: "1px solid var(--mantine-color-gray-2)",
    backgroundColor: "#F8FAFC",
    minHeight: "207px",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  } as const;

  const headerStyledocs = {
    marginBottom: 0,
    border: "1px solid var(--mantine-color-gray-2)",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "3.2rem",
  } as const;

    const headerStyleinvoice = {
    marginBottom: 0,
    border: "1px solid var(--mantine-color-gray-2)",
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "2.3rem",
  } as const;

  return (
    <Stack gap="lg" style={{ flex: 1 }}>
      {/* Documents Paper */}
      <Paper radius="md" withBorder p={0} style={paperStyle}>
        {/* Header */}
        <Paper p="sm" bg="#D4DAE0" radius="md" style={headerStyledocs}>
          <MantineBox>
            <Text fw={700} size="md" c="gray.8">
              DOCUMENTS
            </Text>
            <Text c="gray.6" size="xs" mt={-6}>
              uploaded by JLTCB
            </Text>
          </MantineBox>
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate(shipmentDocumentsPath)}
            size="sm"
            fw={500}
            style={{ padding: 0, border: "none", background: "none" }}
          >
            View All
          </Anchor>
        </Paper>

        {/* Content */}
        <Stack gap="xs" style={{ flex: 1, padding: "0.75rem", backgroundColor: "white" }}>
          {documents.length > 0 ? (
            documents.slice(0, 2).map((doc, index) => (
              <MantineBox
                key={index}
                p="xs"
                className={styles.documentCard}
                onClick={() => {
                  if (doc.url) {
                    window.open(doc.url, '_blank');
                  }
                }}
                style={{
                  border: "1px solid var(--mantine-color-gray-2)",
                  borderRadius: "0.375rem",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <Group align="center" gap="sm">
                  <MantineBox
                    style={{
                      width: 76,
                      height: 64,
                      minWidth: 76,
                      borderRadius: "0.5rem",
                      overflow: "hidden",
                      backgroundColor: "#F1F5F9",
                      boxShadow: "inset 0 0 0 1px rgba(15, 23, 42, 0.04)",
                    }}
                  >
                    <PdfThumbnail url={doc.url ?? ""} />
                  </MantineBox>
                  <MantineBox style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={700} size="sm" c="gray.8" lineClamp={2}>
                      {doc.title}
                    </Text>
                    <Text c="gray.5" size="xs" mt={4}>
                      {doc.uploadedBy}
                    </Text>
                  </MantineBox>
                </Group>
              </MantineBox>
            ))
          ) : (
            <Text c="gray.6" size="xs" ta="center" py="md">
              No documents available.
            </Text>
          )}
        </Stack>
      </Paper>

      {/* Invoice Paper */}
      <Paper radius="md" withBorder p={0} style={paperStyle}>
        {/* Header */}
        <Paper p="sm" bg="#D4DAE0" radius="md" style={headerStyleinvoice}>
          <MantineBox>
            <Text fw={700} size="md" c="gray.8">
              INVOICE
            </Text>
          </MantineBox>
          <Anchor
            component="button"
            type="button"
            onClick={() => navigate(shipmentDocumentsPath)}
            size="sm"
            fw={500}
            style={{ padding: 0, border: "none", background: "none" }}
          >
            View All
          </Anchor>
        </Paper>

        {/* Content */}
        <Stack gap="sm" style={{ flex: 1, padding: "1rem", backgroundColor: "white" }}>
          {invoices.length > 0 ? (
            invoices.slice(0, 3).map((invoice, index) => (
              <MantineBox
                key={index}
                p="sm"
                className={styles.documentCard}
                onClick={() => {
                  if (invoice.url) {
                    window.open(invoice.url, '_blank');
                  }
                }}
                style={{
                  border: "1px solid var(--mantine-color-gray-2)",
                  borderRadius: "0.375rem",
                  backgroundColor: "white",
                  cursor: "pointer",
                }}
              >
                <Group justify="space-between" align="flex-start">
                  <MantineBox style={{ flex: 1 }}>
                    <Text fw={500} size="sm" c="gray.8">
                      {invoice.title || "Untitled Invoice"}
                    </Text>
                    <Text c="gray.6" size="xs">
                      {invoice.uploadedBy || "—"}
                    </Text>
                  </MantineBox>
                  {invoice.paymentStatus && (
                    <MantineBox
                      p="xs"
                      style={{
                        borderRadius: "0.25rem",
                        backgroundColor: getPaymentStatusColor(
                          invoice.paymentStatus
                        ),
                        minWidth: 80,
                      }}
                    >
                      <Text
                        fw={600}
                        size="xs"
                        c="white"
                        ta="center"
                        tt="capitalize"
                      >
                        {invoice.paymentStatus}
                      </Text>
                    </MantineBox>
                  )}
                </Group>
              </MantineBox>
            ))
          ) : (
            <Text c="gray.6" size="sm" ta="center" py="md">
              No invoices available.
            </Text>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
