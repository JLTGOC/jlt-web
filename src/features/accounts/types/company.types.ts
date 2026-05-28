// Shared company types for the Accounts feature

export type CompanyTransactionType = "Import" | "Export" | "Both";
export type CompanyClassification = "Regular" | "VIP" | "New";
export type CompanyType = "Corporation" | "Partnership" | "Sole Proprietor";
export type CompanyIndustry = "Logistics" | "Manufacturing" | "Retail";
export type CompanyBusinessType = "Local" | "International";

export interface CompanyTableRow {
  classification: string;
  companyId: string;
  companyName: string;
  consignee: string;
  accountHandler: string;
}

export interface CompanySummary {
  companyName: string;
  tradeName?: string | null;
  consigneeUsed?: string | null;
  accountHandler?: string | null;
  transactionType?: CompanyTransactionType | null;
  clientClassification?: CompanyClassification | null;
  companyType?: CompanyType | null;
  industry?: CompanyIndustry | null;
  businessType?: CompanyBusinessType | null;
  businessRegistrationNumber?: string | null;
  website?: string | null;
  yearsInOperation?: string | null;
  dateOfActivation?: string | null;
}

export interface CompanyAddressSummary {
  registeredAddress?: string | null;
  officeAddress?: string | null;
  warehouseAddresses?: string[];
  deliveryAddresses?: string[];
  portOfUsualEntryExit?: string | null;
  countryOfOrigin?: string | null;
  countryOfDestination?: string | null;
}

export interface CompanyContactPerson {
  fullName?: string | null;
  position?: string | null;
  contactNumber?: string | null;
  email?: string | null;
}

export interface CompanyKeyContacts {
  primaryContact?: CompanyContactPerson | null;
  secondaryContact?: CompanyContactPerson | null;
  billingContact?: CompanyContactPerson | null;
}

export interface CompanyGovernmentCompliance {
  tin?: string | null;
  birRegistrationNumber?: string | null;
  cprsStatus?: string | null;
  importerAccreditationNumber?: string | null;
  importerExpirationDate?: string | null;
  exporterAccreditationNumber?: string | null;
  exporterExpirationDate?: string | null;
  authorizedRepresentatives?: string[];
  specialPermits?: string | null;
  complianceRisk?: string | null;
}

export interface CompanyCommercialInformation {
  agreedServiceRates?: string | null;
  specialDiscounts?: string | null;
  profitRangePercent?: string | null;
  notes?: string | null;
}

export interface CompanyOperationalInstructions {
  preferredCommunicationStyle?: string | null;
  responseTimeExpectation?: string | null;
  clientSpecificSOP?: string | null;
  approvalWorkflow?: string | null;
  requiredPreAlertDetails?: string | null;
  specialInstructions?: string | null;
}

export interface CompanyRiskIssueMonitoring {
  riskMonitoringNotes?: string | null;
  issueTrackingNotes?: string | null;
  complianceMonitoringNotes?: string | null;
}

export interface CompanyDocumentsAttachments {
  documents?: Array<{ name: string; url?: string | null }>;
  attachments?: Array<{ name: string; url?: string | null }>;
}

export interface CompanyStrategicInsight {
  growthOptions?: string[];
  keyInsights?: string | null;
  expansionPlan?: string | null;
  competitorsUsed?: string | null;
  upsellingOpportunities?: string | null;
  notes?: string | null;
}

export interface CompanyFullDetails {
  companyId?: string;
  summary: CompanySummary;
  address: CompanyAddressSummary;
  keyContacts: CompanyKeyContacts;
  governmentCompliance: CompanyGovernmentCompliance;
  commercialInformation: CompanyCommercialInformation;
  operationalInstructions: CompanyOperationalInstructions;
  riskIssueMonitoring: CompanyRiskIssueMonitoring;
  documentsAttachments: CompanyDocumentsAttachments;
  strategicInsight: CompanyStrategicInsight;
}

export interface CompanyListResponse {
  data: CompanyTableRow[];
  total: number;
  totalPages: number;
}

export interface CompanyCreateRequest extends Partial<CompanyFullDetails> {}
export interface CompanyUpdateRequest extends Partial<CompanyFullDetails> {}
