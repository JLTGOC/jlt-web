import {
  Anchor,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { Link } from "react-router";
import { Download } from "@nine-thirty-five/material-symbols-react/outlined";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import { toClientFileUrl } from "@/utils/file-url";
import { useSecureFileUrl } from "@/hooks/useSecureFileUrl";
import docClientIcon from "@/assets/icons/docClient.svg";
import docJLTCBIcon from "@/assets/icons/docJLTCB.svg";
import { jobOrderRoutes } from "../utils/jobOrderRoutes";
import type { JobOrderDetail, JobOrderDocument } from "../types/jobOrderDetail";

type JobOrderDocumentsSectionProps = {
  detail: JobOrderDetail;
  previewLimit?: number;
  showViewAllDocuments?: boolean;
};

const em = "—";

function formatDate(value?: string | null) {
  if (!value) return em;

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function normalizeUploadedBy(document: JobOrderDocument) {
  if (document.uploadedBy === "Client" || document.uploadedBy === "JLTCB") {
    return document.uploadedBy;
  }

  const source =
    `${document.uploadedBy ?? ""} ${document.uploadedByUser ?? ""}`.toLowerCase();
  return source.includes("client") ? "Client" : "JLTCB";
}

function getDocumentDate(document: JobOrderDocument) {
  return (
    document.uploadedDate ?? document.created_at ?? document.updated_at ?? null
  );
}

function DocumentCard({ document }: { document: JobOrderDocument }) {
  const fileUrl = document.file_url ? toClientFileUrl(document.file_url) : "";
  const { objectUrl, loading: secureLoading } = useSecureFileUrl(fileUrl);

  return (
    <Paper
      withBorder
      radius="md"
      p="sm"
      style={{
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        backgroundColor: "#fff",
      }}
    >
      <Group align="center" wrap="nowrap" gap="sm">
        <Box
          style={{
            width: 56,
            height: 72,
            minWidth: 56,
            borderRadius: "0.5rem",
            overflow: "hidden",
            backgroundColor: "var(--mantine-color-gray-1)",
          }}
        >
          {fileUrl ? (
            secureLoading ? (
              <Box
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text size="xs" c="dimmed" tt="uppercase">
                  PDF
                </Text>
              </Box>
            ) : (
              <PdfThumbnail url={objectUrl ?? fileUrl} />
            )
          ) : (
            <Box
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text size="xs" c="dimmed" tt="uppercase">
                PDF
              </Text>
            </Box>
          )}
        </Box>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={600} lineClamp={1}>
            {document.file_name}
          </Text>
          <Text size="xs" c="dimmed">
            {formatDate(getDocumentDate(document))}
          </Text>
          <Text size="xs" c="dimmed" lineClamp={1}>
            Uploaded by: {normalizeUploadedBy(document)}
          </Text>
        </Box>

        {fileUrl && (
          <Button
            component="a"
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            p={0}
            style={{
              backgroundColor: "#4E6174",
              borderRadius: "0.5rem",
              width: 32,
              height: 32,
              minWidth: 32,
            }}
          >
            <Download width={16} height={16} />
          </Button>
        )}
      </Group>
    </Paper>
  );
}

function DocumentGroup({
  title,
  icon,
  documents,
}: {
  title: string;
  icon: string;
  documents: JobOrderDocument[];
}) {
  return (
    <Stack gap="sm">
      <Group gap="sm" align="center">
        <img src={icon} alt={title} style={{ width: 24, height: 24 }} />
        <Text
          fw={700}
          size="sm"
          tt="uppercase"
          c="var(--mantine-color-jltBlue-8)"
        >
          {title}
        </Text>
      </Group>

      {documents.length > 0 ? (
        <Stack gap="sm">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </Stack>
      ) : (
        <Text size="sm" c="dimmed">
          No documents available.
        </Text>
      )}
    </Stack>
  );
}

export function JobOrderDocumentsSection({
  detail,
  previewLimit,
  showViewAllDocuments = true,
}: JobOrderDocumentsSectionProps) {
  const documents = detail.documents ?? [];
  const jltcbDocuments = documents.filter(
    (document) => normalizeUploadedBy(document) === "JLTCB",
  );
  const clientDocuments = documents.filter(
    (document) => normalizeUploadedBy(document) === "Client",
  );

  const visibleJltcbDocuments =
    typeof previewLimit === "number"
      ? jltcbDocuments.slice(0, previewLimit)
      : jltcbDocuments;
  const visibleClientDocuments =
    typeof previewLimit === "number"
      ? clientDocuments.slice(0, previewLimit)
      : clientDocuments;

  return (
    <Stack gap="lg">
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <DocumentGroup
            title="Documents uploaded by JLTCB"
            icon={docJLTCBIcon}
            documents={visibleJltcbDocuments}
          />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <DocumentGroup
            title="Documents uploaded by Client"
            icon={docClientIcon}
            documents={visibleClientDocuments}
          />
        </Grid.Col>
      </Grid>

      {showViewAllDocuments && (
        <Anchor
          component={Link}
          to={jobOrderRoutes.clientDocuments(detail.id)}
          fw={600}
          ta="center"
          tt="uppercase"
          c="#4E6174"
          style={{
            borderTop: "1px solid var(--mantine-color-gray-3)",
            paddingTop: "0.875rem",
            letterSpacing: "0.04em",
          }}
        >
          View all documents
        </Anchor>
      )}
    </Stack>
  );
}
