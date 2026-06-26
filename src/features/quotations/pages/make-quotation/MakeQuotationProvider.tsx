import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useBeforeUnload, useBlocker, useNavigate } from "react-router";
import jltLogoUrl from "@/assets/logos/word-dark.png";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import { storeQuotation } from "./api/make-quotation.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import { createIssuedQuotation } from "@/features/quotations/api/quotations-api/compose.api";
import { useComposeQuotationTemplate } from "@/features/quotations/hooks/useComposeReferenceData";
import { buildIssuedQuotationFormData } from "@/features/quotations/pages/compose/utils/issuedQuotationPayload";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { ViewerSignatoryValues } from "@/features/quotations/types/compose.types";
import { quotationRoutes } from "@/features/quotations/utils/quotationRoutes";
import { MakeQuotationContext } from "./MakeQuotationContext";
import {
  BILLING_DETAILS_FORM_ID,
  QUOTATION_DETAILS_FORM_ID,
} from "./constants/make-quotation.constants";
import type {
  ClientInfoValues,
  DocumentValues,
  MakeQuotationMeta,
  MakeQuotationSnapshot,
  MakeQuotationState,
  ServiceInfoValues,
  ServiceSubStep,
} from "./types/make-quotation.types";
import { snapshotsEqual } from "./utils/snapshot";

