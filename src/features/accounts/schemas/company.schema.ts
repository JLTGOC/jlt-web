import * as z from "zod";
import { supportedIndustryIds } from "../types/company.types";

const nullableString = z.string().trim().optional().nullable();
const optionalStringArray = z.array(z.string().trim()).optional();
const nullableDateString = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value === "" ? null : value));

export const companySummarySchema = z.object({
  companyName: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Company Name to proceed"),
  ),
  tradeName: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Trade Name to proceed"),
  ),
  consigneeUsed: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Consignee Used to proceed"),
  ),
  accountHandler: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Account Handler to proceed"),
  ),
  accountHandlerId: nullableString,
  transactionType: nullableString,
  transactionTypeId: nullableString,
  clientClassification: nullableString,
  clientClassificationId: nullableString,
  companyType: nullableString,
  companyTypeId: nullableString,
  industry: nullableString,
  industryIds: z.array(z.string().trim()).optional().refine(
    (ids) => ids == null || ids.every((id) => supportedIndustryIds.includes(id as typeof supportedIndustryIds[number])),
    {
      message: "Invalid industry selected",
    },
  ),
  industryId: nullableString,
  businessType: nullableString,
  businessTypeId: nullableString,
  businessRegistrationNumber: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Business Registration Number to proceed"),
  ),
  website: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Website / Online Presence to proceed"),
  ),
  yearsInOperation: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Years in Operation to proceed"),
  ),
  dateOfActivation: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.string().trim().min(1, "Required Date of Activation to proceed"),
  ),
}).superRefine((data, ctx) => {
  const hasIndustry =
    (typeof data.industry === "string" && data.industry.trim() !== "") ||
    (Array.isArray(data.industryIds) && data.industryIds.length > 0) ||
    (typeof data.industryId === "string" && data.industryId.trim() !== "");

  if (!hasIndustry) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Required Industry to proceed",
      path: ["industry"],
    });
  }
});

export const companyAddressSchema = z.object({
  registeredAddress: nullableString,
  officeAddress: nullableString,
  warehouseAddresses: optionalStringArray,
  deliveryAddresses: optionalStringArray,
  portOfUsualEntryExit: nullableString,
  countryOfOrigin: nullableString,
  countryOfDestination: nullableString,
});

const companyContactPersonSchema = z
  .object({
    fullName: nullableString,
    position: nullableString,
    contactNumber: nullableString,
    email: nullableString,
  })
  .superRefine((contact, ctx) => {
    const contactFields = [contact.fullName, contact.position, contact.contactNumber, contact.email];
    const isAnyFieldFilled = contactFields.some(
      (value) => typeof value === "string" && value.trim() !== "",
    );

    if (!isAnyFieldFilled) {
      return;
    }

    if (!contact.fullName?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required Full Name to proceed",
        path: ["fullName"],
      });
    }
    if (!contact.position?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required Position to proceed",
        path: ["position"],
      });
    }
    if (!contact.contactNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required Contact Number to proceed",
        path: ["contactNumber"],
      });
    }
    if (!contact.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Required Email to proceed",
        path: ["email"],
      });
    } else if (!/^\S+@\S+\.\S+$/.test(contact.email.trim())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email must be valid",
        path: ["email"],
      });
    }
  });

export const companyKeyContactsSchema = z.object({
  primaryContact: companyContactPersonSchema.optional(),
  secondaryContact: companyContactPersonSchema.optional(),
  billingContact: companyContactPersonSchema.optional(),
});

const documentAttachmentSchema = z.object({
  name: z.string().trim().min(1, "Required Document name to proceed"),
  url: nullableString,
});

const documentRenameSchema = z.object({
  id: z.union([z.string(), z.number()]),
  new_name: z.string().trim().min(1, "Required Document name to proceed"),
});

const documentReplaceSchema = z.object({
  id: z.union([z.string(), z.number()]),
  file: z.any(),
});

export const companyDocumentsAttachmentsSchema = z.object({
  documents: z.array(documentAttachmentSchema).optional(),
  attachments: z.array(documentAttachmentSchema).optional(),
  documentsToDelete: z.array(z.union([z.string(), z.number()])).optional(),
  documentsToRename: z.array(documentRenameSchema).optional(),
  documentsToReplace: z.array(documentReplaceSchema).optional(),
});

export const companyGovernmentComplianceSchema = z.object({
  tin: nullableString,
  birRegistrationNumber: nullableString,
  cprsStatus: nullableString,
  importerAccreditationNumber: nullableString,
  importerExpirationDate: nullableDateString,
  exporterAccreditationNumber: nullableString,
  exporterExpirationDate: nullableDateString,
  authorizedRepresentatives: z.array(z.string().trim()).optional(),
  specialPermits: nullableString,
  complianceRisk: nullableString,
});

export const companyCommercialInformationSchema = z.object({
  agreedServiceRates: nullableString,
  specialDiscounts: nullableString,
  profitRangePercent: nullableString,
  notes: nullableString,
});

export const companyOperationalInstructionsSchema = z.object({
  preferredCommunicationStyle: nullableString,
  responseTimeExpectation: nullableString,
  clientSpecificSOP: nullableString,
  approvalWorkflow: nullableString,
  requiredPreAlertDetails: nullableString,
  specialInstructions: nullableString,
});

export const companyRiskIssueMonitoringSchema = z.object({
  riskMonitoringNotes: nullableString,
  issueTrackingNotes: nullableString,
  complianceMonitoringNotes: nullableString,
});

export const companyStrategicInsightSchema = z.object({
  growthOptions: z.array(z.string().trim()).optional(),
  keyInsights: nullableString,
  expansionPlan: nullableString,
  competitorsUsed: nullableString,
  upsellingOpportunities: nullableString,
  notes: nullableString,
});

export const companyFullDetailsSchema = z.object({
  companyId: z.string().optional(),
  summary: companySummarySchema,
  address: companyAddressSchema.optional(),
  keyContacts: companyKeyContactsSchema.optional(),
  governmentCompliance: companyGovernmentComplianceSchema.optional(),
  commercialInformation: companyCommercialInformationSchema.optional(),
  operationalInstructions: companyOperationalInstructionsSchema.optional(),
  riskIssueMonitoring: companyRiskIssueMonitoringSchema.optional(),
  documentsAttachments: companyDocumentsAttachmentsSchema.optional(),
  strategicInsight: companyStrategicInsightSchema.optional(),
});

export type CompanyFullDetailsSchema = z.infer<typeof companyFullDetailsSchema>;
