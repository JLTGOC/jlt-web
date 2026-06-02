import type {
  BillingDetailsValues,
  ChargeRow,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type {
  ClientInformationValue,
  QuotationTemplate,
  QuotationViewerState,
} from "@/features/quotations/types/compose.types";
import type {
  IssuedQuotationResource,
  QuotationResource,
} from "@/features/quotations/types/quotations.types";
import { RATE_VALIDITY_FIELD } from "@/features/quotations/utils/quotationDetailFields";

interface BuildViewerStateFromIssuedQuotationParams {
  quotation: QuotationResource;
  template: QuotationTemplate;
  issuedQuotation: IssuedQuotationResource;
}

function parseAmount(value: number | string | null | undefined): number | null {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function mapQuotationDetails(
  template: QuotationTemplate,
  issuedQuotation: IssuedQuotationResource,
): QuotationDetailsValues {
  const detailValuesByLabel = new Map(
    (issuedQuotation.quotation_details ?? []).map((detail) => [
      detail.label,
      detail.value,
    ]),
  );

  const customFields: Record<string, string> = {};
  template.custom_fields.forEach((field) => {
    if (
      field.id === RATE_VALIDITY_FIELD.id ||
      field.label === RATE_VALIDITY_FIELD.label
    ) {
      return;
    }

    customFields[field.id] = detailValuesByLabel.get(field.label) ?? "";
  });

  return {
    subject: issuedQuotation.subject ?? "",
    message: issuedQuotation.message ?? "",
    rate_validity: issuedQuotation.rate_validity ?? "",
    custom_fields: customFields,
  };
}

function mapBillingDetails(
  template: QuotationTemplate,
  issuedQuotation: IssuedQuotationResource,
): BillingDetailsValues {
  const sections: Record<string, ChargeRow[]> = {};
  const currency = issuedQuotation.currency ?? "";
  const uom = issuedQuotation.uom ?? "";

  template.billing_sections.forEach((section) => {
    sections[section.id] = [];
  });

  const charges = issuedQuotation.billing_details?.charges ?? [];

  charges.forEach((charge) => {
    const matchingSection = template.billing_sections.find(
      (section) => section.title === charge.name,
    );

    if (!matchingSection) {
      return;
    }

    const rows: ChargeRow[] = (charge.items ?? []).map((item) => ({
      description: item.receipt_charge_label ?? "",
      currency,
      uom: item.uom_label ?? uom,
      quantity: parseAmount(item.quantity),
      container_size: item.container_size ?? "",
      amount: parseAmount(item.amount),
    }));

    sections[matchingSection.id] = rows;
  });

  return { currency, uom, sections };
}

function mapTerms(issuedQuotation: IssuedQuotationResource): TermsValues {
  const standardConfig = issuedQuotation.standard_config;

  return {
    template_id: String(issuedQuotation.template_id ?? ""),
    template_name: standardConfig?.name ?? "",
    policies: standardConfig?.policies ?? "",
    terms_and_condition: standardConfig?.terms_and_conditions ?? "",
    banking_details: standardConfig?.banking_details ?? "",
    footer: standardConfig?.footer ?? "",
  };
}

function mapSignatory(
  issuedQuotation: IssuedQuotationResource,
): SignatoryValues & { signature_file_url?: string | null } {
  const signatory = issuedQuotation.signatory;

  return {
    complementary_close: signatory?.closing_statement ?? "",
    is_authorized_signatory: Boolean(signatory?.is_authorized_signatory),
    authorized_signatory_name: signatory?.authorized_signatory_name ?? "",
    position_title: signatory?.position ?? "",
    signature_file: null,
    signature_file_url: signatory?.signature_file_path ?? null,
  };
}

function mapClientInformationFields(
  issuedQuotation: IssuedQuotationResource,
): ClientInformationValue[] {
  return (issuedQuotation.client_inputs ?? []).map((input) => ({
    label: input.label,
    value: input.value,
  }));
}

export function buildViewerStateFromIssuedQuotation({
  quotation,
  template,
  issuedQuotation,
}: BuildViewerStateFromIssuedQuotationParams): QuotationViewerState {
  return {
    quotation,
    template,
    clientInformationFields: mapClientInformationFields(issuedQuotation),
    quotationDetails: mapQuotationDetails(template, issuedQuotation),
    billingDetails: mapBillingDetails(template, issuedQuotation),
    terms: mapTerms(issuedQuotation),
    signatory: mapSignatory(issuedQuotation),
  };
}
