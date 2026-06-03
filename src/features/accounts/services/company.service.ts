import { GET, POST, PUT } from "@/lib/api/client";
import type { ApiResponse } from "@/types/api";
import type {
  CompanyListResponse,
  CompanyFullDetails,
  CompanyCreateRequest,
  CompanyUpdateRequest,
  CompanyTableRow,
} from "../types/company.types";

type CompanyListBackendItem = {
  id: string;
  name: string;
  clasification: string;
  consignee: string;
  account_handler?: { full_name: string; image_path?: string | null } | null;
};

type CompanySection =
  | "basic_info"
  | "address"
  | "contacts"
  | "registration"
  | "pricing"
  | "operation"
  | "monitoring"
  | "documents"
  | "insights";

// Backend response for a single section (API only returns one section at a time)
type CompanyBackendDetails = {
  // Common fields
  id?: number | string;
  
  // basic_info section
  name?: string;
  trade_name?: string | null;
  consignee_used?: string | null;
  account_handler_id?: number | string;
  business_registration_number?: string | null;
  website?: string | null;
  years_in_operation?: number | string | null;
  activation_date?: string | null;
  transaction_type?: string | null;
  transaction_type_other?: string | null;
  client_classification?: string | null;
  client_classification_other?: string | null;
  company_type?: string | null;
  company_type_other?: string | null;
  business_type?: string | null;
  business_type_other?: string | null;
  industry?: string[] | string | null;
  account_handler?: {
    id?: number | string;
    full_name?: string;
    username?: string;
    role?: string;
    image_path?: string | null;
  } | null;
  
  // address section
  registered_address?: string | null;
  office_address?: string | null;
  warehouse_addresses?: Array<{ id?: number; company_id?: number; address?: string }> | null;
  delivery_addresses?: Array<{ id?: number; company_id?: number; address?: string }> | null;
  usual_port?: string | null;
  origin_country?: string | null;
  destination_country?: string | null;
  
  // registration section
  tin?: string | null;
  bir_registration_number?: string | null;
  cprs_status?: string | null;
  importer_accreditation_number?: string | null;
  importer_accreditation_expiry?: string | null;
  exporter_accreditation_number?: string | null;
  exporter_accreditation_expiry?: string | null;
  representatives?: Array<{ full_name?: string }> | null;
  special_permits?: string | null;
  compliance_risk?: string | null;
  
  // pricing section (returned as array, take first item)
  service_rate?: string | null;
  special_discounts?: string | null;
  "3pl_profit_range"?: string | null;
  notes?: string | null;
  
  // operation/instructions section (returned as array, take first item)
  preferred_communication_style?: string | null;
  response_time_expectation?: string | null;
  client_specific_sop?: string | null;
  approval_workflow?: string | null;
  pre_alert_details?: string | null;
  special_instructions?: string | null;
  
  // monitoring section (returned as array, take first item)
  past_issues?: string | null;
  penalties?: string | null;
  custom_flags?: string | null;
  payment_delays?: string | null;
  claims?: string | null;
  monitoring_notes?: string | null;
  
  // documents section (returned as array)
  documents?: Array<{ id?: number; file_name?: string; file_url?: string; file_type?: string; created_at?: string; updated_at?: string }> | null;
  
  // contacts section
  primary_contact?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  secondary_contact?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  billing_contact?: { full_name?: string | null; position?: string | null; contact_number?: string | null; email?: string | null } | null;
  
  // insights section (returned as array, take first item)
  growth?: string | null;
  expansion_plan?: string | null;
  competitors?: string | null;
  opportunities?: string | null;
  insight_notes?: string | null;
};

const getString = (...values: Array<string | undefined | null>): string | null => {
  for (const value of values) {
    if (value != null && value !== "") {
      return value;
    }
  }
  return null;
};

