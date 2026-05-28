// src/features/accounts/components/companies/CompanyInformation/EditDocuments.tsx
import { useState, useEffect, useRef } from "react";
import { Paper, Text, Box, Button, Group, TextInput } from "@mantine/core";
import { Add, Delete, Save } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import type {
  CompanyFullDetails,
  CompanyDocumentsAttachments,
} from "@/features/accounts/types/company.types";

type DocumentItem = {
  name: string;
  url?: string | null;
  file?: File;
};

interface EditDocumentsProps {
  company: CompanyFullDetails | null;
  onChange?: (documentsAttachments: CompanyDocumentsAttachments) => void;
}

export function EditDocuments({ company, onChange }: EditDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDocuments(company?.documentsAttachments?.documents ?? []);
  }, [company]);

  const emitChange = (nextDocuments: Array<{ name: string; url?: string | null }>) => {
    onChange?.({
      documents: nextDocuments,
      attachments: company?.documentsAttachments?.attachments ?? [],
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const nextDocuments = [
      ...documents,
      ...Array.from(files).map((file) => ({ name: file.name, file })),
    ];
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
    notifications.show({
      title: `Added ${files.length} file${files.length === 1 ? "" : "s"}`,
      message: `${files.length} document(s) are ready to save`,
      color: "green",
      autoClose: 2500,
    });
  };

  const handleRename = (index: number, name: string) => {
    const nextDocuments = documents.map((doc, idx) =>
      idx === index ? { ...doc, name } : doc
    );
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
  };

  const handleRemove = (index: number) => {
    const nextDocuments = documents.filter((_, idx) => idx !== index);
    setDocuments(nextDocuments);
    emitChange(nextDocuments);
    notifications.show({
      title: "Document removed",
      message: "The selected document was removed.",
      color: "yellow",
      autoClose: 2500,
    });
  };

  return (
    <Paper p="lg">
      <Text size="sm" fw={600} mb="xs">Upload Documents & Attachments</Text>
      <Text size="sm" c="dimmed" mb="md">
        Upload documents and attachments for the company.
      </Text>

      <input
        type="file"
        hidden
        multiple
        ref={fileInputRef}
        onChange={(event) => handleFileSelect(event.target.files)}
      />

      <Box
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <Add width={40} height={40} style={{ color: "#4E6174" }} />
        <Text size="sm" mt="sm">Drag and drop files here</Text>
        <Text size="xs" c="dimmed">or</Text>
        <Box mt="sm">
          <Button
            variant="outline"
            radius="md"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Files
          </Button>
        </Box>
      </Box>

      <Box mt="lg">
        <Group gap="xs" mb="sm">
          <Text size="sm" fw={600}>Uploaded Documents</Text>
          <Box
            style={{
              backgroundColor: "#D0E5FF",
              color: "#0064E0",
              borderRadius: "12px",
              padding: "0 8px",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {documents.length}
          </Box>
        </Group>

        {documents.length === 0 ? (
          <Text size="sm" c="dimmed">No documents uploaded yet</Text>
        ) : (
          documents.map((doc, index) => (
            <Paper
              key={`${doc.name}-${index}`}
              shadow="xs"
              radius="md"
              p="sm"
              style={{
                marginBottom: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text size="sm">{doc.name}</Text>
              <Group gap="md" align="center">
                <Box style={{ display: "flex", alignItems: "center" }}>
                  <Text size="xs" mr="xs">Rename</Text>
                  <TextInput
                    placeholder="Enter new name"
                    size="xs"
                    style={{ width: "150px" }}
                    value={doc.name}
                    onChange={(event) => handleRename(index, event.currentTarget.value)}
                    rightSection={<Save width={20} height={20} style={{ color: "#4E6174", cursor: "pointer" }} />}
                  />
                </Box>
                <Delete
                  width={24}
                  height={24}
                  style={{ color: "#FF0000", cursor: "pointer" }}
                  onClick={() => handleRemove(index)}
                />
              </Group>
            </Paper>
          ))
        )}
      </Box>
    </Paper>
  );
}
