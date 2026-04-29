import type {
  DetailsConfigApi,
  QuotationTemplateDetailsApi,
  QuotationTemplateSummaryApi,
} from "@/features/quotations/api/quotations-api/compose.api";
import type {
  CustomField,
  QuotationTemplate,
} from "@/features/quotations/types/compose.types";

export function toComposeFieldType(
  detailsType: DetailsConfigApi["type"],
): CustomField["type"] {
  if (detailsType === "DROPDOWN") {
    return "select";
  }

  if (detailsType === "DATE PICKER") {
    return "date";
  }

  return "text";
}

export function mapQuotationTemplateSummaryToComposeTemplate(
  template: QuotationTemplateSummaryApi,
): QuotationTemplate {
  return {
    id: String(template.id),
    name: template.name,
    client_information_fields: [],
    custom_fields: [],
    billing_sections: [],
  };
}

export function mapQuotationTemplateDetailToComposeTemplate(
  template: QuotationTemplateDetailsApi,
): QuotationTemplate {
  return {
    id: String(template.id),
    name: template.name,
    client_information_fields: [],
    custom_fields: template.detail_configs.map((detail) => ({
      id: `field-${detail.id}`,
      label: detail.label,
      type: toComposeFieldType(detail.type),
      options: detail.dropdown_options?.map((option) => option.name) ?? [],
    })),
    billing_sections: template.template_charges.map((charge) => ({
      id: `section-${charge.id}`,
      title: charge.name,
      available_charges: charge.receipt_charge_options.map(
        (option) => option.label,
      ),
    })),
  };
}
