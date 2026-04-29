import { Button, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useBeforeUnload,
  useBlocker,
  useLocation,
  useNavigate,
  useParams,
} from "react-router";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { PageCard } from "@/components/PageCard";
import { useAuthStore } from "@/stores/authStore";
import { AuthorizedSignatoryModal } from "@/features/quotations/components/AuthorizedSignatoryModal";
import { StepperBar } from "@/features/quotations/components/StepperBar";
import { ComposeSendModals } from "@/features/quotations/pages/compose/components/ComposeSendModals";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { ComposeStepActions } from "@/features/quotations/pages/compose/components/ComposeStepActions";
import { ComposeStepContent } from "@/features/quotations/pages/compose/components/ComposeStepContent";
import {
  useComposeQuotationClientInputs,
  useComposeQuotationTemplate,
} from "@/features/quotations/hooks/useComposeReferenceData";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { buildIssuedQuotationFormData } from "@/features/quotations/pages/compose/utils/issuedQuotationPayload";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import {
  createIssuedQuotation,
  fetchIssuedQuotation,
  updateIssuedQuotation,
} from "@/features/quotations/api/quotations-api/compose.api";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { buildViewerStateFromIssuedQuotation } from "@/features/quotations/utils/issuedQuotationViewerState";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
  ViewerSignatoryValues,
} from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";

const QUOTATION_DETAILS_FORM_ID = "quotation-details-form";
const BILLING_DETAILS_FORM_ID = "billing-details-form";

interface ComposeLocationState {
  editMode?: boolean;
  issuedQuotationId?: string;
  quotationDetails?: QuotationDetailsValues;
  billingDetails?: BillingDetailsValues;
  terms?: TermsValues;
  signatory?: ViewerSignatoryValues;
}

interface ComposeSnapshot {
  quotationDetails: QuotationDetailsValues | null;
  billingDetails: BillingDetailsValues | null;
  terms: TermsValues | null;
  signatory: ViewerSignatoryValues | null;
}

function normalizeSignatoryForCompare(
  signatory: ViewerSignatoryValues | null,
): Record<string, unknown> | null {
  if (!signatory) {
    return null;
  }

  return {
    complementary_close: signatory.complementary_close,
    is_authorized_signatory: signatory.is_authorized_signatory,
    authorized_signatory_name: signatory.authorized_signatory_name,
    position_title: signatory.position_title,
    signature_file_url: signatory.signature_file_url ?? null,
    signature_file: signatory.signature_file
      ? {
          name: signatory.signature_file.name,
          size: signatory.signature_file.size,
          type: signatory.signature_file.type,
          lastModified: signatory.signature_file.lastModified,
        }
      : null,
  };
}

function normalizeSnapshot(snapshot: ComposeSnapshot) {
  return {
    quotationDetails: snapshot.quotationDetails,
    billingDetails: snapshot.billingDetails,
    terms: snapshot.terms,
    signatory: normalizeSignatoryForCompare(snapshot.signatory),
  };
}

function areSnapshotsEqual(a: ComposeSnapshot, b: ComposeSnapshot): boolean {
  return (
    JSON.stringify(normalizeSnapshot(a)) ===
    JSON.stringify(normalizeSnapshot(b))
  );
}

function toErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { data?: unknown } }).response?.data &&
    typeof (error as { response?: { data?: { message?: unknown } } }).response
      ?.data?.message === "string"
  ) {
    return (error as { response: { data: { message: string } } }).response.data
      .message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Please review the compose data and try again.";
}

async function generateIssuedQuotationPdfFile({
  quotation,
  template,
  clientInformationFields,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
}: {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields: ClientInformationValue[];
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
}): Promise<File> {
  const [{ pdf }, { QuotationPDF }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("@/features/quotations/pdf/QuotationPDF"),
  ]);

  const signatorySignatureSrc = signatory.signature_file
    ? URL.createObjectURL(signatory.signature_file)
    : null;

  try {
    const doc = createElement(QuotationPDF, {
      quotation,
      template,
      clientInformationFields,
      quotationDetails,
      billingDetails,
      terms,
      signatory,
      logoSrc: jltLogoUrl,
      signatorySignatureSrc,
    });

    const blob = await pdf(doc as never).toBlob();
    const pdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });

    return new File([pdfBlob], `${quotation.reference_number}-proposal.pdf`, {
      type: "application/pdf",
    });
  } finally {
    if (signatorySignatureSrc) {
      URL.revokeObjectURL(signatorySignatureSrc);
    }
  }
}

