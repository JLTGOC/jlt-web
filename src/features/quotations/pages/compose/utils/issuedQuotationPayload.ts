import type {
  BillingDetailsValues,
  QuotationDetailsValues,
  SignatoryValues,
  TermsValues,
} from "@/features/quotations/schemas/compose.schema";
import type { QuotationTemplate } from "@/features/quotations/types/compose.types";
import { hasChargeContent } from "@/features/quotations/utils/billing";
import {
  isRateValidityField,
  RATE_VALIDITY_FIELD,
} from "@/features/quotations/utils/quotationDetailFields";

interface BuildIssuedQuotationFormDataParams {
  template: QuotationTemplate;
  quotationDetails: QuotationDetailsValues;
  billingDetails: BillingDetailsValues;
  terms: TermsValues;
  signatory: SignatoryValues;
  issuedQuotationFile: File;
}

export function buildIssuedQuotationFormData({
  template,
  quotationDetails,
  billingDetails,
  terms,
  signatory,
  issuedQuotationFile,
}: BuildIssuedQuotationFormDataParams): FormData {
  const formData = new FormData();

  formData.append("template_id", template.id);
  formData.append("subject", quotationDetails.subject?.trim() ?? "");
  formData.append("message", quotationDetails.message?.trim() ?? "");

  const detailFields = [
    ...template.custom_fields.filter((field) => !isRateValidityField(field)),
    RATE_VALIDITY_FIELD,
  ];

  detailFields.forEach((field, fieldIndex) => {
    formData.append(`detail_values[${fieldIndex}][label]`, field.label);
    formData.append(
      `detail_values[${fieldIndex}][value]`,
      field.id === RATE_VALIDITY_FIELD.id
        ? (quotationDetails.rate_validity?.trim() ?? "")
        : (quotationDetails.custom_fields?.[field.id]?.trim() ?? ""),
    );
  });

  const chargeSections = template.billing_sections
    .map((section) => ({
      section,
      rows: (billingDetails.sections?.[section.id] ?? []).filter(
        hasChargeContent,
      ),
    }))
    .filter(({ rows }) => rows.length > 0);

  chargeSections.forEach(({ section, rows }, sectionIndex) => {
    formData.append(`charges[${sectionIndex}][name]`, section.title);

    rows.forEach((row, rowIndex) => {
      formData.append(
        `charges[${sectionIndex}][items][${rowIndex}][receipt_charge_label]`,
        row.description?.trim() ?? "",
      );
      formData.append(
        `charges[${sectionIndex}][items][${rowIndex}][currency_label]`,
        row.currency?.trim() ?? "",
      );
      formData.append(
        `charges[${sectionIndex}][items][${rowIndex}][uom_label]`,
        row.uom?.trim() ?? "",
      );
      formData.append(
        `charges[${sectionIndex}][items][${rowIndex}][amount]`,
        row.amount == null ? "" : String(row.amount),
      );
    });
  });

  formData.append("standard_config[name]", terms.template_name?.trim() ?? "");
  formData.append("standard_config[policies]", terms.policies?.trim() ?? "");
  formData.append(
    "standard_config[terms_and_conditions]",
    terms.terms_and_condition?.trim() ?? "",
  );
  formData.append(
    "standard_config[banking_details]",
    terms.banking_details?.trim() ?? "",
  );
  formData.append("standard_config[footer]", terms.footer?.trim() ?? "");

  formData.append(
    "signatory[closing_statement]",
    signatory.complementary_close.trim(),
  );
  formData.append(
    "signatory[is_authorized_signatory]",
    signatory.is_authorized_signatory ? "1" : "0",
  );
  formData.append(
    "signatory[authorized_signatory_name]",
    signatory.authorized_signatory_name.trim(),
  );
  formData.append("signatory[position]", signatory.position_title.trim());

  if (signatory.signature_file) {
    formData.append("signatory[signature_file]", signatory.signature_file);
  }

  formData.append("issued_quotation_file", issuedQuotationFile);

  return formData;
}
