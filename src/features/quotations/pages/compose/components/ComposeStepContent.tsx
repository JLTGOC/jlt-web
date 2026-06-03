import { Box } from "@mantine/core";
import { QuotationPreview } from "@/features/quotations/components/QuotationPreview";
import { ScaledA4PreviewFrame } from "@/features/quotations/components/ScaledA4PreviewFrame";
import { BillingDetailsForm } from "@/features/quotations/pages/compose/BillingDetailsForm";
import { ComposeStepLoader } from "@/features/quotations/pages/compose/components/ComposeStepLoader";
import { QuotationDetailsForm } from "@/features/quotations/pages/compose/QuotationDetailsForm";
import { TermsStep } from "@/features/quotations/pages/compose/TermsStep";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
  ViewerSignatoryValues,
} from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import classes from "./ComposeStepContent.module.css";

interface ComposeStepContentProps {
  step: number;
  quotationTemplate: QuotationTemplate;
  quotation?: QuotationResource;
  clientInformationFields?: ClientInformationValue[];
  quotationDetailsData: QuotationDetailsValues | null;
  billingDetailsData: BillingDetailsValues | null;
  termsData: TermsValues | null;
  signatoryData: ViewerSignatoryValues | null;
  previewReady: boolean;
  canRenderTermsStep: boolean;
  quotationDetailsFormId: string;
  billingDetailsFormId: string;
  onStep0Submit: (values: QuotationDetailsValues) => void;
  onStep1Submit: (values: BillingDetailsValues) => void;
  onStep0Change: (values: QuotationDetailsValues) => void;
  onStep1Change: (values: BillingDetailsValues) => void;
  onStep0ValidityChange: (isValid: boolean) => void;
  onStep1ValidityChange: (isValid: boolean) => void;
  onTermsChange: (values: TermsValues) => void;
  readOnly?: boolean;
}

export function ComposeStepContent({
  step,
  quotationTemplate,
  quotation,
  clientInformationFields,
  quotationDetailsData,
  billingDetailsData,
  termsData,
  signatoryData,
  previewReady,
  canRenderTermsStep,
  quotationDetailsFormId,
  billingDetailsFormId,
  onStep0Submit,
  onStep1Submit,
  onStep0Change,
  onStep1Change,
  onStep0ValidityChange,
  onStep1ValidityChange,
  onTermsChange,
  readOnly,
}: ComposeStepContentProps) {
  const previewProps =
    quotation &&
    quotationDetailsData &&
    billingDetailsData &&
    termsData &&
    signatoryData
      ? {
          quotation,
          quotationDetails: quotationDetailsData,
          billingDetails: billingDetailsData,
          terms: termsData,
          signatory: signatoryData,
        }
      : null;

  const isWaitingForQuotation =
    previewReady &&
    !quotation &&
    Boolean(
      quotationDetailsData && billingDetailsData && termsData && signatoryData,
    );

  return (
    <Box
      pt="md"
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {step === 0 && (
        <Box className={classes.stepScrollArea}>
          <QuotationDetailsForm
            id={quotationDetailsFormId}
            template={quotationTemplate}
            defaultValues={quotationDetailsData ?? undefined}
            onSubmit={onStep0Submit}
            onChange={onStep0Change}
            onValidityChange={onStep0ValidityChange}
            readOnly={readOnly}
          />
        </Box>
      )}

      {step === 1 && (
        <Box className={classes.stepScrollArea}>
          <BillingDetailsForm
            id={billingDetailsFormId}
            template={quotationTemplate}
            defaultValues={billingDetailsData ?? undefined}
            onSubmit={onStep1Submit}
            onChange={onStep1Change}
            onValidityChange={onStep1ValidityChange}
            readOnly={readOnly}
          />
        </Box>
      )}

      {step === 2 &&
        (canRenderTermsStep ? (
          previewReady && previewProps ? (
            <ScaledA4PreviewFrame
              viewportClassName={classes.previewScrollArea}
              canvasClassName={classes.previewA4}
            >
              <QuotationPreview
                quotation={previewProps.quotation}
                template={quotationTemplate}
                clientInformationFields={clientInformationFields}
                quotationDetails={previewProps.quotationDetails}
                billingDetails={previewProps.billingDetails}
                terms={previewProps.terms}
                signatory={previewProps.signatory}
                dateGenerated={previewProps.quotation.created_at}
                mode="viewer"
              />
            </ScaledA4PreviewFrame>
          ) : isWaitingForQuotation ? (
            <ComposeStepLoader
              label="Loading quotation preview..."
              minHeight="14rem"
            />
          ) : (
            <Box className={classes.stepScrollArea}>
              <TermsStep onChange={onTermsChange} savedData={termsData} />
            </Box>
          )
        ) : (
          <div>Terms and Conditions - coming soon</div>
        ))}
    </Box>
  );
}
