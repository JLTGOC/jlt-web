import { ActionIcon, Checkbox, Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { Description, Visibility } from "@nine-thirty-five/material-symbols-react/outlined";
import { Close } from "@nine-thirty-five/material-symbols-react/rounded";
import { useState } from "react";
import { AppButton } from "@/components/ui/AppButton";
import { useMakeQuotationEnums } from "@/features/quotations/hooks/useMakeQuotationEnums";
import { useMakeQuotationContext } from "../MakeQuotationContext";

const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

function formatFileSize(file: File) {
  if (file.size < 1024 * 1024) return `${Math.max(1, Math.round(file.size / 1024))} KB`;
  return `${(file.size / 1024 / 1024).toFixed(1)} MB`;
}

function FilePill({ file, onPreview, onRemove }: { file: File; onPreview: () => void; onRemove: () => void }) {
  return (
    <Group justify="space-between" gap="xs" p="xs" style={{ border: "1px solid #e0e5eb", borderRadius: "0.5rem" }}>
      <Text size="sm" lineClamp={1}>{file.name} | {formatFileSize(file)}</Text>
      <Group gap={4}>
        <ActionIcon variant="subtle" onClick={onPreview} aria-label={`Preview ${file.name}`}><Visibility width={18} height={18} /></ActionIcon>
        <ActionIcon variant="subtle" color="red" onClick={onRemove} aria-label={`Remove ${file.name}`}><Close width={18} height={18} /></ActionIcon>
      </Group>
    </Group>
  );
}

function UploadDropzone({ disabled, onDrop }: { disabled?: boolean; onDrop: (files: File[]) => void }) {
  return (
    <Dropzone disabled={disabled} onDrop={onDrop} accept={ACCEPTED_MIME_TYPES} multiple={false} p="md" radius="md" style={{ opacity: disabled ? 0.45 : 1 }}>
      <Text size="sm" ta="center">Drag and drop files here or click to upload</Text>
    </Dropzone>
  );
}

export function DocumentChecklistStep() {
  const { state, actions } = useMakeQuotationContext();
  const { data } = useMakeQuotationEnums({ service: state.clientInfo?.services });
  const [checklistChecked, setChecklistChecked] = useState<Record<string, boolean>>({});
  const [checklistFiles, setChecklistFiles] = useState<Record<string, File>>({});
  const [otherFiles, setOtherFiles] = useState<File[]>([]);
  const checklist = data?.document_checklist ?? [];

  function previewFile(file: File) {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank", "noopener,noreferrer");
    window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
  }

  function clearChecklistFile(label: string) {
    setChecklistFiles((current) => {
      const next = { ...current };
      delete next[label];
      return next;
    });
    setChecklistChecked((current) => ({ ...current, [label]: false }));
  }

  return (
    <Stack gap="md">
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper withBorder radius="md" p="lg">
          <Stack gap="md">
            <div><Text fw={800}>DOCUMENTS CHECKLIST</Text><Text size="sm" c="dimmed">Upload the required documents below. You can add other supporting files if needed.</Text></div>
            {checklist.length === 0 && <Text size="sm" c="dimmed">No checklist documents are required for this service.</Text>}
            {checklist.map((item) => {
              const checked = checklistChecked[item] ?? false;
              const file = checklistFiles[item];
              return (
                <Paper key={item} withBorder p="sm" radius="md">
                  <Stack gap="xs">
                    <Checkbox label={item} checked={checked} onChange={(event) => setChecklistChecked((current) => ({ ...current, [item]: event.currentTarget.checked }))} />
                    {file ? <FilePill file={file} onPreview={() => previewFile(file)} onRemove={() => clearChecklistFile(item)} /> : <UploadDropzone disabled={!checked} onDrop={(files) => setChecklistFiles((current) => ({ ...current, [item]: files[0] }))} />}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        </Paper>

        <Paper withBorder radius="md" p="lg">
          <Stack gap="md">
            <div><Text fw={800}>OTHER FILES (SUPPORTING DOCUMENTS)</Text><Text size="sm" c="dimmed">Upload any additional files that may support your quotation.</Text></div>
            <Dropzone onDrop={(files) => setOtherFiles((current) => [...current, ...files])} accept={ACCEPTED_MIME_TYPES} multiple p="lg" radius="md">
              <Text size="sm" ta="center">Drag and drop files here or click to upload</Text>
            </Dropzone>
            {otherFiles.map((file, index) => (
              <FilePill key={`${file.name}-${file.size}-${index}`} file={file} onPreview={() => previewFile(file)} onRemove={() => setOtherFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} />
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>
      <Group justify="flex-end"><AppButton variant="primary" icon={Description} loading={state.isCreatingQuotation} disabled={state.isCreatingQuotation} onClick={() => actions.submitDocuments({ checklistFiles, otherFiles })}>MAKE QUOTATION</AppButton></Group>
    </Stack>
  );
}
