// Shared company types for the Accounts feature

export type CompanyTransactionType = "Import" | "Export" | "Both";
export type CompanyClassification = "Regular" | "VIP" | "VVIP";
export type CompanyType = "Corporation" | "Partnership" | "Sole Proprietor";
export type CompanyIndustry = "Logistics" | "Manufacturing" | "Retail";
export type CompanyBusinessType = "Local" | "International";

export interface CompanyTableRow {
  classification: string;
  companyId: string;
  companyRouteId?: string;
  companyName: string;
  consignee: string;
  accountHandler: string;
  accountHandlerImagePath?: string;
}

export const supportedIndustryIds = ["1", "2", "3", "4", "5", "6"] as const;

export type SupportedIndustryId = (typeof supportedIndustryIds)[number];

export interface CompanySummary {
  companyName: string;
  tradeName?: string | null;
  consigneeUsed?: string | null;
  accountHandler?: string | null;
  accountHandlerId?: string | null;
  transactionType?: string | null;
  transactionTypeId?: string | null;
  clientClassification?: string | null;
  clientClassificationId?: string | null;
  companyType?: string | null;
  companyTypeId?: string | null;
  industry?: string | null;
  industryIds?: string[] | null;
  industryId?: string | null;
  businessType?: string | null;
  businessTypeId?: string | null;
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
  customFlags?: string | null;
  claims?: string | null;
  monitoringNotes?: string | null;
}

export interface CompanyDocumentPayload {
  id?: number | string;
  filepath?: string | null;
  file_type?: string | null;
  name: string;
  url?: string | null;
  file?: File | string | null;
}

export interface CompanyDocumentsAttachments {
  documents?: CompanyDocumentPayload[];
  attachments?: CompanyDocumentPayload[];
  documentsToDelete?: Array<number | string>;
  documentsToRename?: Array<{
    id: number | string;
    new_name: string;
  }>;
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

export interface CompanyBackendRequest {
  basic_info?: {
    name: string;
    trade_name?: string | null;
    consignee_used?: string | null;
    account_handler_id?: string | null;
    transaction_type?: string | null;
    client_classification?: string | null;
    company_type?: string | null;
    business_type?: string | null;
    business_registration_number?: string | null;
    website?: string | null;
    years_in_operation?: number | null;
    activation_date?: string | null;
    industry?: string[] | null;
  };
  address?: {
    registered_address?: string | null;
    office_address?: string | null;
    usual_port?: string | null;
    origin_country?: string | null;
    destination_country?: string | null;
    warehouse_addresses?: string[];
    delivery_addresses?: string[];
  };
  primary?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  secondary?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  billing?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  registration?: {
    tin?: string | null;
    bir_registration_number?: string | null;
    cprs_status?: string | null;
    importer_accreditation_number?: string | null;
    importer_accreditation_expiry?: string | null;
    exporter_accreditation_number?: string | null;
    exporter_accreditation_expiry?: string | null;
    authorized_representatives?: string[];
    representatives?: string[];
    special_permits?: string | null;
    compliance_risk?: string | null;
  };
  pricing?: {
    service_rate?: string | null;
    special_discounts?: string | null;
    "3pl_profit_range"?: string | null;
    notes?: string | null;
  };
  monitoring?: {
    past_issues?: string | null;
    penalties?: string | null;
    custom_flags?: string | null;
    payment_delays?: string | null;
    claims?: string | null;
    monitoring_notes?: string | null;
  };
  operation?: {
    preferred_communication_style?: string | null;
    response_time_expectation?: string | null;
    client_specific_sop?: string | null;
    approval_workflow?: string | null;
    pre_alert_details?: string | null;
    special_instructions?: string | null;
  };
  insights?: {
    growth?: string | null;
    expansion_plan?: string | null;
    competitors?: string | null;
    opportunities?: string | null;
    notes?: string | null;
    insight_notes?: string | null;
  };
  documents?: CompanyDocumentPayload[];
  attachments?: CompanyDocumentPayload[];
  documents_to_delete?: Array<number | string>;
}

export interface CompanyListResponse {
  data: CompanyTableRow[];
  total: number;
  totalPages: number;
}

export interface CompanyCreateRequest extends Partial<CompanyBackendRequest> {}
export interface CompanyUpdateRequest extends Partial<CompanyBackendRequest> {}

export const normalizeDocumentList = (
  list?: Array<CompanyDocumentPayload>,
): Array<CompanyDocumentPayload> | undefined =>
  list
    ?.filter(
      (item) =>
        item &&
        ((item.url != null && item.url !== "") || item.file != null || item.id != null),
    )
    .map(({ id, filepath, file_type, name, url, file }) => ({ id, filepath, file_type, name, url, file }));

export const fileToBinaryString = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const bytes = new Uint8Array(arrayBuffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 1) {
        binary += String.fromCharCode(bytes[i]);
      }
      resolve(binary);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsArrayBuffer(file);
  });

