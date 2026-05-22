import type {
  BillingDetailsValues,
  ChargeRow,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
  ViewerSignatoryValues,
} from "@/features/quotations/types/compose.types";
import type { QuotationResource } from "@/features/quotations/types/quotations.types";
import {
  getBillingGrandTotal,
  getBillingSectionsWithCharges,
  getRowsTotalWithGlobalUom,
} from "@/features/quotations/utils/billing";
import {
  resolveClientInformationFields,
  type ResolvedClientInformationField,
} from "@/features/quotations/utils/clientInformationFields";

const SIGNATORY_COMPANY_NAME = "Jill L. Tolentino Customs Brokerage";

const TERMS_BLOCKS = [
  { key: "policies", label: "Policies" },
  { key: "terms_and_condition", label: "Terms and Conditions" },
  { key: "banking_details", label: "Banking Details" },
] as const;

type TermsBlockKey = (typeof TERMS_BLOCKS)[number]["key"];

export interface QuotationDocumentTermsBlock {
  key: TermsBlockKey;
  label: string;
  content: string;
}

export interface QuotationDocumentBillingSection {
  id: string;
  title: string;
  currency: string;
  uom: string;
  rows: ChargeRow[];
  total: number;
}

export interface QuotationDocumentSignatory {
  complementaryClose: string;
  authorizedSignatoryName: string;
  positionTitle: string;
  signatureFile: SignatoryValues["signature_file"];
  signatureFileUrl: string | null;
  companyName: string;
  clientName: string;
}

interface BuildQuotationDocumentViewModelParams {
  quotation: QuotationResource;
  template: QuotationTemplate;
  clientInformationFields?: ClientInformationValue[];
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: ViewerSignatoryValues;
}

export interface QuotationDocumentViewModel {
  resolvedClientInformationFields: ResolvedClientInformationField[];
  billingSections: QuotationDocumentBillingSection[];
  grandTotal: number;
  termsBlocks: QuotationDocumentTermsBlock[];
  footer: string | null;
  signatory: QuotationDocumentSignatory;
}

export function buildQuotationDocumentViewModel({
  quotation,
  template,
  clientInformationFields,
  billingDetails,
  terms,
  signatory,
}: BuildQuotationDocumentViewModelParams): QuotationDocumentViewModel {
  const resolvedClientInformationFields = resolveClientInformationFields(
    quotation,
    template.client_information_fields,
    clientInformationFields,
  );

  const billedSections = getBillingSectionsWithCharges(
    template,
    billingDetails,
  );

  const billingSections = billedSections.map(({ section, rows }) => ({
    id: section.id,
    title: section.title,
    currency: billingDetails.currency?.trim() ?? "",
    uom: billingDetails.uom?.trim() ?? "",
    rows,
    total: getRowsTotalWithGlobalUom(rows, billingDetails.uom),
  }));

  const termsBlocks = TERMS_BLOCKS.flatMap(({ key, label }) => {
    const content = terms[key];

    if (!content || !content.trim()) {
      return [];
    }

    return [{ key, label, content }];
  });

  return {
    resolvedClientInformationFields,
    billingSections,
    grandTotal: getBillingGrandTotal(billedSections, billingDetails.uom),
    termsBlocks,
    footer: terms.footer?.trim() ? terms.footer : null,
    signatory: {
      complementaryClose: signatory.complementary_close,
      authorizedSignatoryName: signatory.authorized_signatory_name,
      positionTitle: signatory.position_title,
      signatureFile: signatory.signature_file,
      signatureFileUrl: signatory.signature_file_url ?? null,
      companyName: SIGNATORY_COMPANY_NAME,
      clientName: quotation.client?.full_name ?? "",
    },
  };
}