export function MakeQuotationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);
  const [serviceSubStep, setServiceSubStep] =
    useState<ServiceSubStep>("service");
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [quotationId, setQuotationId] = useState<string | null>(null);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [clientInfo, setClientInfo] = useState<ClientInfoValues | null>(null);
  const [serviceInfo, setServiceInfo] = useState<ServiceInfoValues | null>(
    null,
  );
  const [documentValues, setDocumentValues] = useState<DocumentValues | null>(
    null,
  );
  const [quotationDetailsData, setQuotationDetailsData] =
    useState<QuotationDetailsValues | null>(null);
  const [billingDetailsData, setBillingDetailsData] =
    useState<BillingDetailsValues | null>(null);
  const [termsData, setTermsData] = useState<TermsValues | null>(null);
  const [signatoryData, setSignatoryData] =
    useState<ViewerSignatoryValues | null>(null);
  const [isStep0Valid, setIsStep0Valid] = useState(false);
  const [isStep2Valid, setIsStep2Valid] = useState(false);
  const [isStep3Valid, setIsStep3Valid] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
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

  const savedSnapshotRef = useRef<MakeQuotationSnapshot>({
    clientInfo: null,
    serviceInfo: null,
    documentValues: null,
    quotationDetails: null,
    billingDetails: null,
    terms: null,
    signatory: null,
  });

  const currentSnapshot = useMemo<MakeQuotationSnapshot>(
    () => ({
      clientInfo,
      serviceInfo,
      documentValues,
      quotationDetails: quotationDetailsData,
      billingDetails: billingDetailsData,
      terms: termsData,
      signatory: signatoryData,
    }),
    [
      clientInfo,
      serviceInfo,
      documentValues,
      quotationDetailsData,
      billingDetailsData,
      termsData,
      signatoryData,
    ],
  );

  const { data: quotation } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(quotationId ?? undefined),
    queryFn: () => fetchQuotation(quotationId!),
    enabled: Boolean(quotationId),
  });

  const { data: quotationTemplate } = useComposeQuotationTemplate(
    templateId ?? undefined,
  );

  const createQuotationMutation = useMutation({
    mutationFn: storeQuotation,
    onSuccess: (data) => {
      const newId = String(data.id);
      setQuotationId(newId);
      setShowTemplateSelection(true);
      setStep(2);
      queryClient.invalidateQueries({
        queryKey: quotationQueryKeys.byStatusRoot("REQUESTED"),
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: "Unable to create quotation",
        message: error instanceof Error ? error.message : "Please try again.",
        color: "red",
      });
    },
  });

  const sendMutation = useMutation({
    mutationFn: async () => {
      if (
        !quotationId ||
        !quotationTemplate ||
        !quotation ||
        !quotationDetailsData ||
        !billingDetailsData ||
        !termsData ||
        !signatoryData
      ) {
        throw new Error("Incomplete compose data.");
      }
      const [{ pdf }, { QuotationPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/features/quotations/pdf/QuotationPDF"),
      ]);
      const sigSrc = signatoryData.signature_file
        ? URL.createObjectURL(signatoryData.signature_file)
        : null;
      try {
        const doc = createElement(QuotationPDF, {
          quotation,
          template: quotationTemplate,
          quotationDetails: quotationDetailsData,
          billingDetails: billingDetailsData,
          terms: termsData,
          signatory: signatoryData,
          logoSrc: jltLogoUrl,
          signatorySignatureSrc: sigSrc,
        });
        const blob = await pdf(doc as never).toBlob();
        const pdfBlob =
          blob.type === "application/pdf"
            ? blob
            : new Blob([blob], { type: "application/pdf" });
        const file = new File(
          [pdfBlob],
          `${quotation.reference_number}-proposal.pdf`,
          { type: "application/pdf" },
        );
        const payload = buildIssuedQuotationFormData({
          template: quotationTemplate,
          quotationDetails: quotationDetailsData,
          billingDetails: billingDetailsData,
          terms: termsData,
          signatory: signatoryData,
          issuedQuotationFile: file,
        });
        return createIssuedQuotation(quotationId, payload);
      } finally {
        if (sigSrc) URL.revokeObjectURL(sigSrc);
      }
    },
    onSuccess: () => {
      savedSnapshotRef.current = currentSnapshot;
      closeSendConfirm();
      openSendSuccess();
      queryClient.invalidateQueries({
        queryKey: quotationQueryKeys.quotationDetails(quotationId ?? undefined),
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: "Unable to send quotation",
        message: error instanceof Error ? error.message : "Please try again.",
        color: "red",
      });
    },
  });

  const hasUnsavedChanges = !snapshotsEqual(
    currentSnapshot,
    savedSnapshotRef.current,
  );
  const shouldWarnOnExit =
    hasUnsavedChanges &&
    !createQuotationMutation.isPending &&
    !sendMutation.isPending &&
    !sendSuccessOpened;
  const blocker = useBlocker(shouldWarnOnExit);

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!shouldWarnOnExit) return;
        event.preventDefault();
        event.returnValue = "";
      },
      [shouldWarnOnExit],
    ),
  );

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    const proceed = window.confirm(
      "You have unsaved changes. Leave this page?",
    );
    if (proceed) blocker.proceed();
    else blocker.reset();
  }, [blocker]);

  const handleSendSuccess = useCallback(() => {
    closeSendSuccess();
    navigate(
      quotationId
        ? quotationRoutes.viewer({ tab: "responded", quotationId })
        : "/quotations/responded",
    );
  }, [closeSendSuccess, navigate, quotationId]);

  const actions = useMemo(
    () => ({
      goToStep: (s: number) => setStep(s),
      goToServiceSubStep: (sub: ServiceSubStep) => setServiceSubStep(sub),
      submitClientInfo: (values: ClientInfoValues) => {
        setClientInfo(values);
        setStep(1);
        setServiceSubStep("service");
      },
      submitServiceInfo: (values: ServiceInfoValues) => {
        setServiceInfo(values);
        setServiceSubStep("documents");
      },
      submitDocuments: async (values: DocumentValues) => {
        if (!clientInfo || !serviceInfo) return;
        setDocumentValues(values);

        const structuredDocuments: Array<{ file: File; type?: string }> = [
          ...Object.entries(values.checklistFiles).map(([label, file]) => ({
            file,
            type: label,
          })),
          ...values.otherFiles.map((file) => ({ file })),
        ];

        const documents =
          structuredDocuments.length > 0 ? structuredDocuments : undefined;

        const isProspect = clientInfo.clientType === "prospect";
        const basePayload = {
          client: isProspect ? clientInfo.fullName : clientInfo.clientId,
          full_name: clientInfo.fullName,
          company: {
            name: clientInfo.company.name,
            consignee: clientInfo.company.consignee,
            address: clientInfo.company.address,
            contact_person: clientInfo.company.contactPerson,
            contact_number: clientInfo.company.contactNumber,
            email: clientInfo.company.email,
            position: clientInfo.company.position,
            business_type: clientInfo.company.businessType,
          },
          documents,
        };

        if (clientInfo.services === "LOGISTICS") {
          await createQuotationMutation.mutateAsync({
            ...basePayload,
            services: "LOGISTICS",
            service: {
              type: serviceInfo.serviceType,
              transport_mode: serviceInfo.transportMode!,
              options: serviceInfo.serviceOptions ?? [],
            },
            commodity: {
              commodity: serviceInfo.commodity,
              cargo_type: serviceInfo.cargoType!,
              container_size: serviceInfo.containerSize,
            },
            shipment: {
              origin: serviceInfo.origin!,
              destination: serviceInfo.destination!,
            },
            remarks: serviceInfo.remarks,
          });
        } else {
          await createQuotationMutation.mutateAsync({
            ...basePayload,
            services: "REGULATORY",
            service: {
              type: serviceInfo.regulatoryServiceType!,
              options: serviceInfo.serviceRequests ?? [],
            },
            type_of_regulatory_assistance:
              serviceInfo.regulatoryAuthorities ?? [],
            service_level: serviceInfo.serviceLevel ?? "NEW",
            message: serviceInfo.message,
            commodity: serviceInfo.commodity
              ? { commodity: serviceInfo.commodity }
              : undefined,
          });
        }
      },
      selectTemplate: (id: string) => {
        setTemplateId(id);
        setShowTemplateSelection(false);
      },
      resetCreatedQuotationSelection: () => {
        setTemplateId(null);
        setQuotationId(null);
        setShowTemplateSelection(false);
        setStep(1);
        setServiceSubStep("documents");
      },
      returnToTemplateSelection: () => {
        setShowTemplateSelection(true);
        setStep(2);
      },
      setQuotationDetailsData: (values: QuotationDetailsValues) => {
        setQuotationDetailsData(values);
        setPreviewReady(false);
      },
      setBillingDetailsData: (values: BillingDetailsValues) => {
        setBillingDetailsData(values);
        setPreviewReady(false);
      },
      setTermsData: (values: TermsValues) => {
        setTermsData(values);
        setPreviewReady(false);
      },
      setSignatoryData: (values: ViewerSignatoryValues) => {
        setSignatoryData(values);
        setPreviewReady(true);
        closeSignatory();
      },
      setPreviewReady,
      setIsStep0Valid,
      setIsStep2Valid,
      setIsStep3Valid,
      openSendConfirm,
      closeSendConfirm,
      submitSend: async () => {
        try {
          await sendMutation.mutateAsync();
        } catch {
          // error notification handled in mutation
        }
      },
      closeSendSuccess: handleSendSuccess,
      openSignatory,
      closeSignatory,
    }),
    [
      clientInfo,
      serviceInfo,
      createQuotationMutation,
      sendMutation,
      closeSignatory,
      openSendConfirm,
      closeSendConfirm,
      handleSendSuccess,
      openSignatory,
    ],
  );

  const state = useMemo<MakeQuotationState>(
    () => ({
      step,
      serviceSubStep,
      showTemplateSelection,
      quotationId,
      templateId,
      clientInfo,
      serviceInfo,
      documentValues,
      quotationDetailsData,
      billingDetailsData,
      termsData,
      signatoryData,
      isStep0Valid,
      isStep2Valid,
      isStep3Valid,
      isCreatingQuotation: createQuotationMutation.isPending,
      isSending: sendMutation.isPending,
      previewReady,
    }),
    [
      step,
      serviceSubStep,
      showTemplateSelection,
      quotationId,
      templateId,
      clientInfo,
      serviceInfo,
      documentValues,
      quotationDetailsData,
      billingDetailsData,
      termsData,
      signatoryData,
      isStep0Valid,
      isStep2Valid,
      isStep3Valid,
      createQuotationMutation.isPending,
      sendMutation.isPending,
      previewReady,
    ],
  );

  const meta = useMemo<MakeQuotationMeta>(
    () => ({
      signatoryOpened,
      sendConfirmOpened,
      sendSuccessOpened,
      quotationDetailsFormId: QUOTATION_DETAILS_FORM_ID,
      billingDetailsFormId: BILLING_DETAILS_FORM_ID,
    }),
    [signatoryOpened, sendConfirmOpened, sendSuccessOpened],
  );

  return (
    <MakeQuotationContext.Provider value={{ state, actions, meta }}>
      {children}
    </MakeQuotationContext.Provider>
  );
}