export const prepareDocumentPayload = async (
  list?: Array<CompanyDocumentPayload>,
): Promise<Array<CompanyDocumentPayload> | undefined> => {
  const items = list ?? [];
  const payload: Array<CompanyDocumentPayload> = [];

  for (const item of items) {
    if (!item?.name?.trim()) continue;

    const payloadItem: CompanyDocumentPayload = {
      id: item.id,
      filepath: item.filepath,
      file_type: item.file_type,
      name: item.name,
      url: item.url ?? null,
    };

    if (item.file instanceof File) {
      payloadItem.file = item.file;
      payload.push(payloadItem);
      continue;
    }

    if (typeof item.file === "string" && item.file.trim() !== "") {
      payloadItem.file = item.file;
      payload.push(payloadItem);
      continue;
    }

    if (item.id != null) {
      // Existing documents should only be sent when a new file is attached.
      continue;
    }

    if (item.url && (item.file === null || item.file === undefined)) {
      // Do not include legacy URL-only documents in create/update payloads.
      continue;
    }
  }

  return payload.length > 0 ? payload : undefined;
};

export const isContactPersonBlank = (contact?: CompanyContactPerson | null): boolean =>
  !contact ||
  [contact.fullName, contact.position, contact.contactNumber, contact.email].every(
    (value) => !value?.trim?.()?.length,
  );

export const mapContactPersonToBackend = (
  contact?: CompanyContactPerson | null,
): { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null =>
  isContactPersonBlank(contact)
    ? null
    : {
        full_name: contact?.fullName?.trim() ?? null,
        position: contact?.position?.trim() ?? null,
        contact_number: contact?.contactNumber?.trim() ?? null,
        email: contact?.email?.trim() ?? null,
      };

export const parseYearsInOperation = (v?: string | null): number | null => {
  if (v == null) return null;
  // If it's already a numeric string, parse it
  const n = parseInt(String(v).trim(), 10);
  if (!Number.isNaN(n)) return n;
  // If it's a date string, compute years between that date and now
  const d = new Date(String(v));
  if (Number.isFinite(d.getTime())) {
    const years = new Date().getFullYear() - d.getFullYear();
    return years >= 0 ? years : null;
  }
  return null;
};

export const formatDateStringForBackend = (value?: string | null): string | null => {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime())) return null;
  return parsed.toISOString().split("T")[0];
};

const industryNameToId: Record<string, number> = {
  Logistics: 1,
  Manufacturing: 2,
  Retail: 3,
  Agriculture: 4,
  Construction: 5,
  Healthcare: 6,
};

export const normalizeIndustryToIds = (industry?: string | string[] | null): number[] | null => {
  if (!industry) {
    return null;
  }

  const values = Array.isArray(industry)
    ? industry
    : String(industry)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const ids = values
    .map((value) => industryNameToId[value])
    .filter((id): id is number => typeof id === "number");

  return ids.length > 0 ? ids : null;
};

export const mapCompanySummaryToBackend = (summary: CompanySummary) => {
  const validIndustryIds = summary.industryIds?.filter((id) =>
    supportedIndustryIds.includes(id as SupportedIndustryId),
  ) ?? [];

  const fallbackIndustryId = supportedIndustryIds.includes(summary.industryId as SupportedIndustryId)
    ? summary.industryId
    : undefined;

  return {
    name: summary.companyName,
    trade_name: summary.tradeName ?? null,
    consignee_used: summary.consigneeUsed ?? null,
    // Prefer explicit id when available, fall back to name otherwise.
    account_handler_id: summary.accountHandlerId ?? summary.accountHandler ?? null,
    transaction_type_id: summary.transactionTypeId ?? summary.transactionType ?? null,
    client_classification_id: summary.clientClassificationId ?? summary.clientClassification ?? null,
    company_type_id: summary.companyTypeId ?? summary.companyType ?? null,
    business_type_id: summary.businessTypeId ?? summary.businessType ?? null,
    business_registration_number: summary.businessRegistrationNumber ?? null,
    website: summary.website ?? null,
    years_in_operation: parseYearsInOperation(summary.yearsInOperation),
    activation_date: formatDateStringForBackend(summary.dateOfActivation),
    // Backend expects array[string] or null — send list of ID strings or fallback labels.
    industry: validIndustryIds.length > 0
      ? validIndustryIds
      : fallbackIndustryId
        ? [fallbackIndustryId]
        : summary.industry
          ? normalizeIndustryToIds(summary.industry)?.map(String) ?? null
          : null,
  };
};

