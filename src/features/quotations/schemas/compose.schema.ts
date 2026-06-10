import * as z from "zod";
import {
  hasAnyCharge,
  isPerContainerUom,
} from "@/features/quotations/utils/billing";

export const quotationDetailsFixedSchema = z.object({
  subject: z.string().optional(),
  message: z.string().optional(),
  rate_validity: z.string().optional(),
});

export const customFieldsSchema = z.record(z.string(), z.string().optional());

export const quotationDetailsSchema = quotationDetailsFixedSchema.merge(
  z.object({ custom_fields: customFieldsSchema.optional() }),
);

export type QuotationDetailsValues = z.infer<typeof quotationDetailsSchema>;

const nullableNumber = z.union([
  z.number().nullable(),
  z.literal("").transform((): null => null),
]);

export const chargeRowSchema = z.object({
  description: z.string().optional(),
  currency: z.string().optional(),
  uom: z.string().optional(),
  amount: nullableNumber.optional(),
  quantity: nullableNumber.optional(),
  container_size: z.string().optional(),
});

export type ChargeRow = z.infer<typeof chargeRowSchema>;

export const billingDetailsSchema = z
  .object({
    currency: z.string().optional(),
    uom: z.string().optional(),
    sections: z.record(z.string(), z.array(chargeRowSchema)).default({}),
  })
  .superRefine((values, context) => {
    if (!values.currency?.trim()) {
      context.addIssue({
        code: "custom",
        path: ["currency"],
        message: "Select a currency.",
      });
    }

    const hasAtLeastOneCharge = hasAnyCharge(values.sections);

    if (!hasAtLeastOneCharge) {
      context.addIssue({
        code: "custom",
        path: ["sections"],
        message: "Add at least one charge before continuing.",
      });
    }

    if (!isPerContainerUom(values.uom)) {
      return;
    }

    Object.entries(values.sections ?? {}).forEach(([sectionId, rows]) => {
      rows.forEach((row, rowIndex) => {
        if (
          !row.description?.trim() &&
          row.amount == null &&
          row.quantity == null &&
          !row.container_size?.trim()
        ) {
          return;
        }

        if (!row.uom?.trim()) {
          context.addIssue({
            code: "custom",
            path: ["sections", sectionId, rowIndex, "uom"],
            message: "Select a unit of measurement for this charge.",
          });
        }

        if (!row.quantity || row.quantity <= 0) {
          context.addIssue({
            code: "custom",
            path: ["sections", sectionId, rowIndex, "quantity"],
            message: "Quantity is required for per container.",
          });
        }

        if (!row.container_size?.trim()) {
          context.addIssue({
            code: "custom",
            path: ["sections", sectionId, rowIndex, "container_size"],
            message: "Container size is required for per container.",
          });
        }
      });
    });
  });

export type BillingDetailsValues = z.infer<typeof billingDetailsSchema>;

export const termsSchema = z.object({
  template_id: z.string(),
  template_name: z.string(),
  policies: z.string().optional(),
  terms_and_condition: z.string().optional(),
  banking_details: z.string().optional(),
  footer: z.string().optional(),
});

export type TermsValues = z.infer<typeof termsSchema>;

export const signatorySchema = z.object({
  complementary_close: z.string().min(1, "Complementary close is required"),
  is_authorized_signatory: z.boolean().default(false),
  authorized_signatory_name: z.string().min(1, "Name is required"),
  position_title: z.string().min(1, "Position/Title is required"),
  signature_file: z.instanceof(File).nullable().optional(),
});

export type SignatoryValues = z.infer<typeof signatorySchema>;