const mapBackendCompanyToFullDetails = (backend: CompanyBackendDetails | any): CompanyFullDetails => {
  // Some sections return an array of objects (pricing, operation, monitoring, documents, insights).
  // If an array is returned, use its first item as the source for mapping.
  const data = Array.isArray(backend) ? backend[0] : backend;

  return {
    companyId: data.id?.toString(),
    summary: {
      companyName: getString(data.name, (data as any).companyName) ?? "",
      tradeName: getString(data.trade_name, (data as any).tradeName),
      consigneeUsed: getString(data.consignee_used, (data as any).consigneeUsed) ?? getString(data.consignee, null),
      accountHandler: getString(data.account_handler?.full_name, (data as any).accountHandler?.full_name),
      accountHandlerId: data.account_handler?.id != null ? String(data.account_handler.id) : null,
      transactionType: getString(data.transaction_type, (data as any).transactionType),
      clientClassification: getString(data.client_classification, (data as any).clientClassification) ?? getString(data.clasification, null),
      companyType: getString(data.company_type, (data as any).companyType),
      industry: getString(
        Array.isArray(data.industry) ? data.industry.join(", ") : data.industry,
        Array.isArray((data as any).industry) ? (data as any).industry.join(", ") : (data as any).industry,
      ),
      businessType: getString(data.business_type, (data as any).businessType),
      businessRegistrationNumber: getString(data.business_registration_number, (data as any).businessRegistrationNumber),
      website: getString(data.website, (data as any).website),
      yearsInOperation: getString(
        data.years_in_operation != null ? String(data.years_in_operation) : null,
        (data as any).yearsInOperation != null ? String((data as any).yearsInOperation) : null,
      ),
      dateOfActivation: getString(data.activation_date, (data as any).activationDate),
    },
    address: {
      registeredAddress: getString(data.registered_address, (data as any).registeredAddress),
      officeAddress: getString(data.office_address, (data as any).officeAddress),
      // Extract address strings from array of objects
      warehouseAddresses: (data.warehouse_addresses ?? [])
        .filter((item: any): item is { address?: string } => item !== null && item !== undefined)
        .map((item: any) => item.address ?? "")
        .filter(Boolean),
      deliveryAddresses: (data.delivery_addresses ?? [])
        .filter((item: any): item is { address?: string } => item !== null && item !== undefined)
        .map((item: any) => item.address ?? "")
        .filter(Boolean),
      portOfUsualEntryExit: getString(data.usual_port, data.port_of_usual_entry_exit, (data as any).portOfUsualEntryExit),
      countryOfOrigin: getString(data.origin_country, data.country_of_origin, (data as any).countryOfOrigin),
      countryOfDestination: getString(data.destination_country, data.country_of_destination, (data as any).countryOfDestination),
    },
    keyContacts: {
      primaryContact: data.primary_contact ? {
        fullName: data.primary_contact.full_name,
        position: data.primary_contact.position,
        contactNumber: data.primary_contact.contact_number,
        email: data.primary_contact.email,
      } : null,
      secondaryContact: data.secondary_contact ? {
        fullName: data.secondary_contact.full_name,
        position: data.secondary_contact.position,
        contactNumber: data.secondary_contact.contact_number,
        email: data.secondary_contact.email,
      } : null,
      billingContact: data.billing_contact ? {
        fullName: data.billing_contact.full_name,
        position: data.billing_contact.position,
        contactNumber: data.billing_contact.contact_number,
        email: data.billing_contact.email,
      } : null,
    },
    governmentCompliance: {
      tin: getString(data.tin, (data as any).tin),
      birRegistrationNumber: getString(data.bir_registration_number, (data as any).birRegistrationNumber),
      cprsStatus: getString(data.cprs_status, (data as any).cprsStatus),
      importerAccreditationNumber: getString(data.importer_accreditation_number, (data as any).importerAccreditationNumber),
      importerExpirationDate: getString(data.importer_accreditation_expiry, (data as any).importerExpirationDate),
      exporterAccreditationNumber: getString(data.exporter_accreditation_number, (data as any).exporterAccreditationNumber),
      exporterExpirationDate: getString(data.exporter_accreditation_expiry, (data as any).exporterExpirationDate),
      // Extract full_name from representatives array
      authorizedRepresentatives: (data.representatives ?? []).map((rep: any) => rep.full_name ?? "").filter(Boolean),
      specialPermits: getString(data.special_permits, (data as any).specialPermits),
      complianceRisk: getString(data.compliance_risk, (data as any).complianceRisk),
    },
    commercialInformation: {
      agreedServiceRates: getString(data.service_rate ?? data.agreed_service_rates, (data as any).agreedServiceRates),
      profitRangePercent: getString((data as any)["3pl_profit_range"] ?? (data as any).profit_range ?? (data as any).profitRangePercent, (data as any).profitRangePercent),
      specialDiscounts: getString(data.special_discounts ?? (data as any).specialDiscounts, (data as any).specialDiscounts),
      notes: getString(data.notes ?? (data as any).notes, (data as any).notes),
    },
    operationalInstructions: {
      preferredCommunicationStyle: getString(data.preferred_communication_style, (data as any).preferredCommunicationStyle),
      responseTimeExpectation: getString(data.response_time_expectation, (data as any).responseTimeExpectation),
      clientSpecificSOP: getString(data.client_specific_sop, (data as any).clientSpecificSOP),
      approvalWorkflow: getString(data.approval_workflow, (data as any).approvalWorkflow),
      requiredPreAlertDetails: getString(data.pre_alert_details ?? data.required_pre_alert_details, (data as any).requiredPreAlertDetails),
      specialInstructions: getString(data.special_instructions, (data as any).specialInstructions),
    },
    riskIssueMonitoring: {
      riskMonitoringNotes: getString(data.past_issues, (data as any).riskMonitoringNotes),
      issueTrackingNotes: getString(data.payment_delays, (data as any).issueTrackingNotes),
      complianceMonitoringNotes: getString(data.penalties, (data as any).complianceMonitoringNotes),
      customFlags: getString(data.custom_flags, (data as any).customFlags),
      claims: getString(data.claims, (data as any).claims),
      monitoringNotes: getString(data.monitoring_notes, (data as any).monitoringNotes),
    },
   documentsAttachments: (() => {
    // Convert various backend shapes into documents/attachments arrays.
    // Cases:
    // 1) The unwrapped payload is an array of file objects (e.g. [{file_name,...}, ...])
    // 2) The payload is an object with documents and/or attachments arrays
    const docs: Array<{ name: string; url?: string | null }> = [];
    const atts: Array<{ name: string; url?: string | null }> = [];

    if (Array.isArray(backend) && backend.length > 0) {
    const first = backend[0] as any;
    // Heuristic: if items look like file objects, map the whole array into documents
    if (first && (first.file_name || first.file_url || first.name || first.url)) {
    backend.forEach((doc: any) => {
    docs.push({ name: doc.file_name ?? doc.name ?? "", url: doc.file_url ?? doc.url ?? null });
    });
    return { documents: docs, attachments: atts };
    }
    }

    // Fallback: read documents/attachments from the data object (if present)
    (data.documents ?? []).forEach((doc: any) =>
    docs.push({ name: doc.file_name ?? doc.name ?? "", url: doc.file_url ?? doc.url ?? null }),
    );
    (data.attachments ?? []).forEach((att: any) =>
    atts.push({ name: att.file_name ?? att.name ?? "", url: att.file_url ?? att.url ?? null }),
    );

    return { documents: docs, attachments: atts };
    })(),
    strategicInsight: {
      growthOptions: data.growth ? [data.growth] : undefined,
      keyInsights: getString(data.insight_notes ?? data.notes ?? (data as any).keyInsights, (data as any).keyInsights),
      expansionPlan: getString(data.expansion_plan, (data as any).expansionPlan),
      competitorsUsed: getString(data.competitors, (data as any).competitorsUsed),
      upsellingOpportunities: getString(data.opportunities, (data as any).upsellingOpportunities),
      notes: getString(data.insight_notes ?? data.notes, (data as any).notes),
    },
  };
};

