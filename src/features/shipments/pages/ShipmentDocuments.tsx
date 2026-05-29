import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, Text, Box, Button, Menu, Group, Modal, TextInput, Paper } from "@mantine/core";
import { MoreVert, Download, Print, BorderColor } from "@nine-thirty-five/material-symbols-react/outlined";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { ROLES } from "@/types/roles";
import { PageCard } from "@/components/PageCard";
import { DetailCard } from "@/components/DetailCard";
import { fetchShipment } from "@/features/shipments/services/shipments.service";
import { canShowUploadButton } from "@/features/shipments/utils/uploadButtonPolicy";
import type { ShipmentResource } from "@/features/shipments/types/shipments.types";
import { PdfThumbnail } from "@/components/PdfThumbnail";

import { AddCircle } from "@nine-thirty-five/material-symbols-react/outlined";
import docClientIcon from "@/assets/icons/docClient.svg";
import docJLTCBIcon from "@/assets/icons/docJLTCB.svg";
import invoiceIcon from "@/assets/icons/invoice.svg";
import styles from "@/features/shipments/components/details/Documents.module.css";

export function ShipmentDocuments() {
  const { shipmentId, clientId } = useParams<{ shipmentId: string; clientId?: string }>();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const { data: shipment, isLoading } = useQuery<ShipmentResource | undefined>({
    queryKey: ["shipment", shipmentId],
    queryFn: () => {
      if (!shipmentId) {
        throw new Error("Missing required route parameters.");
      }
      return fetchShipment(shipmentId);
    },
    enabled: Boolean(shipmentId),
  });

  if (!shipmentId) {
    return (
      <PageCard title="Shipment Documents" fullHeight>
        <Text size="0.8rem" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  const documents =
    shipment?.documents && Array.isArray(shipment.documents)
      ? shipment.documents
      : [];

  const clientDocuments =
    shipment?.client_documents && Array.isArray(shipment.client_documents)
      ? shipment.client_documents
      : [];

  const quotationDocuments =
    shipment?.quotation_proposals && Array.isArray(shipment.quotation_proposals)
      ? shipment.quotation_proposals
      : [];

  const billingDocuments =
    shipment?.billing_documents && Array.isArray(shipment.billing_documents)
      ? shipment.billing_documents
      : [];

  const jltcbDocs = [...documents, ...quotationDocuments];
  const clientDocs = clientDocuments;
  const generalInfoPerson = shipment?.general_info?.person_in_charge;
  const assignedPerson =
    typeof generalInfoPerson === "object" && generalInfoPerson !== null
      ? (generalInfoPerson as { id?: number; role?: string })
      : undefined;

  const assignedUploadIds = {
    clientId,
    operationsId:
      assignedPerson?.role === ROLES.OPERATIONS
        ? assignedPerson.id?.toString()
        : undefined,
    accountHandlerId:
      assignedPerson?.role === ROLES.ACCOUNT_SPECIALIST
        ? assignedPerson.id?.toString()
        : undefined,
  };

  const canUploadDocuments = Boolean(
    currentUser &&
      canShowUploadButton(
        currentUser.role,
        "Documents",
        currentUser.id.toString(),
        assignedUploadIds,
      ),
  );

  const canUploadBilling = Boolean(
    currentUser &&
      canShowUploadButton(
        currentUser.role,
        "Billing",
        currentUser.id.toString(),
        assignedUploadIds,
      ),
  );

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !currentUser || !shipmentId) return;

    // Determine if user is Client or JLTCB Employee
    const uploadedBy = currentUser.role === ROLES.CLIENT ? "Client" : "JLTCB";

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadedBy", uploadedBy);

      try {
        await axios.post(`/api/shipments/${shipmentId}/documents`, formData);
      } catch (error) {
        notifications.show({
          title: "Upload Failed",
          message: `Failed to upload ${file.name}. Please try again.`,
          color: "red",
          autoClose: 5000,
        });
        console.error("Upload error:", error);
        return;
      }
    }

    queryClient.invalidateQueries({
      queryKey: ["shipment", shipmentId],
    });

    notifications.show({
      title: "Success",
      message: "Documents uploaded successfully.",
      color: "green",
      autoClose: 5000,
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Stack gap="lg">
      <Group align="center" gap="sm">
        <Button variant="subtle" p={0} onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowBack width="1.5rem" height="1.5rem" fill="currentColor" />
        </Button>
        <Text size="xl" fw={700}>
          SHIPMENT DOCUMENTS
        </Text>
      </Group>

      <PageCard title="" fullHeight hideBackButton onBack={() => navigate(-1)} bgColor="transparent" shadow={false}>
        {isLoading ? (
          <Text size="0.8rem" c="dimmed">
            Loading documents...
          </Text>
        ) : (
          <Box style={{ display: "flex", gap: "0.8rem", width: "100%", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <Paper
              withBorder
              radius="md"
              p="md"
              style={{ width: 750, minWidth: 750, minHeight: 750, backgroundColor: "white" }}
            >
              <Stack gap="lg">
                <Box>
                  <Group mb="xs" align="center">
                    <img src={docClientIcon} alt="Client documents" style={{ width: 24, height: 24 }} />
                    <Text fw={700} size="md">
                      DOCUMENTS UPLOADED BY CLIENT
                    </Text>
                  </Group>
                  {clientDocs.length > 0 ? (
                    <Stack gap="md">
                      {clientDocs.map((doc) => (
                        <DocumentDetailCard
                          key={doc.id}
                          doc={doc}
                          shipmentId={shipmentId}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box
                      style={{
                        padding: "0",
                        textAlign: "center",
                      }}
                    >
                      <Text fw={500} c="dimmed">
                        No client documents available
                      </Text>
                    </Box>
                  )}
                </Box>

                <Box>
                  <Group mb="xs" align="center">
                    <img src={docJLTCBIcon} alt="JLTCB documents" style={{ width: 24, height: 24 }} />
                    <Text fw={700} size="md">
                      DOCUMENTS UPLOADED BY JLTCB
                    </Text>
                  </Group>
                  {jltcbDocs.length > 0 ? (
                    <Stack gap="md">
                      {jltcbDocs.map((doc) => (
                        <DocumentDetailCard
                          key={doc.id}
                          doc={doc}
                          shipmentId={shipmentId}
                        />
                      ))}
                    </Stack>
                  ) : (
                    <Box
                      style={{
                        padding: "0",
                        textAlign: "center",
                      }}
                    >
                      <Text fw={500} c="dimmed">
                        No JLTCB documents available
                      </Text>
                    </Box>
                  )}
                </Box>

                {canUploadDocuments && (
                  <Button
                    fullWidth
                    mt="md"
                    bg="#4E6174"
                    c="white"
                    style={{ textTransform: "uppercase", fontWeight: 500 }}
                    leftSection={<AddCircle width={18} height={18} style={{ color: "#1C213B" }} />}
                    onClick={handleUploadClick}
                  >
                    Upload more documents
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleFileSelect}
                />
              </Stack>
            </Paper>

            <Paper
              withBorder
              radius="md"
              p="md"
              style={{ width: 750, minWidth: 750, minHeight: 822, backgroundColor: "white" }}
            >
              <Group mb="md" align="center">
                <img src={invoiceIcon} alt="Billing" style={{ width: 24, height: 24 }} />
                <Text fw={700} size="md">
                  BILLING, INVOICE & RECEIPT
                </Text>
              </Group>
              {billingDocuments.length > 0 ? (
                <Stack gap="md">
                  {billingDocuments.map((doc) => (
                    <DocumentDetailCard
                      key={doc.id}
                      doc={doc}
                      shipmentId={shipmentId}
                    />
                  ))}
                </Stack>
              ) : (
                <Box
                  style={{
                    padding: "0",
                    textAlign: "center",
                  }}
                >
                  <Text fw={500} c="dimmed">
                    No billing documents available
                  </Text>
                </Box>
              )}
              {canUploadBilling && (
                <Button
                  fullWidth
                  mt="md"
                  bg="#4E6174"
                  c="white"
                  style={{ textTransform: "uppercase", fontWeight: 500 }}
                  leftSection={<AddCircle width={18} height={18} style={{ color: "#1C213B" }} />}
                  onClick={handleUploadClick}
                >
                  Upload billing documents
                </Button>
              )}
            </Paper>
          </Box>
        )}
      </PageCard>
    </Stack>
  );
}

interface DocumentDetailCardProps {
  doc: {
    id: number;
    file_name: string;
    uploadedDate?: string;
    uploadedBy?: "JLTCB" | "Client";
    uploaded_by?: number;
    type?: string;
    file_url?: string;
    uploadedByUser?: string;
  };
  shipmentId?: string;
}

function DocumentDetailCard({ doc, shipmentId }: DocumentDetailCardProps) {
  const queryClient = useQueryClient();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(doc.file_name);

  const handleDownload = () => {
    if (doc.file_url) {
      const link = document.createElement("a");
      link.href = doc.file_url;
      link.download = doc.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (doc.file_url) {
      const printWindow = window.open(doc.file_url, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleRenameConfirm = async () => {
    if (!shipmentId || !newFileName.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Please enter a valid file name.",
        color: "yellow",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.put(`/api/shipments/${shipmentId}/documents/${doc.id}`, {
        file_name: newFileName,
      });

      queryClient.invalidateQueries({
        queryKey: ["shipment", shipmentId],
      });

      notifications.show({
        title: "Success",
        message: "Document renamed successfully.",
        color: "green",
        autoClose: 3000,
      });

      setRenameModalOpen(false);
    } catch (error) {
      notifications.show({
        title: "Rename Failed",
        message: "Failed to rename document. Please try again.",
        color: "red",
        autoClose: 5000,
      });
      console.error("Rename error:", error);
    }
  };

  return (
    <>
      <div
        className={styles.documentCard}
        onClick={() => {
          if (doc.file_url) {
            window.open(doc.file_url, '_blank');
          }
        }}
      >
        <DetailCard
          style={{ width: "100%" }}
          headerLeft={
            <Box style={{ width: 62, height: 62, minWidth: 62, minHeight: 62 }}>
              <PdfThumbnail url={doc.file_url ?? ""} />
            </Box>
          }
          title={doc.file_name}
        >
          <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

            <Box>
              {doc.uploadedDate && (
                <Text size="sm" c="dimmed">
                  {new Date(doc.uploadedDate).toLocaleDateString()} at {new Date(doc.uploadedDate).toLocaleTimeString()}
                </Text>
              )}
              <Text size="sm" c="dimmed">
                Uploaded by: {doc.uploadedByUser || doc.uploadedBy || (doc.uploaded_by ? `User ${doc.uploaded_by}` : doc.type ?? "Unknown")}
              </Text>
            </Box>

            <Menu position="bottom-end">
              <Menu.Target>
                <Button variant="subtle" p={0} onClick={(e) => e.stopPropagation()}>
                  <MoreVert />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item leftSection={<Download style={{ width: 16, height: 16 }} />} onClick={handleDownload}>
                  Download
                </Menu.Item>
                <Menu.Item leftSection={<Print style={{ width: 16, height: 16 }} />} onClick={handlePrint}>
                  Print
                </Menu.Item>
                <Menu.Item leftSection={<BorderColor style={{ width: 16, height: 16, color: "#1C213B" }} />} onClick={() => setRenameModalOpen(true)}>
                  Rename
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Box>
        </DetailCard>
      </div>

      <Modal opened={renameModalOpen} onClose={() => setRenameModalOpen(false)} title="Rename Document" centered>
        <Stack gap="md">
          <TextInput
            label="New file name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.currentTarget.value)}
            placeholder="Enter new file name"
          />
          <Group justify="flex-end">
            <Button variant="default" onClick={() => setRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm}>Rename</Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
