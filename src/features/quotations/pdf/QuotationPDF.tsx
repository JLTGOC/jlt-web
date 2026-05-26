import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { QuotationPDFBillingSection } from "@/features/quotations/pdf/components/QuotationPDFBillingSection";
import { quotationPdfStyles as styles } from "@/features/quotations/pdf/quotationPdf.styles";
import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import { formatQuotationAmount } from "@/features/quotations/utils/billingPresentation";
import { buildQuotationDocumentViewModel } from "@/features/quotations/utils/quotationDocumentViewModel";
import {
  formatQuotationDetailDate,
  isRateValidityField,
  RATE_VALIDITY_FIELD,
} from "@/features/quotations/utils/quotationDetailFields";

interface QuotationPDFProps {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields?: ClientInformationValue[];
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
  logoSrc: string;
  signatorySignatureSrc?: string | null;
}

function formatAmount(amount?: number | null): string {
  return formatQuotationAmount(amount);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function QuotationPDF({
  quotation,
  template,
  clientInformationFields,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
  logoSrc,
  signatorySignatureSrc,
}: QuotationPDFProps) {
  const documentViewModel = buildQuotationDocumentViewModel({
    quotation,
    template,
    clientInformationFields,
    billingDetails,
    terms,
    signatory,
  });
  const resolvedSignatorySignatureSrc =
    signatorySignatureSrc ?? documentViewModel.signatory.signatureFileUrl;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={logoSrc} style={styles.logo} />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>
              Jill L. Tolentino Customs Brokerage
            </Text>
            <Text>Suite 508-A Pacific Centre 460 Quintin Paredes St.</Text>
            <Text>
              Brgy. 289 Binondo Manila 1006 Philippines (632) 8372 77557 |
              sales@jltcb.com
            </Text>
            <Text>TIN: 705-285-319-000</Text>
          </View>
        </View>

        <Text style={{ marginBottom: 10 }}>
          {formatDate(new Date().toISOString())}
        </Text>

        <View style={{ marginBottom: 8 }}>
          <View style={styles.fieldRow}>
            <Text style={styles.label}>To:</Text>
            <Text style={styles.fieldValue}>{quotation.client?.full_name ?? "—"}</Text>
          </View>
          {quotation.client?.company_name ? (
            <View style={styles.fieldRow}>
              <Text style={styles.label} />
              <Text style={styles.fieldValue}>
                {quotation.client.company_name}
              </Text>
            </View>
          ) : null}
          {quotation.client?.contact_number ? (
            <View style={styles.fieldRow}>
              <Text style={styles.label} />
              <Text style={styles.fieldValue}>
                {quotation.client.contact_number}
              </Text>
            </View>
          ) : null}
          {quotation.client?.email ? (
            <View style={styles.fieldRow}>
              <Text style={styles.label} />
              <Text style={styles.fieldValue}>{quotation.client.email}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.label}>Reference No:</Text>
          <Text style={styles.fieldValue}>{quotation.reference_number}</Text>
        </View>

        <View style={[styles.fieldRow, { marginBottom: 10 }]}>
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.fieldValue}>{quotationDetails.subject}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={{ marginBottom: 14, marginTop: 6 }}>
          {quotationDetails.message}
        </Text>

        {documentViewModel.resolvedClientInformationFields.length > 0 && (
          <View style={styles.twoColumnFieldContainer}>
            {documentViewModel.resolvedClientInformationFields.map((field) => (
              <View key={field.id} style={styles.twoColumnField}>
                <Text style={styles.label}>{field.label}:</Text>
                <Text style={styles.fieldValue}>{field.value}</Text>
              </View>
            ))}
          </View>
        )}

        {quotationDetails.rate_validity ? (
          <View style={styles.fieldRow}>
            <Text style={styles.label}>{RATE_VALIDITY_FIELD.label}:</Text>
            <Text style={styles.fieldValue}>
              {formatQuotationDetailDate(quotationDetails.rate_validity)}
            </Text>
          </View>
        ) : null}

        {template.custom_fields.some(
          (field) => !isRateValidityField(field),
        ) && (
          <View style={styles.twoColumnFieldContainer}>
            {template.custom_fields
              .filter((field) => !isRateValidityField(field))
              .map((field) => (
                <View key={field.id} style={styles.twoColumnField}>
                  <Text style={styles.label}>{field.label}:</Text>
                  <Text style={styles.fieldValue}>
                    {quotationDetails.custom_fields?.[field.id] ?? "—"}
                  </Text>
                </View>
              ))}
          </View>
        )}

        {documentViewModel.billingSections.map((section) => {
          return (
            <QuotationPDFBillingSection
              key={section.id}
              sectionId={section.id}
              sectionTitle={section.title}
              currency={section.currency}
              uom={section.uom}
              rows={section.rows}
              total={section.total}
              styles={styles}
              formatAmount={formatAmount}
            />
          );
        })}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <Text style={styles.bold}>Estimated Total Landed Cost</Text>
          <Text style={styles.bold}>
            {formatAmount(documentViewModel.grandTotal)}
          </Text>
        </View>

        {documentViewModel.termsBlocks.map((block) => (
          <View key={block.key} style={{ marginBottom: 10 }}>
            <Text style={styles.bold}>{block.label}</Text>
            <Text>{block.content}</Text>
          </View>
        ))}

        <View style={styles.signatoryBlock} wrap={false}>
          <View style={styles.signatoryCol}>
            <Text>{documentViewModel.signatory.complementaryClose}</Text>
            {resolvedSignatorySignatureSrc ? (
              <Image
                src={resolvedSignatorySignatureSrc}
                style={styles.signature}
              />
            ) : null}
            <Text style={styles.bold}>
              {documentViewModel.signatory.authorizedSignatoryName?.toUpperCase()}
            </Text>
            <Text>{documentViewModel.signatory.positionTitle}</Text>
            <Text>{documentViewModel.signatory.companyName}</Text>
          </View>
          <View style={styles.signatoryCol}>
            <Text>CONFORME:</Text>
            <Text style={[styles.bold, { marginTop: 24 }]}>
              {documentViewModel.signatory.clientName.toUpperCase()}
            </Text>
            <Text>Client</Text>
          </View>
        </View>

        {documentViewModel.footer ? (
          <Text style={styles.footer}>{documentViewModel.footer}</Text>
        ) : null}
      </Page>
    </Document>
  );
}
