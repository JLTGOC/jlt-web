import { Box, Group, Loader, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AuthorizedSignatoryModal } from "@/features/quotations/components/AuthorizedSignatoryModal";
import { StepperBar } from "@/features/quotations/components/StepperBar";
import { TemplateSelector } from "@/features/quotations/components/TemplateSelector";
import { fetchQuotation } from "@/features/quotations/api/quotations.api";
import type { ComposeTemplateType } from "@/features/quotations/api/quotations-api/compose.api";
import { quotationQueryKeys } from "@/features/quotations/api/quotationQueryKeys";
import {
  useComposeQuotationClientInputs,
  useComposeQuotationTemplate,
  useComposeQuotationTemplates,
} from "@/features/quotations/hooks/useComposeReferenceData";
import { ComposeSendModals } from "@/features/quotations/pages/compose/components/ComposeSendModals";
import { ComposeStepActions } from "@/features/quotations/pages/compose/components/ComposeStepActions";
import { ComposeStepContent } from "@/features/quotations/pages/compose/components/ComposeStepContent";
import type { TermsValues } from "@/features/quotations/schemas/compose.schema";
import { useAuthStore } from "@/stores/authStore";
import { ClientInformationForm } from "./steps/ClientInformationForm";
import { DocumentChecklistStep } from "./steps/DocumentChecklistStep";
import { LogisticsServiceForm } from "./steps/LogisticsServiceForm";
import { RegulatoryServiceForm } from "./steps/RegulatoryServiceForm";
import { MakeQuotationProvider } from "./MakeQuotationProvider";
import { useMakeQuotationContext } from "./MakeQuotationContext";

const MAKE_QUOTATION_STEP_LABELS = [
  "CLIENT INFORMATION",
  "SERVICE IN FORMATION",
  "QUOTATION DETAILS",
  "PRICING DETAILS",
  "TERMS AND CONDITION/CLOSING STATEMENT",
] as const;

function isTermsComplete(terms: TermsValues | null): terms is TermsValues {
  if (!terms) return false;
  return [
    terms.template_id,
    terms.template_name,
    terms.policies,
    terms.terms_and_condition,
    terms.banking_details,
    terms.footer,
  ].every((value) => Boolean(value?.trim()));
}

function resolveTemplateType(service?: string, serviceType?: string): ComposeTemplateType | undefined {
  if (service === "REGULATORY") return "BUSINESS SOLUTION";
  if (serviceType === "IMPORT" || serviceType === "EXPORT") return serviceType;
  return undefined;
}

export function MakeQuotationPage() {
  return (
    <MakeQuotationProvider>
      <MakeQuotationPageContent />
    </MakeQuotationProvider>
  );
}