export function ComposeQuotationPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const composeLocationState = location.state as ComposeLocationState | null;
  const initialQuotationDetails =
    composeLocationState?.quotationDetails ?? null;
  const initialBillingDetails = composeLocationState?.billingDetails ?? null;
  const initialTerms = composeLocationState?.terms ?? null;
  const initialSignatory = composeLocationState?.signatory ?? null;
  const initialIssuedQuotationId =
    composeLocationState?.issuedQuotationId ?? null;
  const userResource = useAuthStore((state) => state.user);
  const currentUserName = userResource
    ? `${userResource.first_name} ${userResource.last_name}`
    : undefined;
  const { template: templateId, quotationId, tab, clientId } = useParams();
  const isEditTab = tab === "responded" || tab === "accepted";
  const hasLocationPrefill = Boolean(
    initialQuotationDetails &&
    initialBillingDetails &&
    initialTerms &&
    initialSignatory,
  );

  const { data: quotation } = useQuery({
    queryKey: ["quotation", quotationId],
    queryFn: () => {
      if (!quotationId) {
        throw new Error("Missing quotationId route parameter.");
      }
      return fetchQuotation(quotationId);
    },
    enabled: Boolean(quotationId),
  });

  const { data: quotationTemplate, isLoading: isTemplateLoading } =
    useComposeQuotationTemplate(templateId);

  const { data: clientInformationFields = [] } =
    useComposeQuotationClientInputs(quotationId, quotationTemplate?.id);

  const [step, setStep] = useState(0);
  const [isStep0Valid, setIsStep0Valid] = useState(false);
  const [quotationDetailsData, setQuotationDetailsData] =
    useState<QuotationDetailsValues | null>(initialQuotationDetails);
  const [billingDetailsData, setBillingDetailsData] =
    useState<BillingDetailsValues | null>(initialBillingDetails);
  const [termsData, setTermsData] = useState<TermsValues | null>(initialTerms);
  const [signatoryData, setSignatoryData] =
    useState<ViewerSignatoryValues | null>(initialSignatory);
  const [issuedQuotationId, setIssuedQuotationId] = useState<string | null>(
    null,
  );
  const [previewReady, setPreviewReady] = useState(false);
  const [savedSnapshot, setSavedSnapshot] = useState<ComposeSnapshot | null>(
    null,
  );
  const [signatoryOpened, { open: openSignatory, close: closeSignatory }] =
    useDisclosure(false);
  const [
    sendConfirmOpened,
    { open: openSendConfirm, close: closeSendConfirm },
  ] = useDisclosure(false);
  const [
    sendSuccessOpened,
    { open: openSendSuccess, close: closeSendSuccess },
  ] = useDisclosure(false);
  const fallbackIssuedQuotationId =
    quotation?.issued_quotation_id == null
      ? null
      : String(quotation.issued_quotation_id);
  const issuedQuotationIdForEdit =
    initialIssuedQuotationId ?? fallbackIssuedQuotationId;
  const editMode =
    composeLocationState?.editMode ??
    Boolean(isEditTab && issuedQuotationIdForEdit);
  const shouldHydrateEditState =
    !hasLocationPrefill &&
    editMode &&
    Boolean(quotationId && issuedQuotationIdForEdit);

  const {
    data: issuedQuotationForEdit,
    isLoading: isIssuedQuotationForEditLoading,
    isError: isIssuedQuotationForEditError,
  } = useQuery({
    queryKey: quotationQueryKeys.issuedQuotation(
      quotationId,
      issuedQuotationIdForEdit ?? undefined,
    ),
    queryFn: () => {
      if (!quotationId || !issuedQuotationIdForEdit) {
        throw new Error("Missing issued quotation route context.");
      }

      return fetchIssuedQuotation(quotationId, issuedQuotationIdForEdit);
    },
    enabled: shouldHydrateEditState,
  });

  const hydratedViewerState = useMemo(() => {
    if (
      !shouldHydrateEditState ||
      !quotation ||
      !quotationTemplate ||
      !issuedQuotationForEdit
    ) {
      return null;
    }

    if (String(issuedQuotationForEdit.template_id) !== quotationTemplate.id) {
      return null;
    }

    return buildViewerStateFromIssuedQuotation({
      quotation,
      template: quotationTemplate,
      issuedQuotation: issuedQuotationForEdit,
    });
  }, [
    shouldHydrateEditState,
    quotation,
    quotationTemplate,
    issuedQuotationForEdit,
  ]);

  const effectiveQuotationDetailsData =
    quotationDetailsData ?? hydratedViewerState?.quotationDetails ?? null;
  const effectiveBillingDetailsData =
    billingDetailsData ?? hydratedViewerState?.billingDetails ?? null;
  const effectiveTermsData = termsData ?? hydratedViewerState?.terms ?? null;
  const effectiveSignatoryData =
    signatoryData ?? hydratedViewerState?.signatory ?? null;
  const canOpenSignatoryModal =
    effectiveTermsData !== null || effectiveSignatoryData !== null;
  const canRenderTermsStep =
    effectiveQuotationDetailsData !== null &&
    effectiveBillingDetailsData !== null;

  const currentSnapshot = useMemo<ComposeSnapshot>(
    () => ({
      quotationDetails: effectiveQuotationDetailsData,
      billingDetails: effectiveBillingDetailsData,
      terms: effectiveTermsData,
      signatory: effectiveSignatoryData,
    }),
    [
      effectiveQuotationDetailsData,
      effectiveBillingDetailsData,
      effectiveTermsData,
      effectiveSignatoryData,
    ],
  );
  const baselineSnapshot = useMemo<ComposeSnapshot>(() => {
    if (savedSnapshot) {
      return savedSnapshot;
    }

    if (hasLocationPrefill) {
      return {
        quotationDetails: initialQuotationDetails,
        billingDetails: initialBillingDetails,
        terms: initialTerms,
        signatory: initialSignatory,
      };
    }

    if (hydratedViewerState) {
      return {
        quotationDetails: hydratedViewerState.quotationDetails,
        billingDetails: hydratedViewerState.billingDetails,
        terms: hydratedViewerState.terms,
        signatory: hydratedViewerState.signatory,
      };
    }

    return {
      quotationDetails: null,
      billingDetails: null,
      terms: null,
      signatory: null,
    };
  }, [
    savedSnapshot,
    hasLocationPrefill,
    initialQuotationDetails,
    initialBillingDetails,
    initialTerms,
    initialSignatory,
    hydratedViewerState,
  ]);

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (!quotationId || !quotationTemplate || !quotation) {
        throw new Error("Missing quotation context.");
      }
      if (
        !effectiveQuotationDetailsData ||
        !effectiveBillingDetailsData ||
        !effectiveTermsData ||
        !effectiveSignatoryData
      ) {
        throw new Error("Complete all compose steps before sending.");
      }
      if (
        !effectiveQuotationDetailsData.subject?.trim() ||
        !effectiveQuotationDetailsData.message?.trim()
      ) {
        throw new Error("Subject and message are required before sending.");
      }

      const hasSignature = Boolean(
        effectiveSignatoryData.signature_file ||
        effectiveSignatoryData.signature_file_url,
      );

      if (!hasSignature) {
        throw new Error(
          "Upload an authorized signatory signature before sending.",
        );
      }

      const issuedQuotationFile = await generateIssuedQuotationPdfFile({
        quotation,
        template: quotationTemplate,
        clientInformationFields,
        quotationDetails: effectiveQuotationDetailsData,
        billingDetails: effectiveBillingDetailsData,
        terms: effectiveTermsData,
        signatory: effectiveSignatoryData,
      });

      const payload = buildIssuedQuotationFormData({
        template: quotationTemplate,
        quotationDetails: effectiveQuotationDetailsData,
        billingDetails: effectiveBillingDetailsData,
        terms: effectiveTermsData,
        signatory: effectiveSignatoryData,
        issuedQuotationFile,
      });

      if (editMode) {
        if (!issuedQuotationIdForEdit) {
          throw new Error("Missing issued quotation id for update.");
        }

        return updateIssuedQuotation(
          quotationId,
          issuedQuotationIdForEdit,
          payload,
        );
      }

      return createIssuedQuotation(quotationId, payload);
    },
    onSuccess: async (createdIssuedQuotation) => {
      setIssuedQuotationId(String(createdIssuedQuotation.id));
      closeSendConfirm();
      openSendSuccess();

      if (
        effectiveQuotationDetailsData &&
        effectiveBillingDetailsData &&
        effectiveTermsData &&
        effectiveSignatoryData
      ) {
        setSavedSnapshot({
          quotationDetails: effectiveQuotationDetailsData,
          billingDetails: effectiveBillingDetailsData,
          terms: effectiveTermsData,
          signatory: effectiveSignatoryData,
        });
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: quotationQueryKeys.quotationDetails(quotationId),
        }),
        queryClient.invalidateQueries({
          queryKey: quotationQueryKeys.quotationFiles(quotationId, "PROPOSAL"),
        }),
      ]);
    },
    onError: (error) => {
      notifications.show({
        title: "Unable to send quotation",
        message: toErrorMessage(error),
        color: "red",
      });
    },
  });

  const hasUnsavedChanges = useMemo(
    () => !areSnapshotsEqual(currentSnapshot, baselineSnapshot),
    [currentSnapshot, baselineSnapshot],
  );
  const shouldWarnOnExit =
    hasUnsavedChanges && !sendMutation.isPending && !sendSuccessOpened;
  const blocker = useBlocker(shouldWarnOnExit);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!shouldWarnOnExit) {
          return;
        }

        event.preventDefault();
        event.returnValue = "";
      },
      [shouldWarnOnExit],
    ),
  );

  useEffect(() => {
    if (blocker.state !== "blocked") {
      return;
    }

    const shouldProceed = window.confirm(
      "You have unsaved changes. Leave this page?",
    );

    if (shouldProceed) {
      blocker.proceed();
      return;
    }

    blocker.reset();
  }, [blocker]);

  if (isTemplateLoading) {
    return (
      <PageCard title="Compose Quotation" fullHeight>
        <ComposeStepLoader label="Loading quotation template..." />
      </PageCard>
    );
  }

  if (!quotationTemplate) {
    return (
      <PageCard title="Compose Quotation" fullHeight>
        <Box p="md">Template not found.</Box>
      </PageCard>
    );
  }

  if (shouldHydrateEditState && isIssuedQuotationForEditLoading) {
    return (
      <PageCard title="Compose Quotation" fullHeight>
        <ComposeStepLoader label="Loading issued quotation..." />
      </PageCard>
    );
  }

  if (
    shouldHydrateEditState &&
    (isIssuedQuotationForEditError || !hydratedViewerState)
  ) {
    return (
      <PageCard title="Compose Quotation" fullHeight>
        <Box p="md">Unable to load issued quotation for editing.</Box>
      </PageCard>
    );
  }

  function handleStepClick(index: number) {
    if (index < step) setStep(index);
  }

  function handleStep0Submit(values: QuotationDetailsValues) {
    setQuotationDetailsData(values);
    setPreviewReady(false);
    setStep(1);
  }

  function handleStep0Change(values: QuotationDetailsValues) {
    setQuotationDetailsData(values);
    setPreviewReady(false);
  }

  function handleStep1Submit(values: BillingDetailsValues) {
    setBillingDetailsData(values);
    setPreviewReady(false);
    setStep(2);
  }

  function handleStep1Change(values: BillingDetailsValues) {
    setBillingDetailsData(values);
    setPreviewReady(false);
  }

  function handleTermsChange(values: TermsValues) {
    setTermsData(values);
    setPreviewReady(false);
  }

  function handleStep2Next() {
    if (!effectiveTermsData) {
      return;
    }

    setTermsData(effectiveTermsData);
    setPreviewReady(false);
    openSignatory();
  }

  function handleSignatorySave(values: ViewerSignatoryValues) {
    setSignatoryData(values);
    setPreviewReady(true);
    closeSignatory();
  }

  function handleCancel() {
    if (!tab || !quotationId) {
      navigate(-1);
      return;
    }

    navigate(
      quotationRoutes.details({
        tab,
        clientId: clientId ?? undefined,
        quotationId,
      }),
    );
  }

  async function handleSend() {
    try {
      await sendMutation.mutateAsync();
    } catch {
      return;
    }
  }

  function handleSendSuccess() {
    closeSendSuccess();
    if (!quotationId || !tab) {
      navigate("/quotations/responded");
      return;
    }

    const postSendTab = tab === "requested" ? "responded" : tab;
    const postSendClientId = postSendTab === "requested" ? clientId : undefined;

    const viewerPath = quotationRoutes.viewer({
      tab: postSendTab,
      clientId: postSendClientId,
      quotationId,
      issuedQuotationId: issuedQuotationId ?? undefined,
    });

    navigate(viewerPath);
  }

  return (
    <PageCard
      title={quotationTemplate.name}
      fullHeight
      bodyPx={0}
      bodyPy={0}
      action={
        editMode ? (
          <Button
            variant="subtle"
            color="red"
            onClick={handleCancel}
            px={0}
            fw={500}
          >
            CANCEL
          </Button>
        ) : undefined
      }
    >
      <Box
        style={{
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <StepperBar step={step} onStepClick={handleStepClick} />

        <Box
          px="xl"
          py="lg"
          style={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <ComposeStepContent
            step={step}
            quotationTemplate={quotationTemplate}
            quotation={quotation}
            clientInformationFields={clientInformationFields}
            quotationDetailsData={effectiveQuotationDetailsData}
            billingDetailsData={effectiveBillingDetailsData}
            termsData={effectiveTermsData}
            signatoryData={effectiveSignatoryData}
            previewReady={previewReady}
            canRenderTermsStep={canRenderTermsStep}
            quotationDetailsFormId={QUOTATION_DETAILS_FORM_ID}
            billingDetailsFormId={BILLING_DETAILS_FORM_ID}
            onStep0Submit={handleStep0Submit}
            onStep1Submit={handleStep1Submit}
            onStep0Change={handleStep0Change}
            onStep1Change={handleStep1Change}
            onStep0ValidityChange={setIsStep0Valid}
            onTermsChange={handleTermsChange}
          />

          <ComposeStepActions
            step={step}
            isStep0Valid={isStep0Valid}
            canProceedStep2={Boolean(effectiveTermsData)}
            previewReady={previewReady}
            isSending={sendMutation.isPending}
            quotationDetailsFormId={QUOTATION_DETAILS_FORM_ID}
            billingDetailsFormId={BILLING_DETAILS_FORM_ID}
            onStep2Next={handleStep2Next}
            onOpenSendConfirm={openSendConfirm}
          />
        </Box>
      </Box>

      <AuthorizedSignatoryModal
        opened={signatoryOpened && canOpenSignatoryModal}
        onClose={closeSignatory}
        onSave={handleSignatorySave}
        currentUserName={currentUserName}
        initialValues={effectiveSignatoryData}
      />

      <ComposeSendModals
        sendConfirmOpened={sendConfirmOpened}
        sendSuccessOpened={sendSuccessOpened}
        isSending={sendMutation.isPending}
        onCloseSendConfirm={closeSendConfirm}
        onSend={handleSend}
        onCloseSendSuccess={handleSendSuccess}
      />
    </PageCard>
  );
}
