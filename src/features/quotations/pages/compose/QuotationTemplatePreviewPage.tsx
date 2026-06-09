import { Box, Group } from "@mantine/core";
import { ArrowForward } from "@nine-thirty-five/material-symbols-react/rounded";
import { useState } from "react";
import { useParams } from "react-router";
import { PageCard } from "@/components/PageCard";
import { AppButton } from "@/components/ui/AppButton";
import { StepperBar } from "@/features/quotations/components/StepperBar";
import { useComposeQuotationTemplate } from "@/features/quotations/hooks/useComposeReferenceData";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { ComposeStepContent } from "@/features/quotations/pages/compose/components/ComposeStepContent";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";

const QUOTATION_DETAILS_FORM_ID = "quotation-details-preview-form";
const BILLING_DETAILS_FORM_ID = "billing-details-preview-form";

export function QuotationTemplatePreviewPage() {
  const { templateId } = useParams();
  const { data: quotationTemplate, isLoading } =
    useComposeQuotationTemplate(templateId);
  const [step, setStep] = useState(0);

  const handleQuotationDetailsSubmit = (_values: QuotationDetailsValues) => {
    void _values;
  };
  const handleBillingDetailsSubmit = (_values: BillingDetailsValues) => {
    void _values;
  };
  const handleQuotationDetailsChange = (_values: QuotationDetailsValues) => {
    void _values;
  };
  const handleBillingDetailsChange = (_values: BillingDetailsValues) => {
    void _values;
  };
  const handleTermsChange = (_values: TermsValues) => {
    void _values;
  };

  if (isLoading) {
    return (
      <PageCard title="Template Preview" fullHeight>
        <ComposeStepLoader label="Loading template preview..." />
      </PageCard>
    );
  }

  if (!quotationTemplate) {
    return (
      <PageCard title="Template Preview" fullHeight>
        <Box p="md">Template not found.</Box>
      </PageCard>
    );
  }

  return (
    <PageCard
      title="Template Preview"
      subtext={quotationTemplate.name}
      fullHeight
      bodyPx={0}
      bodyPy={0}
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
        <StepperBar
          step={step}
          onStepClick={(index) => {
            if (index < step) {
              setStep(index);
            }
          }}
        />

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
            quotationDetailsData={null}
            billingDetailsData={null}
            termsData={null}
            signatoryData={null}
            previewReady={false}
            canRenderTermsStep={false}
            quotationDetailsFormId={QUOTATION_DETAILS_FORM_ID}
            billingDetailsFormId={BILLING_DETAILS_FORM_ID}
            onStep0Submit={handleQuotationDetailsSubmit}
            onStep1Submit={handleBillingDetailsSubmit}
            onStep0Change={handleQuotationDetailsChange}
            onStep1Change={handleBillingDetailsChange}
            onStep0ValidityChange={() => {}}
            onStep1ValidityChange={() => {}}
            onTermsChange={handleTermsChange}
            readOnly
          />

          {step === 0 && (
            <Group
              justify="flex-end"
              mt="lg"
              style={{ marginTop: "auto", flexShrink: 0 }}
            >
              <AppButton
                variant="primary"
                onClick={() => setStep(1)}
                w="10rem"
                icon={ArrowForward}
              >
                Next
              </AppButton>
            </Group>
          )}
        </Box>
      </Box>
    </PageCard>
  );
}
