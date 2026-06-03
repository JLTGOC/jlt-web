import {
  Box,
  Divider,
  Group,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { useEffect, useMemo } from "react";
import jltLogo from "@/assets/logos/word-dark.png";
import { QuotationPreviewBillingSection } from "@/features/quotations/components/preview/QuotationPreviewBillingSection";
import { QuotationPreviewSignatory } from "@/features/quotations/components/preview/QuotationPreviewSignatory";
import { QuotationPreviewTermsBlocks } from "@/features/quotations/components/preview/QuotationPreviewTermsBlocks";
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
import { formatQuotationAmount } from "@/features/quotations/utils/billingPresentation";
import { buildQuotationDocumentViewModel } from "@/features/quotations/utils/quotationDocumentViewModel";
import {
  formatQuotationDetailDate,
  isRateValidityField,
  RATE_VALIDITY_FIELD,
} from "@/features/quotations/utils/quotationDetailFields";
import classes from "./QuotationPreview.module.css";

interface QuotationPreviewProps {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields?: ClientInformationValue[];
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: ViewerSignatoryValues;
  dateGenerated?: string;
  mode?: "default" | "viewer";
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number | null | undefined): string {
  return formatQuotationAmount(amount);
}

export function QuotationPreview({
  quotation,
  template,
  clientInformationFields,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
  dateGenerated,
  mode = "default",
}: QuotationPreviewProps) {
  const documentViewModel = useMemo(
    () =>
      buildQuotationDocumentViewModel({
        quotation,
        template,
        clientInformationFields,
        billingDetails,
        terms,
        signatory,
      }),
    [
      quotation,
      template,
      clientInformationFields,
      billingDetails,
      terms,
      signatory,
    ],
  );
  const hasSignatureFile = Boolean(documentViewModel.signatory.signatureFile);
  const signaturePreviewUrl = useMemo(() => {
    if (documentViewModel.signatory.signatureFile) {
      return URL.createObjectURL(documentViewModel.signatory.signatureFile);
    }

    return documentViewModel.signatory.signatureFileUrl;
  }, [
    documentViewModel.signatory.signatureFile,
    documentViewModel.signatory.signatureFileUrl,
  ]);

  useEffect(() => {
    return () => {
      if (hasSignatureFile && signaturePreviewUrl) {
        URL.revokeObjectURL(signaturePreviewUrl);
      }
    };
  }, [hasSignatureFile, signaturePreviewUrl]);

  const generatedDateLabel = useMemo(
    () => formatDate(dateGenerated ?? new Date().toISOString()),
    [dateGenerated],
  );

  return (
    <Box
      className={mode === "viewer" ? classes.wrapperViewer : classes.wrapper}
    >
      <Box
        className={
          mode === "viewer" ? classes.documentViewer : classes.document
        }
      >
        <Group justify="space-between" align="flex-start" mb="xl">
          <Image src={jltLogo} w="8rem" />
          <Stack gap={2} align="flex-end">
            <Text fw={700} tt="uppercase" size="xs">
              Jill L. Tolentino Customs Brokerage
            </Text>
            <Text size="xs">
              Suite 508-A Pacific Centre 460 Quintin Paredes St.
            </Text>
            <Text size="xs">
              Brgy. 289 Binondo Manila 1006 Philippines (632) 8372 77557 |
              sales@jltcb.com
            </Text>
            <Text size="xs">TIN: 705-285-319-000</Text>
          </Stack>
        </Group>

        <Text size="xs" mb="md">
          {generatedDateLabel}
        </Text>

        <Stack gap={0} mb="md">
          <Group gap="xs">
            <Text size="xs" w="3rem">
              To:
            </Text>
            <Text size="xs">{quotation.client?.full_name ?? "—"}</Text>
          </Group>
          {quotation.client?.company_name && (
            <Text size="xs" ml="3rem">
              {quotation.client.company_name}
            </Text>
          )}
          {quotation.client?.contact_number && (
            <Text size="xs" ml="3rem">
              {quotation.client.contact_number}
            </Text>
          )}
          {quotation.client?.email && (
            <Text size="xs" ml="3rem">
              {quotation.client.email}
            </Text>
          )}
        </Stack>

        <Group gap="xs" mb="xs">
          <Text size="xs" fw={500} w="6rem" style={{ flexShrink: 0 }}>
            Reference No:
          </Text>
          <Text size="xs">{quotation.reference_number}</Text>
        </Group>

        <Group gap="xs" mb="md">
          <Text size="xs" fw={500} w="6rem" style={{ flexShrink: 0 }}>
            Subject:
          </Text>
          <Text size="xs">{quotationDetails.subject}</Text>
        </Group>

        <Divider mb="md" />

        <Text size="xs" mb="lg" style={{ whiteSpace: "pre-wrap" }}>
          {quotationDetails.message}
        </Text>

        {documentViewModel.resolvedClientInformationFields.length > 0 && (
          <SimpleGrid
            cols={2}
            mb={
              template.custom_fields.some(
                (field) => !isRateValidityField(field),
              )
                ? "xs"
                : "lg"
            }
            spacing="xs"
          >
            {documentViewModel.resolvedClientInformationFields.map((field) => (
              <Group key={field.id} gap="xs" align="flex-start">
                <Text
                  size="xs"
                  c="dimmed"
                  tt={"capitalize"}
                  style={{ flexShrink: 0 }}
                  className={classes.noWordBreak}
                >
                  {field.label}:
                </Text>
                <Text
                  size="xs"
                  fw={500}
                  tt={"capitalize"}
                  className={classes.noWordBreak}
                >
                  {field.value}
                </Text>
              </Group>
            ))}
          </SimpleGrid>
        )}

        {quotationDetails.rate_validity ? (
          <Group gap="xs" mb="lg">
            <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
              {RATE_VALIDITY_FIELD.label}:
            </Text>
            <Text size="xs" fw={500} className={classes.noWordBreak}>
              {formatQuotationDetailDate(quotationDetails.rate_validity)}
            </Text>
          </Group>
        ) : null}

        {template.custom_fields.some(
          (field) => !isRateValidityField(field),
        ) && (
          <SimpleGrid cols={2} mb="lg" spacing="xs">
            {template.custom_fields
              .filter((field) => !isRateValidityField(field))
              .map((field) => (
                <Group key={field.id} gap="xs" align="flex-start">
                  <Text
                    size="xs"
                    c="dimmed"
                    style={{ flexShrink: 0 }}
                    className={classes.noWordBreak}
                  >
                    {field.label}:
                  </Text>
                  <Text size="xs" fw={500} className={classes.noWordBreak}>
                    {quotationDetails.custom_fields?.[field.id] ?? "—"}
                  </Text>
                </Group>
              ))}
          </SimpleGrid>
        )}

        {documentViewModel.billingSections.map((section) => {
          return (
            <QuotationPreviewBillingSection
              key={section.id}
              sectionId={section.id}
              sectionTitle={section.title}
              currency={section.currency}
              uom={section.uom}
              rows={section.rows}
              sectionTotal={section.total}
              formatAmount={formatAmount}
            />
          );
        })}

        <Group justify="space-between" mb="xl" px="xs">
          <Text size="xs" fw={700} tt="uppercase">
            Estimated Total Landed Cost
          </Text>
          <Text size="xs" fw={700}>
            {formatAmount(documentViewModel.grandTotal)}
          </Text>
        </Group>

        <QuotationPreviewTermsBlocks blocks={documentViewModel.termsBlocks} />

        <QuotationPreviewSignatory
          complementaryClose={documentViewModel.signatory.complementaryClose}
          authorizedSignatoryName={
            documentViewModel.signatory.authorizedSignatoryName
          }
          positionTitle={documentViewModel.signatory.positionTitle}
          companyName={documentViewModel.signatory.companyName}
          clientName={documentViewModel.signatory.clientName}
          signaturePreviewUrl={signaturePreviewUrl}
        />

        {documentViewModel.footer && (
          <Text size="xs" ta="center" c="dimmed" mt="xl">
            {documentViewModel.footer}
          </Text>
        )}
      </Box>
    </Box>
  );
}
