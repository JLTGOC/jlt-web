// src/features/accounts/components/companies/CompanyInformation/EditDocuments.tsx
import { useState, useEffect, useRef } from "react";
import { Paper, Text, Box, Button, Group, TextInput } from "@mantine/core";
import { Add, Delete, Save } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import type {
  CompanyFullDetails,
  CompanyDocumentsAttachments,
  CompanyDocumentPayload,
} from "@/features/accounts/types/company.types";

type DocumentItem = CompanyDocumentPayload;

type DocumentRenameItem = {
  id: number | string;
  new_name: string;
};

interface EditDocumentsProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (documentsAttachments: CompanyDocumentsAttachments) => void;
}

export function EditDocuments({ company, onChange }: EditDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<Array<number | string>>([]);
  const [documentsToRename, setDocumentsToRename] = useState<DocumentRenameItem[]>([]);
  const originalDocumentNames = useRef<Record<string, string>>({});

  useEffect(() => {
    const currentDocuments = company?.documentsAttachments?.documents ?? [];
    const currentRenames = company?.documentsAttachments?.documentsToRename ?? [];

    originalDocumentNames.current = currentDocuments.reduce((acc, doc) => {
      if (doc?.id != null) {
        acc[String(doc.id)] = doc.name;
      }
      return acc;
    }, {} as Record<string, string>);

    setDocuments(currentDocuments);
    setDocumentsToDelete(company?.documentsAttachments?.documentsToDelete ?? []);
    setDocumentsToRename(currentRenames);
  }, [company]);

  const emitChange = (
    nextDocuments: DocumentItem[],
    nextDocumentsToDelete: Array<number | string> = documentsToDelete,
    nextDocumentsToRename: DocumentRenameItem[] = documentsToRename,
  ) => {
    onChange?.({
      documents: nextDocuments,
      attachments: company?.documentsAttachments?.attachments ?? [],
      documentsToDelete: nextDocumentsToDelete,
      documentsToRename: nextDocumentsToRename,
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

    const doc = documents[index];
    let nextDocumentsToRename = [...documentsToRename];
    if (doc?.id != null) {
      const originalName = originalDocumentNames.current[String(doc.id)] ?? "";
      const renameEntry = { id: doc.id, new_name: name };
      const existingIndex = nextDocumentsToRename.findIndex((item) => String(item.id) === String(doc.id));

      if (name.trim() && name !== originalName) {
        if (existingIndex > -1) {
          nextDocumentsToRename[existingIndex] = renameEntry;
        } else {
          nextDocumentsToRename.push(renameEntry);
        }
      } else if (existingIndex > -1) {
        nextDocumentsToRename.splice(existingIndex, 1);
      }
    }

    setDocumentsToRename(nextDocumentsToRename);
    emitChange(nextDocuments, undefined, nextDocumentsToRename);
  };

  const handleRemove = (index: number) => {
    const removedDocument = documents[index];
    const nextDocuments = documents.filter((_, idx) => idx !== index);
    const nextDocumentsToDelete = removedDocument?.id != null
      ? [...documentsToDelete, removedDocument.id]
      : documentsToDelete;
    const nextDocumentsToRename = removedDocument?.id != null
      ? documentsToRename.filter((rename) => String(rename.id) !== String(removedDocument.id))
      : documentsToRename;

    setDocuments(nextDocuments);
    setDocumentsToDelete(nextDocumentsToDelete);
    setDocumentsToRename(nextDocumentsToRename);
    emitChange(nextDocuments, nextDocumentsToDelete, nextDocumentsToRename);
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
