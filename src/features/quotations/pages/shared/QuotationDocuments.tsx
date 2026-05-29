import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Stack, Text, Box, Button, Menu, Group, Modal, TextInput } from "@mantine/core";
import { MoreVert, Download, Print, AddCircle, EditDocument } from "@nine-thirty-five/material-symbols-react/outlined";
import { ArrowBack, PictureAsPdf } from "@nine-thirty-five/material-symbols-react/rounded";
import { useState, useRef } from "react";
import { useNavigate } from "react-router"; 
import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";
import { ROLES } from "@/types/roles";
import { PageCard } from "@/components/PageCard";
import { DetailCard } from "@/components/DetailCard";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import { toClientFileUrl } from "@/utils/file-url";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import type { QuotationDocument } from "@/features/quotations/types/quotations.types";
import styles from "@/features/shipments/components/details/Documents.module.css";

import docClientIcon from "@/assets/icons/docClient.svg";
import docJLTCBIcon from "@/assets/icons/docJLTCB.svg";

export function QuotationDocuments() {
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const queryClient = useQueryClient();
  const quotationId = routeParams?.quotationId;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  const { data: quotation, isLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(quotationId),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }
      return fetchQuotation(routeParams.quotationId);
    },
    enabled: Boolean(routeParams),
  });

  if (!routeParams) {
    return (
      <PageCard title="Client Documents" fullHeight>
        <Text size="0.8rem" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  const documents =
    quotation?.documents && quotation.documents !== "No documents available."
      ? quotation.documents
      : [];
  const quotationFiles =
    quotation?.quotation_file && quotation.quotation_file !== "No file available."
      ? quotation.quotation_file
      : [];

  const jltcbDocs = [
    ...quotationFiles,
    ...documents.filter((doc) => doc.uploadedBy === "JLTCB"),
  ];
  const clientDocs = documents.filter((doc) => doc.uploadedBy === "Client");
  const hasDocuments = jltcbDocs.length > 0 || clientDocs.length > 0;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !currentUser) return;

    // Determine if user is Client or JLTCB Employee
    const uploadedBy = currentUser.role === ROLES.CLIENT ? "Client" : "JLTCB";

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("uploadedBy", uploadedBy);

      try {
        await axios.post(`/api/quotations/${quotationId}/documents`, formData);
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
      queryKey: quotationQueryKeys.quotationDetails(quotationId),
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
          CLIENT DOCUMENTS
        </Text>
      </Group>

      <PageCard title="" fullHeight hideBackButton onBack={() => navigate(-1)}>
        {isLoading ? (
          <Text size="0.8rem" c="dimmed">
            Loading documents...
          </Text>
        ) : !hasDocuments ? (
          <Text size="0.8rem" c="dimmed">
            No documents available.
          </Text>
        ) : (
          <Stack gap="lg">
            {/* JLTCB documents */}
            {jltcbDocs.length > 0 && (
              <Box>
                <Group mb="md" style={{marginTop: 0}}>
                  <img src={docJLTCBIcon} alt="JLTCB" style={{ width: 24, height: 24, marginTop: 0 }} />
                  <Text fw={600}>Documents uploaded by JLTCB</Text>
                </Group>
                <Stack gap="md">
                  {jltcbDocs.map((doc) => (
                    <DocumentDetailCard key={doc.id} doc={doc} quotationId={quotationId} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Client documents */}
            {clientDocs.length > 0 && (
              <Box>
                <Group mb="md">
                  <img src={docClientIcon} alt="Client" style={{ width: 24, height: 24 }} />
                  <Text fw={600}>Documents uploaded by Client</Text>
                </Group>
                <Stack gap="md">
                  {clientDocs.map((doc) => (
                    <DocumentDetailCard key={doc.id} doc={doc} quotationId={quotationId} />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Upload more documents button */}
            <Button
              fullWidth
              mt="md"
              bg="#4E6174"
              c="white"
              style={{ textTransform: "uppercase", fontWeight: 500 }}
              leftSection={<AddCircle width={18} height={18} />}
              onClick={handleUploadClick}
            >
              Upload more documents
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileSelect}
            />
          </Stack>
        )}
      </PageCard>
    </Stack>
  );
}

interface DocumentDetailCardProps {
  doc: QuotationDocument;
  quotationId?: string;
}

function DocumentDetailCard({ doc, quotationId }: DocumentDetailCardProps) {
  const queryClient = useQueryClient();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState(doc.file_name);

  const fileUrl = doc.file_url ? toClientFileUrl(doc.file_url) : "";
  const isPdf = fileUrl && doc.file_name.toLowerCase().endsWith(".pdf");

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = doc.file_name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (fileUrl) {
      const printWindow = window.open(fileUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  const handleRenameConfirm = async () => {
    if (!quotationId || !newFileName.trim()) {
      notifications.show({
        title: "Validation Error",
        message: "Please enter a valid file name.",
        color: "yellow",
        autoClose: 3000,
      });
      return;
    }

    try {
      await axios.put(`/api/quotations/${quotationId}/documents/${doc.id}`, {
        file_name: newFileName,
      });

      queryClient.invalidateQueries({
        queryKey: quotationQueryKeys.quotationDetails(quotationId),
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
          if (fileUrl) {
            window.open(fileUrl, '_blank');
          }
        }}
        style={{ width: "100%", minHeight: 90, padding: "0.5rem 0.75rem", fontSize: "0.85rem" }}
      >
        <DetailCard
          style={{ width: "100%" }}
          headerLeft={
            isPdf && fileUrl ? (
              <Box style={{ width: 60, height: 80, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PdfThumbnail url={fileUrl} />
              </Box>
            ) : (
              <PictureAsPdf width={32} height={32} style={{ color: "var(--mantine-color-red-6)" }} />
            )
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
                Uploaded by: {doc.uploadedByUser || doc.uploadedBy || "Unknown"}
              </Text>
            </Box>

            <Menu position="bottom-end">
              <Menu.Target>
                <Button variant="subtle" p={0} onClick={(e) => e.stopPropagation()}>
                  <MoreVert />
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<Download style={{ width: 16, height: 16 }} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload();
                  }}
                >
                  Download
                </Menu.Item>
                <Menu.Item leftSection={<Print style={{ width: 16, height: 16 }} />} onClick={handlePrint}>
                  Print
                </Menu.Item>
                <Menu.Item leftSection={<EditDocument width={16} height={16} />} onClick={() => setRenameModalOpen(true)}>
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
