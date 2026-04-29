import { ActionIcon, Box, Center, Group, Text } from "@mantine/core";
import {
  ArrowBack,
  Download,
  EditDocument,
  Print,
} from "@nine-thirty-five/material-symbols-react/outlined";
import { useNavigate, useParams } from "react-router";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { useQuotationRouteParams } from "@/features/quotations/hooks/useQuotationRouteParams";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { usePDFActions } from "@/features/quotations/pdf/usePDFActions";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { ScaledA4PreviewFrame } from "@/features/quotations/components/ScaledA4PreviewFrame";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import {
  fetchIssuedQuotation,
  fetchQuotationTemplate,
} from "@/features/quotations/api/quotations-api/compose.api";
import { buildViewerStateFromIssuedQuotation } from "@/features/quotations/utils/issuedQuotationViewerState";
import { mapQuotationTemplateDetailToComposeTemplate } from "@/features/quotations/utils/quotationTemplateMapper";
import classes from "./QuotationFileViewer.module.css";

export function QuotationFileViewer() {
  const navigate = useNavigate();
  const routeParams = useQuotationRouteParams(["tab", "quotationId"] as const);
  const params = useParams<{ clientId?: string; issuedQuotationId?: string }>();
  const clientId = params.clientId;
  const routeIssuedQuotationId = params.issuedQuotationId ?? null;

  const { data: quotation, isLoading: isQuotationLoading } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(routeParams?.quotationId),
    queryFn: () => {
      if (!routeParams) {
        throw new Error("Missing required route parameters.");
      }

      return fetchQuotation(routeParams.quotationId);
    },
    enabled: Boolean(routeParams),
  });

  const directIssuedQuotationId =
    quotation?.issued_quotation_id == null
      ? null
      : String(quotation.issued_quotation_id);
  const issuedQuotationId = routeIssuedQuotationId ?? directIssuedQuotationId;
  const isResolvingIssuedQuotationId = Boolean(
    routeParams && !issuedQuotationId && isQuotationLoading,
  );

  useEffect(() => {
    if (!routeParams || !issuedQuotationId || params.issuedQuotationId) {
      return;
    }

    navigate(
      quotationRoutes.viewer({
        tab: routeParams.tab,
        quotationId: routeParams.quotationId,
        clientId,
        issuedQuotationId,
      }),
      { replace: true },
    );
  }, [
    clientId,
    issuedQuotationId,
    navigate,
    params.issuedQuotationId,
    routeParams,
  ]);

  const shouldFetchIssuedViewerData = Boolean(routeParams && issuedQuotationId);

  const { data: issuedQuotation, isLoading: isIssuedQuotationLoading } =
    useQuery({
      queryKey: quotationQueryKeys.issuedQuotation(
        routeParams?.quotationId,
        issuedQuotationId ?? undefined,
      ),
      queryFn: () => {
        if (!routeParams || !issuedQuotationId) {
          throw new Error("Missing issued quotation route context.");
        }

        return fetchIssuedQuotation(routeParams.quotationId, issuedQuotationId);
      },
      enabled: shouldFetchIssuedViewerData,
    });

  const templateId = issuedQuotation
    ? String(issuedQuotation.template_id)
    : undefined;

  const { data: quotationTemplate, isLoading: isTemplateLoading } = useQuery({
    queryKey: ["quotation-template-viewer", templateId],
    queryFn: async () => {
      if (!templateId) {
        throw new Error("Missing issued quotation template id.");
      }

      const templateDetails = await fetchQuotationTemplate(templateId);
      return mapQuotationTemplateDetailToComposeTemplate(templateDetails);
    },
    enabled: Boolean(templateId && shouldFetchIssuedViewerData),
  });

  const viewerState = useMemo(() => {
    if (!issuedQuotation || !quotationTemplate || !quotation) {
      return null;
    }

    return buildViewerStateFromIssuedQuotation({
      quotation,
      template: quotationTemplate,
      issuedQuotation,
    });
  }, [issuedQuotation, quotation, quotationTemplate]);

  const isViewerStateLoading =
    isQuotationLoading ||
    (shouldFetchIssuedViewerData &&
      (isIssuedQuotationLoading || isTemplateLoading));

  const {
    handleDownload: handlePreviewDownload,
    handlePrint: handlePreviewPrint,
  } = usePDFActions(viewerState, jltLogoUrl);
  const canEdit =
    routeParams?.tab === "responded" || routeParams?.tab === "accepted";

  function handleDownload() {
    if (!viewerState) {
      return;
    }

    void handlePreviewDownload();
  }

  function handlePrint() {
    if (!viewerState) {
      return;
    }

    void handlePreviewPrint();
  }

  if (isResolvingIssuedQuotationId) {
    return (
      <Center h="100%">
        <Text c="dimmed">Loading issued quotation...</Text>
      </Center>
    );
  }

  if (isViewerStateLoading) {
    return (
      <Center h="100%">
        <Text c="dimmed">Loading issued quotation...</Text>
      </Center>
    );
  }

  if (!viewerState) {
    return (
      <Center h="100%">
        <Text c="dimmed">No issued quotation data found for this view.</Text>
      </Center>
    );
  }

  function handleEdit() {
    if (!routeParams || !canEdit) {
      navigate(-1);
      return;
    }

    if (!viewerState) {
      navigate(
        quotationRoutes.compose({
          tab: routeParams.tab,
          clientId,
          quotationId: routeParams.quotationId,
        }),
      );
      return;
    }

    navigate(
      quotationRoutes.composeTemplate({
        tab: routeParams.tab,
        clientId,
        quotationId: routeParams.quotationId,
        templateId: viewerState.template.id,
      }),
      {
        state: {
          editMode: true,
          issuedQuotationId: issuedQuotationId ?? undefined,
          quotationDetails: viewerState.quotationDetails,
          billingDetails: viewerState.billingDetails,
          terms: viewerState.terms,
          signatory: viewerState.signatory,
        },
      },
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.topBar}>
        <Box>
          <Group gap="xs" align="center">
            <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
              <ArrowBack width="1.25rem" height="1.25rem" />
            </ActionIcon>
            <Box>
              <Text fw={700} c="jltBlue">
                {quotation?.reference_number ??
                  viewerState.quotation.reference_number}
              </Text>
              <Text size="sm" c="jltBlue">
                Quoted by: {issuedQuotation?.issued_by ?? "-"}
              </Text>
            </Box>
          </Group>
        </Box>

        <Group gap="sm">
          <ActionIcon
            variant="subtle"
            onClick={handleDownload}
            aria-label="Download"
          >
            <Download width="1.25rem" height="1.25rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" onClick={handlePrint} aria-label="Print">
            <Print width="1.25rem" height="1.25rem" />
          </ActionIcon>
          {canEdit ? (
            <ActionIcon variant="subtle" onClick={handleEdit} aria-label="Edit">
              <EditDocument width="1.25rem" height="1.25rem" />
            </ActionIcon>
          ) : null}
        </Group>
      </Box>

      <Box className={classes.scrollArea}>
        <ScaledA4PreviewFrame
          viewportClassName={classes.scaleViewport}
          canvasClassName={classes.a4}
        >
          <QuotationPreview
            quotation={viewerState.quotation}
            template={viewerState.template}
            clientInformationFields={viewerState.clientInformationFields}
            quotationDetails={viewerState.quotationDetails}
            billingDetails={viewerState.billingDetails}
            terms={viewerState.terms}
            signatory={viewerState.signatory}
            dateGenerated={viewerState.quotation.created_at}
            mode="viewer"
          />
        </ScaledA4PreviewFrame>
      </Box>
    </Box>
  );
}
