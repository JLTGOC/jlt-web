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
  Folder,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useState, useMemo } from "react";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import docClientIcon from "@/assets/icons/docClient.svg";
import { useNavigate, useParams } from "react-router";
import { shipmentRoutes } from "@/features/shipments/utils/shipmentRoutes";
import type { ShipmentDocument } from "@/features/shipments/types/shipments.types";
import styles from "./Documents.module.css";

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
                  color: "#1D274E",
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
                      className={styles.documentCard}
                      onClick={() => {
                        if (doc.file_url) {
                          window.open(doc.file_url, '_blank');
                        }
                      }}
                    >
                      <div className={styles.documentThumbnail}>
                        <PdfThumbnail url={doc.file_url ?? ""} />
                      </div>
                      <div className={styles.documentContent}>
                        <div className={styles.documentFileName}>
                          {doc.file_name}
                        </div>
                        <div className={styles.documentMeta}>
                          {doc.uploadedDate}
                        </div>
                        <div className={styles.documentMeta}>
                          Uploaded by: {doc.uploadedBy}
                        </div>
                      </div>
                      <Button
                        p={0}
                        className={styles.documentDownloadButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (doc.file_url) {
                            const link = document.createElement('a');
                            link.href = doc.file_url;
                            link.download = doc.file_name;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }
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