export const companyService = {
  async getCompaniesList(
    page = 1,
    perPage = 10,
    filters?: Record<string, unknown>,
  ): Promise<CompanyListResponse> {
    const response = await GET<ApiResponse<CompanyListBackendItem[]>>("/companies", {
      params: { page, per_page: perPage, ...filters },
    });

    const rows: CompanyTableRow[] = (response.data ?? []).map((company) => ({
      companyId: company.id,
      companyRouteId: company.id,
      companyName: company.name,
      classification: company.clasification,
      consignee: company.consignee,
      accountHandler: company.account_handler?.full_name ?? "",
      accountHandlerImagePath: company.account_handler?.image_path ?? undefined,
    }));

    return {
      data: rows,
      total: rows.length,
      totalPages: 1,
    };
  },

  async getCompanyById(id: string, section: CompanySection = "basic_info"): Promise<CompanyFullDetails> {
    // Use the ID as provided by the caller (keep backend route identifier unchanged)
    // Backend expects a numeric boolean flag per-section (e.g. basic_info=1)
    const params: Record<string, number> = {};
    if (section) params[section] = 1;

    console.debug(`[companyService] Fetching company: /companies/${id} with params`, params);

    const response = await GET<ApiResponse<CompanyBackendDetails>>(`/companies/${id}`, {
      params,
    });

    console.debug(`[companyService] Response wrapper keys:`, Object.keys(response.data ?? {}));
    console.debug(`[companyService] Full response wrapper:`, response.data);

    // Some backend endpoints return an ApiResponse wrapper with a `data` field
    // that contains the actual section payload (sometimes as an array).
    const payload = (response.data && (response.data as any).data) ? (response.data as any).data : response.data;

    console.debug(`[companyService] Unwrapped payload:`, payload);

    return mapBackendCompanyToFullDetails(payload ?? {});
  },

  async createCompany(payload: CompanyCreateRequest): Promise<CompanyFullDetails> {
    const response = await POST<ApiResponse<CompanyBackendDetails>>("/companies", payload);
    const payloadData = (response && (response as any).data) ? (response as any).data : response;
    return mapBackendCompanyToFullDetails(payloadData ?? {});
  },

  async updateCompany(id: string, payload: CompanyUpdateRequest): Promise<CompanyFullDetails> {
    // Clean nulls/undefined from payload so backend doesn't receive explicit `null` values
    const cleanNulls = (obj: any) => JSON.parse(JSON.stringify(obj, (_, v) => (v === null ? undefined : v)));
    try {
      const cleaned = cleanNulls(payload);
      console.debug(`[companyService] updateCompany payload (cleaned) for id=${id}:`, cleaned);
      const response = await PUT<ApiResponse<CompanyBackendDetails>>(`/companies/${id}`, cleaned);
      const payloadData = (response && (response as any).data) ? (response as any).data : response;
      return mapBackendCompanyToFullDetails(payloadData ?? {});
    } catch (err: any) {
      // Log raw payload for debugging if cleaning/PUT fails
      console.error(`[companyService] updateCompany failed for id=${id}. Raw payload:`, payload);
      // If axios style response exists, log status and data
      if (err?.response) {
        try {
          console.error(`[companyService] updateCompany response status: ${err.response.status}`);
          console.error(`[companyService] updateCompany response data:`, err.response.data);
        } catch (inner) {
          console.error("Error while logging response details", inner);
        }
      }
      throw err;
    }
  },

  async archiveCompany(id: string): Promise<{ success: boolean }> {
    const response = await POST<ApiResponse<{ success: boolean }>>(`/companies/${id}/archive`);
    return response.data;
  },

  async uploadDocuments(id: string, files: File[]): Promise<Array<{ name: string; url: string }>> {
    const form = new FormData();
    files.forEach((file) => form.append("files", file));

    const response = await POST<ApiResponse<Array<{ name: string; url: string }>>>(
      `/companies/${id}/documents`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data;
  },
};
