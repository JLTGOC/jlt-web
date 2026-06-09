import { useQuery } from "@tanstack/react-query";
import { Stack, Text, Box, Button, Menu, Group } from "@mantine/core";
import { MoreVert, Download, Print } from "@nine-thirty-five/material-symbols-react/outlined";
import { ArrowBack, PictureAsPdf } from "@nine-thirty-five/material-symbols-react/rounded";
import { useNavigate, useLocation } from "react-router";
import { PageCard } from "@/components/PageCard";
import { PdfThumbnail } from "@/components/PdfThumbnail";
import { toClientFileUrl } from "@/utils/file-url";
import { companyService } from "../../services/company.service";
import type { CompanyDocumentPayload, CompanyFullDetails } from "../../types/company.types";

export function CompanyDocuments() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get company ID and data from navigation state
  const companyId = (location.state as any)?.companyId;
  const companyData = (location.state as any)?.company as CompanyFullDetails | null;

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId, "documents"],
    queryFn: async () => {
      if (!companyId) {
        throw new Error("Missing company ID.");
      }
      return companyService.getCompanyById(companyId, "documents");
    },
    enabled: Boolean(companyId),
    initialData: companyData || undefined,
  });

  if (!companyId) {
    return (
      <PageCard title="Company Documents" fullHeight>
        <Text size="0.8rem" c="dimmed">
          Invalid company ID.
        </Text>
      </PageCard>
    );
  }

  const documents =
    company?.documentsAttachments?.documents && Array.isArray(company.documentsAttachments.documents)
      ? company.documentsAttachments.documents
      : [];
  const hasDocuments = documents.length > 0;

  return (
    <Stack gap="lg">
      <Group align="center" gap="sm">
        <Button variant="subtle" p={0} onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowBack width="1.5rem" height="1.5rem" fill="currentColor" />
        </Button>
        <Text size="xl" fw={700}>
          COMPANY DOCUMENTS
        </Text>
      </Group>

      <PageCard title="" fullHeight hideBackButton onBack={() => navigate(-1)}>
        {isLoading ? (
          <Text size="0.8rem" c="dimmed">
            Loading documents...
          </Text>
        ) : !hasDocuments ? (
          <Text size="0.8rem" c="dimmed">
            No documents available.
          </Text>
        ) : (
          <Stack gap="md">
            {documents.map((doc) => (
              <DocumentDetailCard key={doc.id} doc={doc} />
            ))}
          </Stack>
        )}
      </PageCard>
    </Stack>
  );
}

interface DocumentDetailCardProps {
  doc: CompanyDocumentPayload;
}

function DocumentDetailCard({ doc }: DocumentDetailCardProps) {
  const fileUrl = doc.url ? toClientFileUrl(doc.url) : "";
  const isPdf = fileUrl && doc.name.toLowerCase().endsWith(".pdf");

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = doc.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    if (fileUrl) {
      const printWindow = window.open(fileUrl, "_blank");
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  return (
    <Box
      onClick={() => {
        if (fileUrl) {
          window.open(fileUrl, "_blank");
        }
      }}
      style={{
        width: "100%",
        height: 56,
        padding: "0.75rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        border: "1px solid var(--mantine-color-gray-3)",
        borderRadius: "var(--mantine-radius-sm)",
        cursor: fileUrl ? "pointer" : "default",
      }}
    >
      {isPdf && fileUrl ? (
        <Box style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <PdfThumbnail url={fileUrl} />
        </Box>
      ) : (
        <PictureAsPdf width={24} height={24} style={{ color: "var(--mantine-color-red-6)", flexShrink: 0 }} />
      )}

      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text size="sm" fw={500} truncate>
          {doc.name}
        </Text>
        {doc.file_type && (
          <Text size="xs" c="dimmed" truncate>
            {doc.file_type}
          </Text>
        )}
      </Box>

      <Menu position="bottom-end">
        <Menu.Target>
          <Button variant="subtle" p={0} onClick={(e) => e.stopPropagation()}>
            <MoreVert style={{ width: 16, height: 16 }} />
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            leftSection={<Download style={{ width: 16, height: 16 }} />}
            onClick={(e) => {
              e.stopPropagation();
              handleDownload();
            }}
          >
            Download
          </Menu.Item>
          <Menu.Item
            leftSection={<Print style={{ width: 16, height: 16 }} />}
            onClick={(e) => {
              e.stopPropagation();
              handlePrint();
            }}
          >
            Print
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Box>
  );
}
