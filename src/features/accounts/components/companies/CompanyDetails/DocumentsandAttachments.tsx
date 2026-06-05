import { useState } from "react";
import { Box, Text, Divider, Button, Group, Stack } from "@mantine/core";
import { Edit, Upload } from "@nine-thirty-five/material-symbols-react/outlined";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import styles from "./CompanyDetails.module.css";

interface DocumentsandAttachmentsProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

export function DocumentsandAttachments({ company, onEdit }: DocumentsandAttachmentsProps) {
  type DisplayDoc = {
    name?: string;
    url?: string | null;
    type?: string;
    title?: string;
    file_name?: string;
    file_type?: string;
    created_at?: string;
  };

  const [files, setFiles] = useState<File[]>([]);
  const existingRaw: unknown = company?.documentsAttachments ?? {};

  // Normalize backend shapes:
  // - Server may return an array of files (as in the sample payload)
  // - Or an object with `documents` / `attachments` arrays
  let existingDocs: DisplayDoc[] = [];
  let existingAtt: DisplayDoc[] = [];

  if (Array.isArray(existingRaw)) {
    existingDocs = existingRaw.map((f) => ({
      name: (f as Record<string, unknown>).file_name as string | undefined ?? (f as Record<string, unknown>).name as string | undefined,
      url: (f as Record<string, unknown>).file_url as string | undefined ?? (f as Record<string, unknown>).url as string | undefined,
      type: (f as Record<string, unknown>).file_type as string | undefined ?? (f as Record<string, unknown>).type as string | undefined,
      created_at: (f as Record<string, unknown>).created_at as string | undefined,
    }));
  } else {
    existingDocs = ((existingRaw as { documents?: DisplayDoc[] }).documents) ?? [];
    existingAtt = ((existingRaw as { attachments?: DisplayDoc[] }).attachments) ?? [];
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.documentsBox}>
        {/* Label with dynamic count */}
        <Text c="#7a808a" fz="0.75rem">
          Uploaded Documents & Attachments ({existingDocs.length + existingAtt.length + files.length})
        </Text>

        {/* Existing uploaded files list (render as detail cards similar to shipments) */}
        {(existingDocs.length > 0 || existingAtt.length > 0) && (
          <Stack gap="xs" mt="sm" mb="sm">
            {[...existingDocs, ...existingAtt].slice(0, 2).map((doc, idx) => (
              <Box
                key={`doc-card-${idx}`}
                p="xs"
                className={styles.documentCard}
                onClick={() => {
                  if (doc.url) window.open(doc.url, "_blank");
                }}
                style={{
                  border: "1px solid var(--mantine-color-gray-2)",
                  borderRadius: "0.375rem",
                  backgroundColor: "white",
                  cursor: doc.url ? "pointer" : "default",
                }}
              >
                <Group align="center" gap="sm">
                  <Box
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
                  </Box>
                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={700} size="sm" c="gray.8" lineClamp={2}>
                      {doc.name ?? doc.title ?? doc.file_name}
                    </Text>
                    <Text c="gray.5" size="xs" mt={4}>
                      {doc.type ?? doc.file_type ?? "JLTCB"}
                    </Text>
                  </Box>
                </Group>
              </Box>
            ))}
          </Stack>
        )}

        {/* Uploaded files (new, local) */}
        {files.length > 0 && (
          <Box mt="sm" mb="sm">
            {files.map((file, idx) => (
              <Text key={`new-${idx}`} size="xs" c="#4f657d">
                • {file.name}
              </Text>
            ))}
          </Box>
        )}

        {/* Upload box */}
        <Box className={styles.uploadZone}>
          <Upload width={36} height={36} style={{ color: "#4f657d" }} />
          <Text mt="xs" c="#7a808a" fz="sm">
            Drag and drop files here
          </Text>

          {/* Choose Files button */}
          <Button
            variant="outline"
            radius="md"
            size="sm"
            mt="sm"
            fullWidth
            className={styles.uploadButton}
            leftSection={<Edit width={18} height={18} style={{ color: "#0064E0" }} />}
            component="label"
          >
            Choose Files
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>
        </Box>

        <Divider mt="xs" />

        {/* Existing edit button */}
        <Group className={styles.actions} style={{ justifyContent: "center" }}>
          <Button
            variant="outline"
            radius="md"
            size="xs"
            className={styles.editButton}
            leftSection={<Edit width={24} height={24} style={{ color: "#0064E0" }} />}
            onClick={onEdit}
          >
            EDIT DOCUMENTS & ATTACHMENTS
          </Button>
        </Group>
      </Box>
    </Box>
  );
}
