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
  const [files, setFiles] = useState<File[]>([]);
  const existingRaw = company?.documentsAttachments ?? {};

  // Normalize backend shapes:
  // - Server may return an array of files (as in the sample payload)
  // - Or an object with `documents` / `attachments` arrays
  let existingDocs: Array<any> = [];
  let existingAtt: Array<any> = [];

  if (Array.isArray(existingRaw)) {
    existingDocs = existingRaw.map((f: any) => ({
      name: f.file_name ?? f.name,
      url: f.file_url ?? f.url,
      type: f.file_type ?? f.type,
      created_at: f.created_at,
    }));
  } else {
    existingDocs = (existingRaw.documents as any[]) ?? [];
    existingAtt = (existingRaw.attachments as any[]) ?? [];
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  return (
    <Box className={styles.container}>
      <Box>
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
        <Box
          mt="sm"
          p="lg"
          bg="#f1f3f5"
          style={{
            border: "2px dashed #adb5bd",
            borderRadius: "8px",
            textAlign: "center",
            width: "100%",
            maxWidth: "420px",
            margin: "0 auto",
          }}
        >
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
            className={styles.editButtonUpload}
            leftSection={<Edit width={18} height={18} style={{ color: "#0064E0" }} />}
            component="label"
          >
            Choose Files
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>
        </Box>

        <Divider mt="xs" />
      </Box>

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
  );
}
