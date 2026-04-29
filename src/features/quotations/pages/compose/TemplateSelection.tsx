import { useQuery } from "@tanstack/react-query";
import { Text } from "@mantine/core";
import { useNavigate, useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { TemplateSelector } from "@/features/quotations/components/TemplateSelector";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { useComposeQuotationTemplates } from "@/features/quotations/hooks/useComposeReferenceData";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import type { ComposeTemplateType } from "@/features/quotations/api/quotations-api/compose.api";

function resolveComposeTemplateType(
  serviceType?: string | null,
): ComposeTemplateType | undefined {
  if (serviceType === "IMPORT" || serviceType === "EXPORT") {
    return serviceType;
  }

  if (serviceType === "BUSINESS SOLUTION") {
    return "BUSINESS SOLUTION";
  }

  return undefined;
}

export function TemplateSelection() {
  const navigate = useNavigate();
  const { tab, clientId, quotationId } = useParams();
  const { data: quotation, isLoading: isQuotationLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(quotationId),
    queryFn: () => {
      if (!quotationId) {
        throw new Error("Missing quotation id.");
      }

      return fetchQuotation(quotationId);
    },
    enabled: Boolean(quotationId),
  });

  const templateType = resolveComposeTemplateType(
    quotation?.service?.type ??
      (quotation?.regulatory_service ? "BUSINESS SOLUTION" : undefined),
  );

  const { data: quotationTemplates = [], isLoading: isTemplatesLoading } =
    useComposeQuotationTemplates(templateType);

  const templates = quotationTemplates.map((template) => ({
    id: template.id,
    name: template.name,
    enabled: true,
  }));

  function handleSelect(templateId: string) {
    navigate(
      `/quotations/${tab}/client/${clientId}/${quotationId}/compose/${templateId}`,
    );
  }

  if (isQuotationLoading || isTemplatesLoading) {
    return (
      <PageCard title="Select Template" fullHeight>
        <ComposeStepLoader label="Loading templates..." />
      </PageCard>
    );
  }

  if (!templateType || templates.length === 0) {
    return (
      <PageCard title="Select Template" fullHeight>
        <Text size="sm" c="dimmed">
          No templates available for this quotation.
        </Text>
      </PageCard>
    );
  }

  return (
    <PageCard title="Select Template" fullHeight>
      <TemplateSelector templates={templates} onSelect={handleSelect} />
    </PageCard>
  );
}