function MakeQuotationPageContent() {
  const navigate = useNavigate();
  const { state, actions, meta } = useMakeQuotationContext();
  const userResource = useAuthStore((store) => store.user);
  const currentUserName = userResource ? `${userResource.first_name} ${userResource.last_name}` : undefined;
  const currentUserPositionTitle = userResource?.role;
  const templateType = resolveTemplateType(state.clientInfo?.services, state.serviceInfo?.serviceType ?? state.serviceInfo?.regulatoryServiceType);
  const { data: templates = [], isLoading: templatesLoading } = useComposeQuotationTemplates(templateType);
  const { data: quotationTemplate, isLoading: templateLoading } = useComposeQuotationTemplate(state.templateId ?? undefined);
  const { data: quotation } = useQuery({
    queryKey: quotationQueryKeys.quotationDetails(state.quotationId ?? undefined),
    queryFn: () => fetchQuotation(state.quotationId!),
    enabled: Boolean(state.quotationId),
  });
  const { data: clientInformationFields = [] } = useComposeQuotationClientInputs(state.quotationId ?? undefined, quotationTemplate?.id);

  function handleBack() {
    if (state.step === 0) {
      navigate("/quotations/requested");
      return;
    }
    if (state.step === 1 && state.serviceSubStep === "service") {
      actions.goToStep(0);
      return;
    }
    if (state.step === 1 && state.serviceSubStep === "documents") {
      actions.goToServiceSubStep("service");
      return;
    }
    if (state.step === 2 && state.showTemplateSelection) {
      const proceed = window.confirm("Going back will not undo the quotation already created in the backend. Continue?");
      if (proceed) actions.resetCreatedQuotationSelection();
      return;
    }
    if (state.step === 2) {
      actions.returnToTemplateSelection();
      return;
    }
    if (state.step === 3) {
      actions.goToStep(2);
      return;
    }
    actions.goToStep(3);
  }

  function handleStepClick(index: number) {
    if (index >= state.step) return;
    if (index === 0) actions.goToStep(0);
    if (index === 1) {
      actions.goToStep(1);
      actions.goToServiceSubStep("service");
    }
    if (index >= 2) actions.goToStep(index);
  }

  const showComposeContent = state.step >= 2 && !state.showTemplateSelection;

  return (
    <PageCard title="MAKE QUOTATION" fullHeight onBack={handleBack} showDivider>
      <Stack gap="md" style={{ minHeight: "100%" }}>
        <StepperBar step={state.step} onStepClick={handleStepClick} labels={MAKE_QUOTATION_STEP_LABELS} />
        {state.step === 0 && <ClientInformationForm defaultValues={state.clientInfo ?? undefined} onSubmit={actions.submitClientInfo} onValidityChange={actions.setIsStep0Valid} />}
        {state.step === 1 && state.serviceSubStep === "service" && state.clientInfo?.services === "LOGISTICS" && <LogisticsServiceForm />}
        {state.step === 1 && state.serviceSubStep === "service" && state.clientInfo?.services === "REGULATORY" && <RegulatoryServiceForm />}
        {state.step === 1 && state.serviceSubStep === "documents" && <DocumentChecklistStep />}
        {state.step === 2 && state.showTemplateSelection && (
          <Box pt="md">
            <Group justify="space-between" mb="md"><Text fw={800}>SELECT QUOTATION TEMPLATE</Text>{templatesLoading && <Loader size="sm" />}</Group>
            <TemplateSelector templates={templates.map((template) => ({ id: template.id, name: template.name, enabled: true }))} onSelect={actions.selectTemplate} />
          </Box>
        )}
        {showComposeContent && (!quotationTemplate || templateLoading) && (
          <Group justify="center" py="xl"><Loader /></Group>
        )}
        {showComposeContent && quotationTemplate && (
          <Box style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
            <ComposeStepContent
              step={state.step - 2}
              quotationTemplate={quotationTemplate}
              quotation={quotation}
              clientInformationFields={clientInformationFields}
              quotationDetailsData={state.quotationDetailsData}
              billingDetailsData={state.billingDetailsData}
              termsData={state.termsData}
              signatoryData={state.signatoryData}
              previewReady={state.previewReady}
              canRenderTermsStep={Boolean(state.quotationDetailsData && state.billingDetailsData)}
              quotationDetailsFormId={meta.quotationDetailsFormId}
              billingDetailsFormId={meta.billingDetailsFormId}
              onStep0Submit={(values) => { actions.setQuotationDetailsData(values); actions.goToStep(3); }}
              onStep1Submit={(values) => { actions.setBillingDetailsData(values); actions.goToStep(4); }}
              onStep0Change={actions.setQuotationDetailsData}
              onStep1Change={actions.setBillingDetailsData}
              onStep0ValidityChange={actions.setIsStep2Valid}
              onStep1ValidityChange={actions.setIsStep3Valid}
              onTermsChange={actions.setTermsData}
            />
            <ComposeStepActions
              step={state.step - 2}
              isStep0Valid={state.isStep2Valid}
              isStep1Valid={state.isStep3Valid}
              canProceedStep2={isTermsComplete(state.termsData)}
              previewReady={state.previewReady}
              isSending={state.isSending}
              quotationDetailsFormId={meta.quotationDetailsFormId}
              billingDetailsFormId={meta.billingDetailsFormId}
              onStep2Next={actions.openSignatory}
              onOpenSendConfirm={actions.openSendConfirm}
            />
          </Box>
        )}
      </Stack>
      <AuthorizedSignatoryModal opened={meta.signatoryOpened} onClose={actions.closeSignatory} onSave={actions.setSignatoryData} currentUserName={currentUserName} currentUserPositionTitle={currentUserPositionTitle} initialValues={state.signatoryData} />
      <ComposeSendModals sendConfirmOpened={meta.sendConfirmOpened} sendSuccessOpened={meta.sendSuccessOpened} isSending={state.isSending} onCloseSendConfirm={actions.closeSendConfirm} onSend={actions.submitSend} onCloseSendSuccess={actions.closeSendSuccess} />
    </PageCard>
  );
}
