// src/features/accounts/components/companies/CompanyInformation/EditDocuments.tsx
import { useState, useEffect, useRef } from "react";
import { Paper, Text, Box, Button, Group, TextInput } from "@mantine/core";
import { Add, Delete, Save } from "@nine-thirty-five/material-symbols-react/outlined";
import { notifications } from "@mantine/notifications";
import styles from "../CompanyDetails/CompanyDetails.module.css";
import type {
  CompanyFullDetails,
  CompanyDocumentsAttachments,
  CompanyDocumentPayload,
  CompanyDocumentReplacePayload,
} from "@/features/accounts/types/company.types";

type DocumentItem = CompanyDocumentPayload;

type DocumentRenameItem = {
  id: number | string;
  new_name: string;
};

type DocumentReplaceItem = CompanyDocumentReplacePayload;

interface EditDocumentsProps {
  company: CompanyFullDetails | null;
  errors?: Record<string, string>;
  onChange?: (documentsAttachments: CompanyDocumentsAttachments) => void;
}

export function EditDocuments({ company, errors, onChange }: EditDocumentsProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [localErrors, setLocalErrors] = useState<Record<string, string>>(errors ?? {});

  useEffect(() => {
    setLocalErrors(errors ?? {});
  }, [errors]);

  const clearFieldError = (field: string) => {
    if (!localErrors[field]) {
      return;
    }
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const getDocumentRenameError = (index: number) => {
    return localErrors[`${index}.name`] ?? localErrors[`${index}.new_name`];
  };

  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [documentsToDelete, setDocumentsToDelete] = useState<Array<number | string>>([]);
  const [documentsToRename, setDocumentsToRename] = useState<DocumentRenameItem[]>([]);
  const [documentsToReplace, setDocumentsToReplace] = useState<DocumentReplaceItem[]>([]);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const originalDocumentNames = useRef<Record<string, string>>({});
  const replaceInputRef = useRef<HTMLInputElement | null>(null);

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
    setDocumentsToReplace(company?.documentsAttachments?.documentsToReplace ?? []);
  }, [company]);

  const emitChange = (
    nextDocuments: DocumentItem[],
    nextDocumentsToDelete: Array<number | string> = documentsToDelete,
    nextDocumentsToRename: DocumentRenameItem[] = documentsToRename,
    nextDocumentsToReplace: DocumentReplaceItem[] = documentsToReplace,
  ) => {
    onChange?.({
      documents: nextDocuments,
      attachments: company?.documentsAttachments?.attachments ?? [],
      documentsToDelete: nextDocumentsToDelete,
      documentsToRename: nextDocumentsToRename,
      documentsToReplace: nextDocumentsToReplace,
    });
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) {
      return;
    }

    const existingNames = new Set(
      documents
        .map((doc) => doc.name?.trim().toLowerCase())
        .filter((name): name is string => Boolean(name)),
    );

    const nextDocuments = [...documents];
    let addedCount = 0;

    Array.from(files).forEach((file) => {
      const fileName = file.name.trim();
      const normalizedName = fileName.toLowerCase();

      if (existingNames.has(normalizedName)) {
        notifications.show({
          title: "Duplicate document name",
          message: `A document named "${fileName}" already exists.`,
          color: "red",
          autoClose: 3000,
        });
        return;
      }

      existingNames.add(normalizedName);
      nextDocuments.push({ name: fileName, file });
      addedCount += 1;
    });

    if (addedCount === 0) {
      return;
    }

    setDocuments(nextDocuments);
    emitChange(nextDocuments);
    notifications.show({
      title: `Added ${addedCount} file${addedCount === 1 ? "" : "s"}`,
      message: `${addedCount} document(s) are ready to save`,
      color: "green",
      autoClose: 2500,
    });
  };

  const handleRename = (index: number, name: string) => {
    const normalizedName = name.trim().toLowerCase();
    const otherDocumentNames = documents
      .filter((_, idx) => idx !== index)
      .map((doc) => doc.name?.trim().toLowerCase())
      .filter((docName): docName is string => Boolean(docName));
    clearFieldError(`${index}.name`);

    const existingAttachmentNames = (company?.documentsAttachments?.attachments ?? [])
      .map((doc) => doc.name?.trim().toLowerCase())
      .filter((docName): docName is string => Boolean(docName));

    if (normalizedName && [...otherDocumentNames, ...existingAttachmentNames].includes(normalizedName)) {
      notifications.show({
        title: "Duplicate document name",
        message: `A document named "${name.trim()}" already exists. Please choose a different name.`,
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    const nextDocuments = documents.map((doc, idx) =>
      idx === index ? { ...doc, name } : doc
    );
    setDocuments(nextDocuments);

    clearFieldError(`${index}.name`);
    clearFieldError(`${index}.new_name`);

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
    emitChange(nextDocuments, undefined, nextDocumentsToRename, undefined);
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
    const nextDocumentsToReplace = removedDocument?.id != null
      ? documentsToReplace.filter((replace) => String(replace.id) !== String(removedDocument.id))
      : documentsToReplace;

    setDocuments(nextDocuments);
    setDocumentsToDelete(nextDocumentsToDelete);
    setDocumentsToRename(nextDocumentsToRename);
    setDocumentsToReplace(nextDocumentsToReplace);
    emitChange(nextDocuments, nextDocumentsToDelete, nextDocumentsToRename, nextDocumentsToReplace);
    notifications.show({
      title: "Document removed",
      message: "The selected document was removed.",
      color: "yellow",
      autoClose: 2500,
    });
  };

  const handleReplaceFile = (index: number, file: File) => {
    const existing = documents[index];
    if (!existing?.id) {
      notifications.show({
        title: "Cannot replace this document",
        message: "Only existing documents can be replaced.",
        color: "red",
        autoClose: 3000,
      });
      return;
    }

    const nextDocumentsToReplace = [...documentsToReplace];
    const currentIndex = nextDocumentsToReplace.findIndex(
      (replace) => String(replace.id) === String(existing.id),
    );

    if (currentIndex > -1) {
      nextDocumentsToReplace[currentIndex] = { id: existing.id, file };
    } else {
      nextDocumentsToReplace.push({ id: existing.id, file });
    }

    setDocumentsToReplace(nextDocumentsToReplace);
    emitChange(documents, undefined, undefined, nextDocumentsToReplace);
    notifications.show({
      title: "Document replacement set",
      message: `Replacement file selected for ${existing.name}.`,
      color: "green",
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
      <input
        type="file"
        hidden
        ref={replaceInputRef}
        onChange={(event) => {
          const file = event.target.files?.[0] ?? null;
          if (file && replaceIndex != null) {
            handleReplaceFile(replaceIndex, file);
          }
          setReplaceIndex(null);
          if (replaceInputRef.current) {
            replaceInputRef.current.value = "";
          }
        }}
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
                    error={getDocumentRenameError(index)}
                    classNames={{
                      input: getDocumentRenameError(index) ? styles.textInputError : undefined,
                      error: styles.errorMessage,
                    }}
                    rightSection={<Save width={20} height={20} style={{ color: "#4E6174", cursor: "pointer" }} />}
                  />
                </Box>
                {doc.id != null ? (
                  <>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        setReplaceIndex(index);
                        replaceInputRef.current?.click();
                      }}
                    >
                      {documentsToReplace.some((replace) => String(replace.id) === String(doc.id))
                        ? "Change replacement"
                        : "Replace"}
                    </Button>
                    {documentsToReplace.some((replace) => String(replace.id) === String(doc.id)) ? (
                      <Text size="xs" c="dimmed">
                        Replacement file selected
                      </Text>
                    ) : null}
                  </>
                ) : null}
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
