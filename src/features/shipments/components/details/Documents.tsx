import {
  Paper,
  Group,
  Text,
  Box as MantineBox,
  Button,
} from "@mantine/core";
import {
  ChevronRight,
  Download,
  Folder, // ✅ Material Symbols Outlined: folder
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useState, useMemo } from "react";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import docClientIcon from "@/assets/icons/docClient.svg";
import { useNavigate, useParams } from "react-router";
import { shipmentRoutes } from "@/features/shipments/utils/shipmentRoutes";
import type { ShipmentDocument } from "@/features/shipments/types/shipments.types";

interface DocumentsProps {
  documents?: ShipmentDocument[];
  expanded: boolean;
  onToggle: () => void;
}

export function Documents({
  documents = [],
  expanded,
  onToggle,
}: DocumentsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const { tab, clientId, shipmentId } = useParams<{
    tab: string;
    clientId: string;
    shipmentId: string;
  }>();

  // Normalize client documents with proper date and uploader mapping
  const clientDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const uploadedBy = (doc.uploadedBy || "Client").toUpperCase();
        return uploadedBy === "CLIENT";
      })
      .map((doc) => ({
        ...doc,
        uploadedDate: doc.uploadedDate || doc.created_at || new Date().toISOString(),
      }));
  }, [documents]);

  return (
    <MantineBox
      w="100%"
      onClick={onToggle}
      role="button"
      tabIndex={0}
      style={{ textAlign: "left", cursor: "pointer" }}
    >
      <Paper
        radius="md"
        p={0}
        style={{
          border: "1px solid var(--mantine-color-gray-2)",
          transition: "all 0.2s ease",
        }}
      >
        <MantineBox
          w="100%"
          bg="#D4DAE0"
          p="lg"
          style={{
            borderBottom: "1px solid var(--mantine-color-gray-2)",
            borderTopLeftRadius: "0.5rem",
            borderTopRightRadius: "0.5rem",
            ...(expanded
              ? {}
              : {
                  borderBottomLeftRadius: "0.5rem",
                  borderBottomRightRadius: "0.5rem",
                }),
          }}
        >
          <Group justify="space-between" align="center">
            <Group gap="sm">
              <MantineBox
                style={{
                  color: "#1D274E", // ✅ set folder icon color
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Folder width="26" height="26" />
              </MantineBox>
              <Text fw={500} tt="uppercase" c="jltBlue.8">
                Documents
              </Text>
            </Group>
            <ChevronRight
              width="1.5rem"
              height="1.5rem"
              style={{
                transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </Group>
        </MantineBox>

        {expanded && (
          <>
            <MantineBox p="lg" pb="sm">
              <h4
                style={{
                  marginBottom: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              >
                <img
                  src={docClientIcon}
                  alt="Client Documents"
                  style={{
                    marginRight: "0.5rem",
                    width: "1.2rem",
                    height: "1.2rem",
                  }}
                />
                DOCUMENTS UPLOADED BY CLIENT
              </h4>
              {clientDocuments.length === 0 ? (
                <Text c="dimmed" size="sm" pl="27px">
                  No documents uploaded by client
                </Text>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                  }}
                >
                  {clientDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "0.75rem",
                        padding: "0.75rem",
                        backgroundColor: "#fff",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                      }}
                    >
                      <div
                        style={{
                          width: 88,
                          height: 88,
                          minWidth: 88,
                          minHeight: 88,
                          borderRadius: "0.75rem",
                          overflow: "hidden",
                          backgroundColor: "var(--mantine-color-gray-2)",
                          flexShrink: 0,
                        }}
                      >
                        <PdfThumbnail url={doc.file_url ?? ""} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}
                        >
                          {doc.file_name}
                        </div>
                        <div style={{ color: "#6F7C8B", fontSize: "0.75rem" }}>
                          {doc.uploadedDate}
                        </div>
                        <div style={{ color: "#6F7C8B", fontSize: "0.75rem" }}>
                          Uploaded by: {doc.uploadedBy}
                        </div>
                      </div>
                      <Button
                        component="a"
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        p={0}
                        style={{
                          backgroundColor: "#4E6174",
                          borderRadius: "50%",
                          width: 32,
                          height: 32,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <Download
                          width="1rem"
                          height="1rem"
                          style={{ color: "white" }}
                        />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </MantineBox>
            <Button
              fullWidth
              mt="lg"
              mb={0}
              ml={0}
              mr={0}
              style={{
                backgroundColor: isHovered ? "#E8E8E8" : "transparent",
                borderTop: "2px solid #A3A3A3",
                borderRadius: 0,
                color: isHovered
                  ? "var(--mantine-color-jltBlue-8)"
                  : "#4E6174",
                textTransform: "uppercase",
                fontWeight: 500,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                if (!tab || !clientId || !shipmentId) return;
                navigate(
                  shipmentRoutes.documents({
                    tab,
                    clientId,
                    shipmentId,
                  })
                );
              }}
            >
              VIEW ALL DOCUMENTS
            </Button>
          </>
        )}
      </Paper>
    </MantineBox>
  );
}
