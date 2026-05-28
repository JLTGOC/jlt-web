import { useState } from "react";
import { Box, Text, Divider, Button, Group } from "@mantine/core";
import { Edit, Upload } from "@nine-thirty-five/material-symbols-react/outlined";
import styles from "./CompanyDetails.module.css";

interface DocumentsandAttachmentsProps {
  company?: import("../../../types/company.types").CompanyFullDetails | null;
  onEdit?: () => void;
}

export function DocumentsandAttachments({ company, onEdit }: DocumentsandAttachmentsProps) {
  const [files, setFiles] = useState<File[]>([]);
  const existing = company?.documentsAttachments ?? {};
  const existingDocs = existing.documents ?? [];
  const existingAtt = existing.attachments ?? [];

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

        {/* Existing uploaded files list */}
        {(existingDocs.length > 0 || existingAtt.length > 0) && (
          <Box mt="sm" mb="sm">
            {existingDocs.map((doc, idx) => (
              <Text key={`doc-${idx}`} size="xs" c="#4f657d">
                • {doc.name}
              </Text>
            ))}
            {existingAtt.map((att, idx) => (
              <Text key={`att-${idx}`} size="xs" c="#4f657d">
                • {att.name}
              </Text>
            ))}
          </Box>
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
