import * as z from "zod";

const nullableString = z.string().trim().optional().nullable();
const optionalStringArray = z.array(z.string().trim()).optional();
const nullableDateString = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value === "" ? null : value));

export const companySummarySchema = z.object({
  companyName: z.string().trim().min(1, "Company Name is required"),
  tradeName: nullableString,
  consigneeUsed: nullableString,
  accountHandler: z.string().trim().min(1, "Account Handler is required"),
  accountHandlerId: nullableString,
  transactionType: nullableString,
  transactionTypeId: nullableString,
  clientClassification: nullableString,
  clientClassificationId: nullableString,
  companyType: nullableString,
  companyTypeId: nullableString,
  industry: nullableString,
  businessType: nullableString,
  businessTypeId: nullableString,
  businessRegistrationNumber: nullableString,
  website: nullableString,
  yearsInOperation: nullableString,
  dateOfActivation: nullableDateString,
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
        message: "Full Name is required",
        path: ["fullName"],
      });
    }
    if (!contact.position?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Position is required",
        path: ["position"],
      });
    }
    if (!contact.contactNumber?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Contact Number is required",
        path: ["contactNumber"],
      });
    }
    if (!contact.email?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Email is required",
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
  name: z.string().trim().min(1, "Document name is required"),
  url: nullableString,
});

export const companyDocumentsAttachmentsSchema = z.object({
  documents: z.array(documentAttachmentSchema).optional(),
  attachments: z.array(documentAttachmentSchema).optional(),
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
