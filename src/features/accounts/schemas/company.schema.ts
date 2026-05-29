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
  accountHandler: nullableString,
  transactionType: nullableString,
  clientClassification: nullableString,
  companyType: nullableString,
  industry: nullableString,
  businessType: nullableString,
  businessRegistrationNumber: nullableString,
  website: nullableString,
  yearsInOperation: nullableString,
  dateOfActivation: nullableDateString,
});

const companyAddressSchema = z.object({
  registeredAddress: nullableString,
  officeAddress: nullableString,
  warehouseAddresses: optionalStringArray,
  deliveryAddresses: optionalStringArray,
  portOfUsualEntryExit: nullableString,
  countryOfOrigin: nullableString,
  countryOfDestination: nullableString,
});

const companyContactPersonSchema = z.object({
  fullName: nullableString,
  position: nullableString,
  contactNumber: nullableString,
  email: nullableString,
});

const companyKeyContactsSchema = z.object({
  primaryContact: companyContactPersonSchema.optional(),
  secondaryContact: companyContactPersonSchema.optional(),
  billingContact: companyContactPersonSchema.optional(),
});

const documentAttachmentSchema = z.object({
  name: z.string().trim().min(1, "Document name is required"),
  url: nullableString,
});

const companyDocumentsAttachmentsSchema = z.object({
  documents: z.array(documentAttachmentSchema).optional(),
  attachments: z.array(documentAttachmentSchema).optional(),
});

const companyGovernmentComplianceSchema = z.object({
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

const companyCommercialInformationSchema = z.object({
  agreedServiceRates: nullableString,
  specialDiscounts: nullableString,
  profitRangePercent: nullableString,
  notes: nullableString,
});

const companyOperationalInstructionsSchema = z.object({
  preferredCommunicationStyle: nullableString,
  responseTimeExpectation: nullableString,
  clientSpecificSOP: nullableString,
  approvalWorkflow: nullableString,
  requiredPreAlertDetails: nullableString,
  specialInstructions: nullableString,
});

const companyRiskIssueMonitoringSchema = z.object({
  riskMonitoringNotes: nullableString,
  issueTrackingNotes: nullableString,
  complianceMonitoringNotes: nullableString,
});

const companyStrategicInsightSchema = z.object({
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