export const mapAddressToBackend = (address: CompanyAddressSummary) => ({
  registered_address: address.registeredAddress ?? null,
  office_address: address.officeAddress ?? null,
  usual_port: address.portOfUsualEntryExit ?? null,
  origin_country: address.countryOfOrigin ?? null,
  destination_country: address.countryOfDestination ?? null,
  warehouse_addresses: address.warehouseAddresses ?? [],
  delivery_addresses: address.deliveryAddresses ?? [],
});

export const mapRegistrationToBackend = (registration: CompanyGovernmentCompliance) => ({
  tin: registration.tin ?? null,
  bir_registration_number: registration.birRegistrationNumber ?? null,
  cprs_status: registration.cprsStatus ?? null,
  importer_accreditation_number: registration.importerAccreditationNumber ?? null,
  importer_accreditation_expiry: formatDateStringForBackend(registration.importerExpirationDate),
  exporter_accreditation_number: registration.exporterAccreditationNumber ?? null,
  exporter_accreditation_expiry: formatDateStringForBackend(registration.exporterExpirationDate),
  authorized_representatives: registration.authorizedRepresentatives,
  representatives: registration.authorizedRepresentatives,
  special_permits: registration.specialPermits ?? null,
  compliance_risk: registration.complianceRisk ?? null,
});

export const mapCommercialToBackend = (commercial: CompanyCommercialInformation) => ({
  service_rate: commercial.agreedServiceRates ?? null,
  special_discounts: commercial.specialDiscounts ?? null,
  "3pl_profit_range": commercial.profitRangePercent ?? null,
  notes: commercial.notes ?? null,
});

export const mapOperationalToBackend = (instructions: CompanyOperationalInstructions) => ({
  preferred_communication_style: instructions.preferredCommunicationStyle ?? null,
  response_time_expectation: instructions.responseTimeExpectation ?? null,
  client_specific_sop: instructions.clientSpecificSOP ?? null,
  approval_workflow: instructions.approvalWorkflow ?? null,
  pre_alert_details: instructions.requiredPreAlertDetails ?? null,
  special_instructions: instructions.specialInstructions ?? null,
});

export const mapMonitoringToBackend = (monitoring: CompanyRiskIssueMonitoring) => ({
  past_issues: monitoring.riskMonitoringNotes ?? null,
  penalties: monitoring.complianceMonitoringNotes ?? null,
  custom_flags: monitoring.customFlags ?? null,
  payment_delays: monitoring.issueTrackingNotes ?? null,
  claims: monitoring.claims ?? null,
  monitoring_notes: monitoring.monitoringNotes ?? null,
});

export const mapInsightsToBackend = (insight: CompanyStrategicInsight) => ({
  growth: insight.growthOptions?.[0] ?? null,
  expansion_plan: insight.expansionPlan ?? null,
  competitors: insight.competitorsUsed ?? null,
  opportunities: insight.upsellingOpportunities ?? null,
  notes: insight.notes ?? null,
});

export const mapCompanyFullDetailsToBackendRequest = (
  company: CompanyFullDetails,
): CompanyCreateRequest => {
  const {
    summary,
    address,
    keyContacts,
    governmentCompliance,
    commercialInformation,
    operationalInstructions,
    riskIssueMonitoring,
    strategicInsight,
  } = company;

  return {
    basic_info: mapCompanySummaryToBackend(summary),
    address: mapAddressToBackend(address),
    primary: mapContactPersonToBackend(keyContacts?.primaryContact),
    secondary: mapContactPersonToBackend(keyContacts?.secondaryContact),
    billing: mapContactPersonToBackend(keyContacts?.billingContact),
    registration: mapRegistrationToBackend(governmentCompliance),
    pricing: mapCommercialToBackend(commercialInformation),
    monitoring: mapMonitoringToBackend(riskIssueMonitoring),
    operation: mapOperationalToBackend(operationalInstructions),
    insights: mapInsightsToBackend(strategicInsight),
  };
};

export const mapCompanyFullDetailsToBackendUpdateRequest = (
  company: CompanyFullDetails,
): CompanyUpdateRequest => {
  const full = mapCompanyFullDetailsToBackendRequest(company) as Record<string, any>;

  const pruned: Record<string, any> = Object.keys(full).reduce((acc, key) => {
    const val = full[key];

    // Omit explicit null/undefined
    if (val === null || val === undefined) return acc;

    // Omit empty arrays
    if (Array.isArray(val) && val.length === 0) return acc;

    // For objects, omit if all nested values are null/undefined/empty
    if (typeof val === "object" && !Array.isArray(val)) {
      const hasValue = Object.keys(val).some((k) => {
        const v = val[k];
        if (v === null || v === undefined) return false;
        if (Array.isArray(v) && v.length === 0) return false;
        if (typeof v === "object") return Object.keys(v).length > 0;
        return true;
      });
      if (!hasValue) return acc;
    }

    acc[key] = val;
    return acc;
  }, {} as Record<string, any>);

  return pruned as CompanyUpdateRequest;
};
