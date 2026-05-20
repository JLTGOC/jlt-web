import {
  ActionIcon,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Menu,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import {
  AddCircle,
  Download,
  MoreVert,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { ArrowBack } from "@nine-thirty-five/material-symbols-react/rounded";
import { fetchJobOrderDocuments } from "../../api/jobOrder.api";
import { jobOrdersQueryKeys } from "../../api/jobOrdersQueryKeys";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import { PageCard } from "@/components/PageCard";
import docClientIcon from "@/assets/icons/docClient.svg";
import docJLTCBIcon from "@/assets/icons/docJLTCB.svg";
import { useSecureFileUrl } from "@/hooks/useSecureFileUrl";
import { toClientFileUrl } from "@/utils/file-url";
import type { JobOrderDocument } from "../../types/jobOrderDetail";

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

function DocumentThumbnail({ document }: { document: JobOrderDocument }) {
  const fileUrl = document.file_url ? toClientFileUrl(document.file_url) : "";
  const { objectUrl, loading } = useSecureFileUrl(fileUrl);

  if (!fileUrl) {
    return (
      <Box
        style={{
          width: 44,
          height: 58,
          borderRadius: 8,
          backgroundColor: "var(--mantine-color-gray-1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        <Text size="xs" c="dimmed" tt="uppercase">
          PDF
        </Text>
      </Box>
    );
  }

  return (
    <Box
      style={{
        width: 44,
        height: 58,
        borderRadius: 8,
        backgroundColor: "var(--mantine-color-gray-1)",
        overflow: "hidden",
      }}
    >
      {loading ? (
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
      )}
    </Box>
  );
}

function DocumentRow({ document }: { document: JobOrderDocument }) {
  const fileUrl = document.file_url ? toClientFileUrl(document.file_url) : "";

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
      <Group gap="sm" wrap="nowrap" align="center">
        <DocumentThumbnail document={document} />

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Text size="sm" fw={600} lineClamp={1}>
            {document.file_name}
          </Text>
          <Text size="xs" c="dimmed">
            {formatDate(getDocumentDate(document))}
          </Text>
          {normalizeUploadedBy(document) === "JLTCB" && (
            <Text size="xs" c="dimmed" lineClamp={1}>
              Created By: {document.uploadedByUser ?? "JLTCB"}
            </Text>
          )}
        </Box>

        <Menu position="bottom-end" withinPortal>
          <Menu.Target>
            <ActionIcon
              variant="subtle"
              color="gray"
              aria-label="Document actions"
            >
              <MoreVert width={20} height={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {fileUrl && (
              <Menu.Item
                leftSection={<Download width={16} height={16} />}
                component="a"
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download
              </Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
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
            <DocumentRow key={document.id} document={document} />
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

export default function JobOrderClientDocumentsPage() {
  const navigate = useNavigate();
  const params = useParams<{ jobOrderId?: string }>();
  const jobOrderId = params.jobOrderId;

  const { data: documents = [], isLoading } = useQuery({
    queryKey: jobOrdersQueryKeys.documents(jobOrderId),
    queryFn: () => {
      if (!jobOrderId) {
        throw new Error("Missing job order id.");
      }
      return fetchJobOrderDocuments(jobOrderId);
    },
    enabled: Boolean(jobOrderId),
  });
  const jltcbDocuments = documents.filter(
    (document) => normalizeUploadedBy(document) === "JLTCB",
  );
  const clientDocuments = documents.filter(
    (document) => normalizeUploadedBy(document) === "Client",
  );

  if (!jobOrderId) {
    return (
      <PageCard title="Client Documents" fullHeight>
        <Text size="sm" c="dimmed">
          Invalid route parameters.
        </Text>
      </PageCard>
    );
  }

  if (isLoading) {
    return (
      <Center py="xl">
        <Stack gap="xs" align="center">
          <Loader size="sm" />
          <Text size="sm" c="dimmed">
            Loading documents...
          </Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack gap="md" p="md">
      <Group align="center" gap="xs">
        <Button
          variant="subtle"
          p={4}
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ArrowBack width="1.25rem" height="1.25rem" fill="currentColor" />
        </Button>
        <Text size="xl" fw={700}>
          CLIENT DOCUMENTS
        </Text>
      </Group>

      <PageCard
        title=""
        fullHeight
        hideBackButton
        bgColor="transparent"
        shadow={false}
        bodyPx={0}
        bodyPy={0}
      >
        <Paper
          withBorder
          radius="md"
          p="lg"
          style={{
            minHeight: 820,
            backgroundColor: "#fff",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
          }}
        >
          <Stack gap="xl">
            <DocumentGroup
              title="Documents uploaded by Client"
              icon={docClientIcon}
              documents={clientDocuments}
            />

            <DocumentGroup
              title="Documents uploaded by JLTCB"
              icon={docJLTCBIcon}
              documents={jltcbDocuments}
            />

            <Button
              fullWidth
              bg="#4E6174"
              c="white"
              style={{ textTransform: "uppercase", fontWeight: 500 }}
              leftSection={<AddCircle width={18} height={18} />}
            >
              Upload more documents
            </Button>
          </Stack>
        </Paper>
      </PageCard>
    </Stack>
  );
}
